//@ts-nocheck
import TogglClient from 'toggl-api';
import 'babel-polyfill'

import {
    getTime,
    getPreviousMonday
} from './utils'

let togglClientInstance = null;

async function getTogglClient() {
    const { apiToken } = await getAllStorageSyncData();
    if (!togglClientInstance) {
        try {
            togglClientInstance = new TogglClient({ apiToken });
        } catch (error) {
            console.log("Error initializing TogglClient:", error);
        }
    }
    return togglClientInstance;
}


function getAllStorageSyncData() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(null, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(items);
        });
    });
}

let storageCache = {}

const timers = {
    cache: 1000 * 5,//5 seconds
    workspaces: 1000 * 60 * 60 * 12,//12 houwrs
    projects: 1000 * 60 * 60 * 2,//2 hours
    entries: 1000 * 30,//30 seconds
}
const isExpired = (selection) => {
    //this is only working as inteded for 'cache', everything else is being postponed if cache is refreshed
    //there should have a time value for each
    return Date.now() - storageCache.cacheTime > timers[selection]
}

const getCache = async () => {

    if (!!storageCache.cacheTime && !isExpired('cache')) {//it has to exist and not have expired
        console.log('not expired', storageCache,)
        return storageCache
    }

    let { apiToken, workspaces, projects, entries } = await getAllStorageSyncData()
    let client = {}
    console.log('getting cache', apiToken, workspaces, projects, entries)
    try {
        client = new TogglClient({ apiToken })
    } catch (error) {
        console.log("Toggl's API token was not set")
    }

    if (!workspaces || workspaces.length === 0 || isExpired('workspaces')) {
        workspaces = await getWorkspaces(client)
        chrome.storage.sync.set({
            workspaces
        })
    }

    if (!projects || projects.length === 0 || isExpired('projects')) {
        projects = await getProjects(client, workspaces)
        chrome.storage.sync.set({
            projects
        })
    }

    console.log('checking')
    if (!entries || entries.length === 0 || isExpired('entries')) {
        console.log('not found')
        entries = await getTimeEntries(client)
        chrome.storage.sync.set({
            entries
        })
    }

    storageCache = {
        cacheTime: Date.now(),
        apiToken,
        client,
        workspaces,
        projects,
        entries
    }
    return storageCache
}

(async () => {
    console.log('Starting service worker at', getTime(new Date().getTime()))
    const cache = await getCache()
    console.log('cache', cache)


})()

chrome.runtime.onMessage.addListener(
    function ({
        message,
        entry
    }, sender, sendResponse) {
        switch (message) {
            case 'toggle':
                (async () => {
                    toggleEntry(entry.description, entry.project.id)
                    sendResponse({
                        status: 'ok'
                    })
                })()
                break;
            default:
                sendResponse({
                    error: 'Unknown request'
                })
                break;
        }
        return true;
    }
);

async function getWorkspaces(client) {
    return await new Promise((resolve, reject) => {
        if (!client) reject([])
        client.getWorkspaces((err, workspaces) => {
            if (err) return reject(error)
            resolve(workspaces)
        })
    })
}

async function getProjects(client, workspaces) {
    return await new Promise((resolve, reject) => {
        console.log('will check ', client, workspaces, !!workspaces)
        if (!client) {
            console.log('rejecting cause of client')
            reject([])
        }
        if (!workspaces) {
            console.log('rejecting cause of workspaces')
            reject([])
        }
        console.log('tring to get workspaces', workspaces)
        workspaces.forEach(ws => {
            client.getWorkspaceProjects(ws.id, (err, projects) => {
                if (err) return reject(error)
                console.log('resolving p', projects)
                resolve(projects)
            })
        });
    })
}

async function getTimeEntries(client) {
    return await new Promise((resolve, reject) => {
        console.log('getting timeentries', client)
        client.getTimeEntries(
            getPreviousMonday(),
            new Date().toISOString(),
            (err, timeEntries) => {
                console.log('gott', err, timeEntries)
                if (err) reject(err)
                timeEntries.forEach((entry) => {
                    entry.isRunning = entry.duration < 0
                    entry.time = getTime(entry.duration)
                });
                resolve(timeEntries)
            }
        )
    })
}

function toggleEntry(entryDescription, projectID) {
    console.log('Togglying: ', entryDescription, projectID);
    client.getCurrentTimeEntry((err, timeEntry) => {
        if (err) console.log(err);
        else {
            if (timeEntry) {
                console.log("Something already running: ", timeEntry.description, timeEntry.pid);
                console.log("Checking if it is:", entryDescription, projectID);
                if (timeEntry.pid == projectID && timeEntry.description == entryDescription) {
                    console.log('Matched! Stopping');
                    stopEntry(timeEntry.id)
                } else {
                    console.log('Not Matched! Starting new');
                    createEntry(entryDescription, projectID);
                }
            } else {
                console.log("Nothing running! Starting new");
                createEntry(entryDescription, projectID);
            }
        }
    });
}

function createEntry(entryDescription, projectID) {
    console.log("Creating: " + entryDescription, projectID);
    client.startTimeEntry({
        description: entryDescription,
        pid: projectID,
    },
        (err, timeEntry) => {
            if (err) console.log(err);
            else {
                console.log("succefully started: ", timeEntry);
                // this.$store.state.timeEntries.push(timeEntry);
                // this.$store.commit("setRunningEntry", timeEntry);
            }
        }
    );
}

function stopEntry(entryID) {
    console.log("Stopping: " + entryID);
    client.stopTimeEntry(entryID, (err, timeEntry) => {
        if (err) console.log(err);
        else {
            console.log("succefully stopped ", timeEntry);
            // this.$store.commit("setRunningEntry", {});
        }
    });
}
