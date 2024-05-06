import { useState, useEffect } from 'react'

import GoalComponent from './GoalComponent.js'
import NewGoal from './NewGoal.js'

import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import { Goal, Entry, Project } from '../toboard.js'
import useStore from '../useStore.js'
import { getDurationSum } from '../utils.js'

export default function GoalList() {
    const { goals, setGoals, addGoal, delGoal } = useStore((state) => ({
        goals: state.goals,
        setGoals: state.setGoals,
        addGoal: state.addGoal,
        delGoal: state.delGoal,
    }))

    const [runningGoal, setRunningGoal] = useState<Goal | null>(null)

    const entries = useStore((state) => state.entries)

    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        if (!goals || goals.length === 0) {
            return
        }
        goals.forEach((goal: Goal) => {
            goal = getUpdatedGoal(goal, entries)
            if (goal.isRunning) {
                setRunningGoal(goal)
            }
        })
        setGoals(goals)
    }, [entries])


    useEffect(() => {
        if (!runningGoal) {
            return
        }
        const interval = setInterval(() => {
            const goal = getUpdatedGoal(runningGoal, entries)
            console.log('interval', goal.duration, goal.isRunning)
            if (goal.isRunning) {
                setRunningGoal(goal)
            } else {
                setRunningGoal(null)
                clearInterval(interval)
            }
        }, 1000 * 60)
        return () => clearInterval(interval)

    }, [runningGoal, entries])

    function createGoal(description: string, project: Project, target: number) {
        const goal = getUpdatedGoal({
            id: Date.now(),
            duration: 0,
            description: description,
            pid: project.id,
            target: target,
            period: 'week',
            type: 'total',
        }, entries)
        addGoal(goal)
    }
    return <div >
        {goals.map((goal) =>
            <GoalComponent
                key={goal.id}
                goal={goal}
                isEditing={isEditing}
                delGoal={delGoal} />
        )}
        <IconButton aria-label="edit" color="primary" size="large" onClick={
            () => { setIsEditing(!isEditing) }}>
            <EditIcon />
        </IconButton>
        {isEditing && <NewGoal add={createGoal} />}</div>
}

function getUpdatedGoal(goal: Goal, entries: Entry[]) {
    const goalEntries = goal.description == '' ?
        entries.filter((entry: Entry) => (entry.pid === goal.pid)) :
        entries.filter((entry: Entry) => (entry.pid === goal.pid && entry.description === goal.description))

    const runningEntry = goalEntries.find((e: any) => e.duration < 0)
    if (runningEntry) {
        goal.isRunning = true
        goal.duration = getDurationSum(goalEntries) + runningEntry.duration
    } else {
        goal.isRunning = false
        goal.duration = getDurationSum(goalEntries)
    }

    return goal
}
