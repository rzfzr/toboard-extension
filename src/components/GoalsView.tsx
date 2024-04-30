import { useState, useEffect } from 'react'

import GoalItem from './GoalItem.js'
import NewGoal from './NewGoal.jsx'

import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import { Goal, Entry, Project } from '../toboard.js'
import useStore from '../useStore.js'


export default function GoalsView() {
    const { goals, setGoals } = useStore((state) => ({
        goals: state.goals,
        setGoals: state.setGoals
    }))

    const entries = useStore((state) => state.entries)

    const [isEditing, setIsEditing] = useState(false)

    const setAndSaveGoals = (goals: Goal[]) => {
        setGoals(goals || [])
    }

    useEffect(() => {
        console.log('-> entries changed, updating goals', entries.length)
        if (!goals || goals.length === 0) {
            return
        }
        goals.forEach((goal: Goal) => {
            goal = getUpdatedGoal(goal, entries)
        })
        setAndSaveGoals(goals)
    }, [entries])

    function deleteGoal(goal: any) {
        setAndSaveGoals(goals.filter((f: any) => !(f.description === goal.description && f.project.name === goal.project.name)))
    }
    function addGoal(description: string, project: Project, target: number) {
        const goal = getUpdatedGoal({
            id: Date.now(),
            duration: 0,
            description: description,
            project: project,
            target: target,
            period: 'week',
            type: 'total',
        }, entries)
        setAndSaveGoals([...goals, goal])
    }
    return <div >
        {goals.map((goal) =>
            <GoalItem
                key={goal.id}
                goal={goal}
                isEditing={isEditing}
                delete={deleteGoal} />
        )}
        <IconButton aria-label="edit" color="primary" size="large" onClick={() => { setIsEditing(!isEditing) }}>
            <EditIcon />
        </IconButton>
        {isEditing && <NewGoal add={addGoal} />}</div>
}

function getUpdatedGoal(goal: Goal, entries: Entry[]) {
    const goalEntries = goal.description == '' ?
        entries.filter((entry: Entry) => (entry.pid === goal.project.id)) :
        entries.filter((entry: Entry) => (entry.pid === goal.project.id && entry.description === goal.description))

    goal.isRunning = !!goalEntries.find((e: any) => e.duration < 0)
    goal.duration = goalEntries.reduce((p: any, c: any) => {
        if (c.duration < 0) {
            let n = Date.now() / 1000
            return p + n + c.duration
        }
        return p + c.duration
    }, 0)
    return goal
}
