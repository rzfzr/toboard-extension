export type Project = {
    id: number,
    name: string,
    color: string
}

export type Entry = {
    id: number,
    description: string,
    pid: number,
    start: string,
    end: string,
    duration: number,
    time: string
}

export type Goal = {
    id: number,
    description: string,
    pid: number,
    target: number
    isRunning?: boolean,
    duration: number,
    period: 'day' | 'week' | 'month' | 'year',
    type: 'total' | 'average'
}
export type Favorite = {
    id: number,
    description?: string,
    pid?: number
}

export type Workspace = {

}

export type StoreObjects = {
    apiToken: string | null,
    entries: Entry[],
    goals: Goal[],
    projects: Project[],
    workspaces: Workspace[],
    favorites: Favorite[],
    theme: 'dark' | 'light'
}

export type StoreActions = {
    setApiToken: (apiToken: string) => void,
    setEntries: (entries: Entry[]) => void,
    addEntry: (entry: Entry) => void,
    setGoals: (goals: Goal[]) => void,
    addGoal: (goal: Goal) => void,
    delGoal: (goal: Goal) => void,
    setProjects: (projects: Project[]) => void,
    setWorkspaces: (workspaces: Workspace[]) => void,
    setFavorites: (favorites: Favorite[]) => void,
    addFavorite: (favorite: Favorite) => void,
    delFavorite: (favorite: Favorite) => void,
    clearStorage: () => void,
    syncFromChromeStorage: () => void,
    setTheme: (theme: 'dark' | 'light') => void
}
export type StoreState = StoreObjects & StoreActions