//@ts-ignore
import TogglClient from 'toggl-api'
import 'babel-polyfill'

import {
    getTime,
    getPreviousMonday
} from './utils'
import { Entry, StoreObjects } from './toboard'

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
        return togglClientInstance
    } catch (error) {
        console.log("Error initializing TogglClient:", error)
        return null
    }
}

function getAllStorageSyncData(): Promise<StoreObjects> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError)
            }
            //@ts-ignore
            resolve(items)
        })
    })
}

const updateWorkspacesAndProjects = async () => {
    console.log('-> Updating workspaces and projects')
    const client = await getTogglClient()
    if (!client) return

    const workspaces = await client.getWorkspaces()

    try {
        await chrome.runtime.sendMessage({
            func: 'setWorkspaces',
            data: workspaces
        })
    } catch (error) {
        chrome.storage.local.set({ workspaces })
    }

    const projects = await client.getProjects(workspaces[0].id)

    try {
        await chrome.runtime.sendMessage({
            func: 'setProjects',
            data: projects
        })
    } catch (error) {
        chrome.storage.local.set({ projects })
    }
}

const updateEntries = async () => {
    console.log('-> Updating entries')

    const client = await getTogglClient()
    if (!client) return

    const entries = await getTimeEntries(client)

    try {
        await chrome.runtime.sendMessage({
            func: 'setEntries',
            data: entries
        })
    } catch (error) {
        chrome.storage.local.set({ entries })
    }
}

const updateEntriesRoutine = async () => {
    updateEntries()
    setInterval(() => {
        updateEntries()
    }, 1000 * 15)
}


const setUpMessengers = () => {
    chrome.runtime.onMessage.addListener(({
        message,
        description,
        projectId
    }, sender, sendResponse) => {
        switch (message) {
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
}

console.log('-> Starting service worker at', new Date())
setUpMessengers()
updateEntriesRoutine()
updateWorkspacesAndProjects()



async function getTimeEntries(client: TogglClient) {
    return await new Promise(async (resolve, reject) => {
        client.getTimeEntries(
            getPreviousMonday(),
            new Date().toISOString(),
            (err: any, timeEntries: any) => {
                if (err) reject(err)
                timeEntries.forEach((entry: any) => {
                    entry.isRunning = entry.duration < 0
                    entry.time = getTime(entry.duration)
                })
                resolve(timeEntries)
            }
        )
    })
}

async function toggleEntry(entryDescription: string | null, projectID: number | null) {
    const client = await getTogglClient()
    if (!client) return
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

async function startEntry(description: string | null, pid: number | null) {
    const client = await getTogglClient()
    if (!client) return
    const { workspaces } = await getAllStorageSyncData()

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

async function stopEntry(entry: Entry) {
    const client = await getTogglClient()
    if (!client) return
    const stoppedEntry = await client.stopTimeEntry(entry.wid, entry.id)
    console.log('-> Stopped:', stoppedEntry.id)
    return stoppedEntry
}
