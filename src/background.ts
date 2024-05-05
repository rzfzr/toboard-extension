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
    workspaces: 1000 * 60 * 60 * 12,//12 hours
    projects: 1000 * 60 * 60 * 2,//2 hours
}
const isExpired = (selection: any) => {
    //this is only working as inteded for 'cache', everything else is being postponed if cache is refreshed
    //there should have a time value for each
    return Date.now() - storageCache.cacheTime > timers[selection]
}

const getCache = async () => {

    // if (!!storageCache.cacheTime && !isExpired('cache')) {//it has to exist and not have expired
    //     console.log('not expired', storageCache,)
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

    entries = await getTimeEntries(client)
    chrome.storage.local.set({
        entries
    })

    storageCache = {
        cacheTime: Date.now(),
        apiToken,
        workspaces,
        projects,
        entries
    }
    return storageCache
}

(async () => {
    console.log('-> Starting service worker at', getTime(new Date().getTime()))
    chrome.runtime.onConnect.addListener(function (port) {
        console.assert(port.name === "toboard")
        port.onMessage.addListener(function (msg: string) {
            switch (msg) {
                case "syncStorage":
                    getCache()
                    // port.postMessage({ question: "Who's there?" })
                    break
                default:
                    console.log('Unknown message:', msg)
                    break
            }
        })
    })

    setInterval(() => {
        getCache()
    }, 1000 * 60 * 1)
})()

chrome.runtime.onMessage.addListener(
    function ({
        message,
        description,
        projectId
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
                    const result = await toggleEntry(description, projectId)
                    sendResponse(result)
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

    const diffEntries = []
    if (!timeEntry) {//nothing running, just start
        diffEntries.push({
            entry: await startEntry(entryDescription, projectID),
            status: 'started'
        })
    } else if (timeEntry.description === entryDescription &&
        timeEntry.pid === projectID) {//already running, just stop

        diffEntries.push({
            entry: await stopEntry(timeEntry),
            status: 'stopped'
        })
    } else {//running, but different, stop current and start new
        diffEntries.push({
            entry: await stopEntry(timeEntry),
            status: 'stopped'
        })

        diffEntries.push({
            entry: await startEntry(entryDescription, projectID),
            status: 'started'
        })
    }
    return diffEntries
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
    return startedEntry
}

async function stopEntry(entry) {
    const client = await getTogglClient()
    const stoppedEntry = await client.stopTimeEntry(entry.wid, entry.id)
    console.log('-> Stopped:', stoppedEntry.id)
    return stoppedEntry
}
