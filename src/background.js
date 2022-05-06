import TogglClient from 'toggl-api';
import 'babel-polyfill'
import {
    getTime,
    getPreviousMonday
} from './utils'

function getAllStorageSyncData() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(items);
        });
    });
}

let storageCache={}

const getCache=async () => {
    if (Date.now()-storageCache.cacheTime<5*1000) {
        return storageCache
    }

    let { apiToken, workspaces, projects, entries }=await getAllStorageSyncData()

    let client={}
    try {
        client=new TogglClient({ apiToken })
    } catch (error) {
        console.log("Toggl's API token was not set")
    }

    if (!workspaces||workspaces.length===0) {//todo these should be parallel
        console.log('no workspaces, getting them')
        workspaces=await getWorkspaces(client)
        chrome.storage.local.set({
            workspaces
        })
    }

    if (!projects||projects.length===0) {//todo these should be parallel
        console.log('no projects, getting them')
        projects=await getProjects(client, workspaces)
        chrome.storage.local.set({
            projects
        })
    }

    if (!entries||entries.length===0) {//todo these should be parallel
        console.log('no entries, getting them')
        entries=await getTimeEntries(client)
        chrome.storage.local.set({
            entries
        })
    }

    storageCache={
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
    getCache()
})()

chrome.runtime.onMessage.addListener(
    function ({
        message,
        entry
    }, sender, sendResponse) {
        switch (message) { // all cases should sendResponse, because of return true
            case 'getAll':
                (async () => {
                    const { entries, projects }=await getCache()
                    console.log('Asking for everything')
                    console.table(entries)
                    sendResponse({
                        entries,
                        projects,
                    });
                })()
                break;
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
        console.log('trying to get workspaces', client)
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
        client.getTimeEntries(
            getPreviousMonday(),
            new Date().toISOString(),
            (err, timeEntries) => {
                if (err) reject(err)
                timeEntries.forEach((entry) => {
                    entry.isRunning=entry.duration<0
                    entry.time=getTime(entry.duration)
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
                if (timeEntry.pid==projectID&&timeEntry.description==entryDescription) {
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
    console.log("Creating: "+entryDescription, projectID);
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
    console.log("Stopping: "+entryID);
    client.stopTimeEntry(entryID, (err, timeEntry) => {
        if (err) console.log(err);
        else {
            console.log("succefully stopped ", timeEntry);
            // this.$store.commit("setRunningEntry", {});
        }
    });
}