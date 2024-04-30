import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { includeChromeStore } from "zustand-chrome-local-storage"
import { Entry, Goal, Project, StoreState, Workspace } from './toboard'

const useStore = create<StoreState>()(
    devtools(
        includeChromeStore(
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
        ),
    ),
)

export default useStore

