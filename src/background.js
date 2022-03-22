import TogglClient from 'toggl-api';
import 'babel-polyfill'


// Where we will expose all the data we retrieve from storage.sync.
const storageCache = {};

let client;
// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = getAllStorageSyncData().then(items => {
    // Copy the data retrieved from storage into storageCache.
    Object.assign(storageCache, items);
}).then(() => {

    client = new TogglClient({
        apiToken: storageCache.token
    })


    client.getWorkspaces((err, workspaces) => {
        if (err) {
            console.log("Error getting workspaces: ", err)
        } else {

            chrome.storage.sync.set({
                workspaces: workspaces
            })
            workspaces.forEach(ws => {
                console.log('ws', ws)
                client.getWorkspaceProjects(ws.id, {
                    active: 'both'
                }, (err, projects) => {
                    if (err) {
                        console.log("Error getting projects from workspace: ", err)
                    } else {
                        chrome.storage.sync.set({
                            projects: projects
                        })
                    }
                })
            });
        }

    })

    client.getTimeEntries(
        getPreviousMonday(),
        new Date().toISOString(),
        (err, timeEntries) => {
            if (err) {
                console.log("Error getting timeEntries: ", err);
            } else {
                timeEntries.forEach((entry) => {
                    entry.isRunning = entry.duration < 0
                });

                chrome.storage.sync.set({
                    entries: timeEntries,
                })
            }
        }
    )




})


// chrome.action.onClicked.addListener(async (tab) => {
//     try {
//         await initStorageCache;
//     } catch (e) {
//         // Handle error that occurred during storage initialization.
//     }

//     console.log('Testing')
//     // Normal action handler logic.
// });








function getPreviousMonday() {
    var date = new Date();
    var day = date.getDay();
    var prevMonday = new Date();
    if (date.getDay() === 0) {
        prevMonday.setDate(date.getDate() - 7);
    } else {
        prevMonday.setDate(date.getDate() - (day - 1));
    }
    prevMonday.setHours(0, 0, 0, 0);
    return prevMonday.toISOString();
}


// Reads all data out of storage.sync and exposes it via a promise.
//
// Note: Once the Storage API gains promise support, this function
// can be greatly simplified.
function getAllStorageSyncData() {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        // Asynchronously fetch all data from storage.sync.
        chrome.storage.sync.get(null, (items) => {
            // Pass any observed errors down the promise chain.
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            // Pass the data retrieved from storage down the promise chain.
            resolve(items);
        });
    });
}