import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { includeChromeStore } from "zustand-chrome-local-storage"
import { Entry, Favorite, Goal, Project, StoreState, Workspace } from './toboard'

const useStore = create<StoreState>()(
    devtools(
        includeChromeStore(
            (set) => ({
                apiToken: null,
                entries: [],
                goals: [],
                projects: [],
                workspaces: [],
                favorites: [],
                setEntries: (entries: Entry[]) => set({ entries }),
                addEntry: (entry: Entry) => set(state => ({ entries: [...state.entries, entry] })),
                setGoals: (goals: Goal[]) => set({ goals }),
                setProjects: (projects: Project[]) => set({ projects }),
                setWorkspaces: (workspaces: Workspace[]) => set({ workspaces }),
                setApiToken: (apiToken: string) => set({ apiToken }),
                setFavorites: (favorites: Favorite[]) => set({ favorites }),
                addFavorite: (favorite: Favorite) => set(state => ({ favorites: [...state.favorites, favorite] })),
                delFavorite: (favorite: Favorite) => set(state => ({ favorites: state.favorites.filter(f => f !== favorite) })),
                clearStorage: () => set({ apiToken: null, entries: [], goals: [], projects: [], workspaces: [], favorites: [] }),
            }),
        ),
    ),
)

export default useStore

