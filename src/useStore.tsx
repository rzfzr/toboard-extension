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
                theme: 'dark',
                setTheme: (theme: 'dark' | 'light') => set({ theme }),
                setEntries: (entries: Entry[]) => set({ entries }),
                addEntry: (entry: Entry) => set(state => ({ entries: [...state.entries, entry] })),
                setGoals: (goals: Goal[]) => set({ goals }),
                addGoal: (goal: Goal) => set(state => ({ goals: [...state.goals, goal] })),
                delGoal: (goal: Goal) => set(state => ({ goals: state.goals.filter(g => g !== goal) })),
                setProjects: (projects: Project[]) => set({ projects }),
                setWorkspaces: (workspaces: Workspace[]) => set({ workspaces }),
                setApiToken: (apiToken: string) => {
                    set({ apiToken })
                    chrome.runtime.sendMessage({ message: 'refresh' })
                },
                setFavorites: (favorites: Favorite[]) => set({ favorites }),
                addFavorite: (favorite: Favorite) => set(state => ({ favorites: [...state.favorites, favorite] })),
                delFavorite: (favorite: Favorite) => set(state => ({ favorites: state.favorites.filter(f => f !== favorite) })),
                clearStorage: () => set({
                    apiToken: null,
                    entries: [],
                    goals: [],
                    projects: [],
                    workspaces: [],
                    favorites: []
                }),
                syncFromChromeStorage: async () => {
                    const data = await chrome.storage.local.get(null)
                    set({
                        apiToken: data.apiToken || null,
                        entries: data.entries || [],
                        goals: data.goals || [],
                        projects: data.projects || [],
                        workspaces: data.workspaces || [],
                        favorites: data.favorites || []
                    })
                }
            }),
        ),
    ),
)

export default useStore

