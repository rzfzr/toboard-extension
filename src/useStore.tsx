import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { includeChromeStore } from "zustand-chrome-local-storage"
import { Entry, Goal, Project, StoreState, Workspace } from './toboard'

const useStore = create<StoreState>()(
    devtools(
        includeChromeStore(
            (set) => ({
                apiToken: null,
                entries: [],
                goals: [],
                projects: [],
                workspaces: [],
                setEntries: (entries: Entry[]) => set({ entries }),
                addEntry: (entry: Entry) => set((state) => ({ entries: [...state.entries, entry] })),
                setGoals: (goals: Goal[]) => set({ goals }),
                setProjects: (projects: Project[]) => set({ projects }),
                setWorkspaces: (workspaces: Workspace[]) => set({ workspaces }),
                setApiToken: (apiToken: string) => set({ apiToken }),
            }),
        ),
    ),
)

export default useStore

