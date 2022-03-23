import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import GoalItem from './GoalItem.jsx';
import NewGoal from './NewGoal.jsx';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

function updateGoal(goal, entries) {

    let goalEntries=[]

    if (goal.description=='') {
        goalEntries=entries
            .filter(entry => (entry.pid===goal.project.id))
    } else {
        goalEntries=entries
            .filter(entry => (entry.pid===goal.project.id&&entry.description===goal.description))
    }

    goal.isRunning=!!goalEntries.find(e => e.duration<0)
    goal.duration=goalEntries.reduce((p, c) => {
        if (c.duration<0) {
            let n=Date.now()/1000
            return p+n+c.duration
        }
        return p+c.duration
    }, 0)
    return goal
}

export default function GoalsView() {
    const [goals, setGoals]=useState([]);
    const [entries, setEntries]=useState([]);
    const [isEditing, setIsEditing]=useState(false);

    useEffect(() => {
        chrome.storage.local.get(['goals', 'entries'], (result) => {
            result.goals.forEach(goal => {
                goal=updateGoal(goal, result.entries)
            });

            setEntries(result.entries||[])
            setGoals(result.goals||[])
        })
    }, [])

    useEffect(() => {
        chrome.storage.local.set({
            goals: goals,
        })
    }, [goals])

    function deleteGoal(goal) {
        setGoals(goals.filter(f => !(f.description===goal.description&&f.project.name===goal.project.name)))
    }
    function addGoal(description, project, target) {
        const goal=updateGoal({
            description: description!==''? description:false,
            project: project.name? project:{ name: project },
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

        {isEditing&&<NewGoal add={addGoal} />}</div>
}