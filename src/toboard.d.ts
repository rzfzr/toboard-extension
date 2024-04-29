
export type Project = {
    id: number,
    name: string
}

export type Goal = {
    id: number,
    description: string,
    project: Project,
    target: number
    isRunning?: boolean,
    duration: number,
}