import { useState, useEffect } from 'react';

import GoalItem from './GoalItem.js';
import NewGoal from './NewGoal.jsx';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

function updateGoal(goal: any, entries: any) {
    const goalEntries = goal.description == '' ?
        entries.filter((entry: any) => (entry.pid === goal.project.id)) :
        entries.filter((entry: any) => (entry.pid === goal.project.id && entry.description === goal.description))

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

export default function GoalsView(props: any) {
    const [goals, setGoals] = useState([] as any[]);
    const entries = props.entries
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        chrome.storage.sync.get(['goals'], (result: any) => {
            if (!result.goals) return
            result.goals.forEach((goal: any) => {
                goal = updateGoal(goal, entries)
            });
            setGoals(result.goals || [])
        })
    }, [entries])

    useEffect(() => {
        chrome.storage.sync.set({
            goals: goals,
        })
    }, [goals])

    function deleteGoal(goal: any) {
        setGoals(goals.filter((f: any) => !(f.description === goal.description && f.project.name === goal.project.name)))
    }
    function addGoal(description: any, project: any, target: any) {
        const goal = updateGoal({
            description: description !== '' ? description : false,
            project: project.name ? project : { name: project },
            target: target,
        }, entries)
        setGoals([...goals, goal])
    }
    return <div >
        {goals.map((goal) =>
            <GoalItem goal={goal} isEditing={isEditing} delete={deleteGoal} />
        )}
        <IconButton aria-label="edit" color="primary" size="large" onClick={() => { setIsEditing(!isEditing) }}>
            <EditIcon />
        </IconButton>

        {isEditing && <NewGoal add={addGoal} />}</div>
}