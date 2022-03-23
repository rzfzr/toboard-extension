import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import GoalItem from './GoalItem.jsx';
import NewGoal from './NewGoal.jsx';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

export default function GoalsView() {
    const [goals, setGoals]=useState([]);
    const [isEditing, setIsEditing]=useState(false);

    useEffect(() => {
        chrome.storage.local.get(['goals', 'entries'], (result) => {
            console.log('result', result)
            result.goals.forEach(goal => {
                goal.duration=result.entries
                    .filter(entry => (entry.pid===goal.project.id&&entry.description===goal.description))
                    .reduce((p, c) => p+c.duration, 0)
            });
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
        const goal={
            description: description!==''? description:false,
            project: project.name? project:{ name: project },
            target: target,
        }
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
