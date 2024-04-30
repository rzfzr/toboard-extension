
export type Project = {
    id: number,
    name: string
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

export type Workspace = {

}

export type StoreObjects = {
    apiToken: string | null,
    entries: Entry[],
    goals: Goal[],
    projects: Project[],
    workspaces: Workspace[],
}

export type StoreActions = {
    setApiToken: (apiToken: string) => void,
    setEntries: (entries: Entry[]) => void,
    addEntry: (entry: Entry) => void,
    setGoals: (goals: Goal[]) => void,
    setProjects: (projects: Project[]) => void,
    setWorkspaces: (workspaces: Workspace[]) => void,
}
export type StoreState = StoreObjects & StoreActions