import { create } from 'zustand'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'
import { includeChromeStore } from "zustand-chrome-local-storage"

import { Entry, Goal, Project, StoreState, Workspace } from './toboard'



const useStore = create<StoreState>()(
    devtools(
        persist(
            (set) => ({
                entries: [],
                setEntries: (entries: Entry[]) => set({ entries }),
                addEntry: (entry: Entry) => set((state) => ({ entries: [...state.entries, entry] })),
                goals: [],
                setGoals: (goals: Goal[]) => set({ goals }),
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

