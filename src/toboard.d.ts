export type Project = {
    id: number,
    name: string,
    hex_color: string
}

export type Entry = {
    id: number,
    start: number,
    end: number,
    pid: number,
    description: string
}

export type Goal = {
    id: number,
    description: string,
    project: Project,
    target: number
    isRunning?: boolean,
    duration: number,
    period: 'day' | 'week' | 'month' | 'year',
    type: 'total' | 'average'
}
export type Favorite = {
    description: string,
    project: Project
}

export type Workspace = {

}

export type StoreObjects = {
    apiToken: string | null,
    entries: Entry[],
    goals: Goal[],
    projects: Project[],
    workspaces: Workspace[],
    favorites: Favorite[]
}

export type StoreActions = {
    setApiToken: (apiToken: string) => void,
    setEntries: (entries: Entry[]) => void,
    addEntry: (entry: Entry) => void,
    setGoals: (goals: Goal[]) => void,
    setProjects: (projects: Project[]) => void,
    setWorkspaces: (workspaces: Workspace[]) => void,
    setFavorites: (favorites: Favorite[]) => void,
    addFavorite: (favorite: Favorite) => void,
    delFavorite: (favorite: Favorite) => void,
    clearStorage: () => void,
    syncFromChromeStorage: () => void
}
export type StoreState = StoreObjects & StoreActions