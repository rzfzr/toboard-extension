
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