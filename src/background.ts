//@ts-nocheck
import TogglClient from 'toggl-api'
import 'babel-polyfill'

import {
    getTime,
    getPreviousMonday
} from './utils'

let togglClientInstance: any = null

async function getTogglClient() {

    if (togglClientInstance) {
        return togglClientInstance
    }

    const { apiToken } = await getAllStorageSyncData()

    if (!apiToken) {
        return null
    }

    try {
        togglClientInstance = new TogglClient({ apiToken })
    } catch (error) {
        console.log("Error initializing TogglClient:", error)
    }

    console.log('returning client', togglClientInstance)

    return togglClientInstance
}


function getAllStorageSyncData() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError)
            }
            resolve(items)
        })
    })
}

let storageCache = {}

const timers = {
    cache: 1000 * 5,//5 seconds
    workspaces: 1000 * 60 * 60 * 12,//12 houwrs
    projects: 1000 * 60 * 60 * 2,//2 hours
    entries: 1000 * 30,//30 seconds
}
const isExpired = (selection: any) => {
    //this is only working as inteded for 'cache', everything else is being postponed if cache is refreshed
    //there should have a time value for each
    return Date.now() - storageCache.cacheTime > timers[selection]
}

const syncStorage = async () => {
    try {
        await chrome.runtime.sendMessage({ action: "syncStorage" })
    } catch (error) {
        console.log('Error refreshing storage', error)
    }
}

// chrome.storage.onChanged.addListener(function(changes, namespace) {
//     for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//       console.log(
//         `Storage key "${key}" in namespace "${namespace}" changed.`,
//         `Old value was "${oldValue}", new value is "${newValue}".`
//       );
//     }
//     chrome.runtime.sendMessage({ action: "syncStorage" });
//   });


const getCache = async () => {
    // if (!!storageCache.cacheTime && !isExpired('cache')) {//it has to exist and not have expired
    //     console.log('not expired', storageCache,)
    //     syncStorage()
    //     return storageCache
    // }

    let { apiToken, workspaces, projects, entries } = await getAllStorageSyncData()

    if (!apiToken) {
        console.log('no api token')
        return
    }

    const client = await getTogglClient()

    if (!workspaces || workspaces.length === 0 || isExpired('workspaces')) {
        workspaces = await getWorkspaces(client)
        chrome.storage.local.set({
            workspaces
        })
    }

    if (!projects || projects.length === 0 || isExpired('projects')) {
        projects = await getProjects(client, workspaces[0])
        chrome.storage.local.set({
            projects
        })
    }

    if (!entries || entries.length === 0 || isExpired('entries')) {
        entries = await getTimeEntries(client)
        chrome.storage.local.set({
            entries
        })
    }
    syncStorage()
    storageCache = {
        cacheTime: Date.now(),
        apiToken,
        workspaces,
        projects,
        entries
    }
    console.log('setting cache', storageCache)
    return storageCache
}

(async () => {
    console.log('-> Starting service worker at', getTime(new Date().getTime()))
    getCache()
})()

chrome.runtime.onMessage.addListener(
    function ({
        message,
        entry
    }, sender, sendResponse) {
        switch (message) {
            case 'refresh':
                getCache()
                sendResponse({
                    status: 'ok'
                })
                break
            case 'toggle':
                (async () => {
                    toggleEntry(entry.description, entry?.project?.id)
                    sendResponse({
                        status: 'ok'
                    })
                })()
                break
            default:
                sendResponse({
                    error: 'Unknown request'
                })
                break
        }
        return true
    }
)

async function getWorkspaces(client) {
    return await new Promise((resolve, reject) => {
        if (!client) reject([])
        client.getWorkspaces((err, workspaces) => {
            if (err) return reject(err)
            resolve(workspaces)
        })
    })
}

async function getProjects(client, workspace) {
    return await new Promise((resolve, reject) => {
        client.getWorkspaceProjects(workspace.id, (err, projects) => {
            if (err) return reject(err)
            resolve(projects)
        })
    })
}

async function getTimeEntries(client) {
    return await new Promise(async (resolve, reject) => {
        client.getTimeEntries(
            getPreviousMonday(),
            new Date().toISOString(),
            (err, timeEntries) => {
                if (err) reject(err)
                timeEntries.forEach((entry) => {
                    entry.isRunning = entry.duration < 0
                    entry.time = getTime(entry.duration)
                })
                resolve(timeEntries)
            }
        )
    })
}

async function toggleEntry(entryDescription, projectID) {
    const client = await getTogglClient()
    const timeEntry = await client.getCurrentTimeEntry()

    if (timeEntry?.pid == projectID &&
        timeEntry?.description == entryDescription) {
        stopEntry(timeEntry)

    } else {
        startEntry(entryDescription, projectID)
    }
}

async function startEntry(description, pid) {
    const client = await getTogglClient()
    const { workspaces } = await getCache()

    const startedEntry = await client.startTimeEntry({
        workspace_id: workspaces[0].id,
        duration: -1,
        description: description,
        pid: pid,
        start: new Date().toISOString()
    })

    console.log('-> Created:', startedEntry.id)
    syncStorage()
}

async function stopEntry(entry) {
    const client = await getTogglClient()
    const stoppedEntry = await client.stopTimeEntry(entry.wid, entry.id)
    console.log('-> Stopped:', stoppedEntry.id)
    syncStorage()
}
