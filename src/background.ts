//@ts-nocheck
import TogglClient from 'toggl-api'
import 'babel-polyfill'

import {
    getTime,
    getPreviousMonday
} from './utils'

let togglClientInstance = null

async function getTogglClient() {

    if (togglClientInstance) {
        return togglClientInstance
    }

    const { apiToken } = await getAllStorageSyncData()
    try {
        togglClientInstance = new TogglClient({ apiToken })
    } catch (error) {
        console.log("Error initializing TogglClient:", error)
    }
    return togglClientInstance
}


function getAllStorageSyncData() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(null, (items) => {
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

    if (!entries || entries.length === 0 || isExpired('entries')) {
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
        })
    })
}

async function getTimeEntries(client) {
    return await new Promise(async (resolve, reject) => {
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
                })
                resolve(timeEntries)
            }
        )
    })
}

async function toggleEntry(entryDescription, projectID) {
    console.log('-> Toggling: ', entryDescription, projectID)
    const client = await getTogglClient()
    const timeEntry = await client.getCurrentTimeEntry()

    console.log("-> Current entry: ", timeEntry?.description, timeEntry?.pid)

    if (timeEntry?.pid == projectID &&
        timeEntry?.description == entryDescription) {
        stopEntry(timeEntry)

    } else {
        startEntry(entryDescription, projectID)
    }
}

async function startEntry(description, pid) {
    console.log("-> Creating: " + description, pid)
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
}

async function stopEntry(entry) {
    console.log("-> Stopping:", entry.id)
    const client = await getTogglClient()
    const stoppedEntry = await client.stopTimeEntry(entry.wid, entry.id)
    console.log('-> Stopped:', stoppedEntry.id)
}
