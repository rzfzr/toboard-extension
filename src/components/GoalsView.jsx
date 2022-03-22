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
        chrome.storage.local.get(['goals'], (result) => {
            setGoals(result.goals||[])
        })
    }, [])

    useEffect(() => {
        chrome.storage.local.set({
            goals: goals,
        })
    }, [goals])


    return <div >
        {goals.map((goal) =>
            <GoalItem goal={goal} />
        )}
        <IconButton aria-label="edit" color="primary" size="large" onClick={() => { setIsEditing(!isEditing) }}>
            <EditIcon />
        </IconButton>

        {isEditing&&<NewGoal />}</div>
}