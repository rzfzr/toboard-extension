import TogglClient from 'toggl-api';
import 'babel-polyfill'
import {
    getTime,
    getPreviousMonday
} from './utils'

const storageCache = {};
let client;

const initStorageCache = getAllStorageSyncData().then(items => {
    Object.assign(storageCache, items);
}).then(() => {
    console.log('Background', storageCache)
    client = new TogglClient({
        apiToken: storageCache.token
    })
    getWorkspaces()
    getTimeEntries()
})

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