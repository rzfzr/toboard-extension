import TogglClient from 'toggl-api';
import 'babel-polyfill'
import {
    getTime,
    getPreviousMonday
} from './utils'

const storageCache = {};
let client;


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
const updateCache = async () => {
    Object.assign(storageCache, await getAllStorageSyncData());
}

(async () => {
    console.log('Start Background')

    await updateCache()

    client = new TogglClient({
        apiToken: storageCache.token
    })

    const workspaces = await getWorkspaces()
    const projects = await getProjects(workspaces)
    const timeEntries = await getTimeEntries()

    chrome.storage.local.set({
        workspaces: workspaces,
        projects: projects,
        entries: timeEntries,
    })

    updateCache()

    console.log('End Background')
})()

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        const message = request.message
        const entry = request.entry

        switch (message) {
            case 'getAll':
                (async () => {
                    sendResponse({
                        entries: await getTimeEntries(),
                        projects: await getProjects(storageCache.workspaces),
                    });
                })()
                return true;
                break;
            case 'toggle':
                const description = entry.description
                const pid = entry.project.id
                toggleEntry(description, pid)
                sendResponse({
                    status: 'ok'
                })
                break;
            default:
                sendResponse({
                    error: 'Unknown request'
                })
                break;
        }
    }
);



async function getWorkspaces() {
    return await new Promise((resolve, reject) => {
        client.getWorkspaces((err, workspaces) => {
            if (err) return reject(error)
            resolve(workspaces)
        })
    })
}

async function getProjects(workspaces) {
    return await new Promise((resolve, reject) => {
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
    console.log('will get time entries from ', client)
    return await new Promise((resolve, reject) => {
        client.getTimeEntries(
            getPreviousMonday(),
            new Date().toISOString(),
            (err, timeEntries) => {
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