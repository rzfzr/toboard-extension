import { create } from 'zustand'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'
import { includeChromeStore } from "zustand-chrome-local-storage"

import { Entry, Project, Workspace } from './toboard'

type StoreState = {
    entries: Entry[],
    setEntries: (entries: Entry[]) => void,
    addEntry: (entry: Entry) => void,
    projects: Project[],
    setProjects: (projects: Project[]) => void,
    workspaces: Workspace[],
    setWorkspaces: (workspaces: Workspace[]) => void,
}

const useStore = create<StoreState>()(
    devtools(
        persist(
            (set) => ({
                entries: [],
                setEntries: (entries: Entry[]) => set({ entries }),
                addEntry: (entry: Entry) => set((state) => ({ entries: [...state.entries, entry] })),
                projects: [],
                setProjects: (projects: Project[]) => set({ projects }),
                workspaces: [],
                setWorkspaces: (workspaces: Workspace[]) => set({ workspaces }),
            }),
            { name: 'toboard-store' },
        ),
    ),
)

export default useStore

