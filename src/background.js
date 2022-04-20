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
const getCache=async () => {
    const storageCache={}
    Object.assign(storageCache, await getAllStorageSyncData());
    return storageCache
}
let client=false

const updateClient=async () => {
    const token=(await getCache()).token
    if (!token) {
        console.log("Toggl's API token was not set")
        return
    }
    client=new TogglClient({
        apiToken: token
    })
}

const updateWorkspaces=async () => {
    chrome.storage.local.set({
        workspaces: await getWorkspaces(),
    })
}
// const projects = await getProjects(workspaces)
// const timeEntries = await getTimeEntries()

// projects: projects,
// entries: timeEntries,


(async () => {
    console.log('Start Background')

    await updateClient()
    updateWorkspaces()

    console.log('End Background')
})()

chrome.runtime.onMessage.addListener(
    function ({
        message,
        entry
    }, sender, sendResponse) {
        switch (message) { // all cases should sendResponse, because of return true
            case 'getAll':
                (async () => {
                    await updateClient()
                    sendResponse({
                        entries: await getTimeEntries(),
                        projects: await getProjects((await getCache()).workspaces),
                    });
                })()
                break;
            case 'toggle':
                (async () => {
                    await updateClient()
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

async function getWorkspaces() {
    return await new Promise((resolve, reject) => {
        if (!client) return reject('No client')
        client.getWorkspaces((err, workspaces) => {
            if (err) return reject(error)
            resolve(workspaces)
        })
    })
}

async function getProjects(workspaces) {
    return await new Promise((resolve, reject) => {
        if (!client) return reject('No client')
        workspaces.forEach(ws => {
            client.getWorkspaceProjects(ws.id, {
                active: 'both'
            }, (err, projects) => {
                if (err) return reject(error)
                resolve(projects)
            })
        });
    })
}

async function getTimeEntries() {
    return await new Promise((resolve, reject) => {
        if (!client) return reject('No client')
        client.getTimeEntries(
            getPreviousMonday(),
            new Date().toISOString(),
            (err, timeEntries) => {
                if (err) reject(err)
                timeEntries.forEach((entry) => {
                    entry.isRunning=entry.duration<0
                    entry.time=getTime(entry.duration)
                });
                console.log('getting timeentries')
                console.table(timeEntries)
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