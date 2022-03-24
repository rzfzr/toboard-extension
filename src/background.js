import TogglClient from 'toggl-api';
import 'babel-polyfill'
import {
    getTime,
    getPreviousMonday
} from './utils'

const storageCache = {};
let client;

console.log('Background')

const initStorageCache = getAllStorageSyncData().then(items => {
    Object.assign(storageCache, items);
}).then(() => {
    console.log('InitStorage', storageCache)
    client = new TogglClient({
        apiToken: storageCache.token
    })
    getWorkspaces()
    getTimeEntries()
})



chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request)

        const description = request.entry.description
        const pid = request.entry.project.id

        toggleEntry(description, pid)
        // sendResponse({
        //     farewell: "goodbye"
        // });
    }
);


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

function getWorkspaces() {
    client.getWorkspaces((err, workspaces) => {
        if (err) {
            console.log("Error getting workspaces: ", err)
        } else {
            chrome.storage.local.set({
                workspaces: workspaces
            })
            getProjects(workspaces)
        }
    })
}

function getProjects(workspaces) {
    workspaces.forEach(ws => {
        client.getWorkspaceProjects(ws.id, {
            active: 'both'
        }, (err, projects) => {
            if (err) {
                console.log("Error getting projects from workspace: ", err)
            } else {
                chrome.storage.local.set({
                    projects: projects
                })
            }
        })
    });
}

function getTimeEntries() {
    client.getTimeEntries(
        getPreviousMonday(),
        new Date().toISOString(),
        (err, timeEntries) => {
            if (err) {
                console.log("Error getting timeEntries: ", err);
            } else {

                timeEntries.forEach((entry) => {
                    entry.isRunning = entry.duration < 0
                    entry.time = getTime(entry.duration)
                });
                console.log('getting entries', timeEntries)
                chrome.storage.local.set({
                    entries: timeEntries,
                })
            }
        }
    )
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