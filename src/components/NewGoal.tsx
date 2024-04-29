import { render, h } from 'react';
import { useState, useEffect } from 'react';
// import { useContext } from 'react';
import { Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Autocomplete from '@mui/material/Autocomplete'

export default function NewGoal(props: any) {
    const [description, setDescription] = useState('')
    const [project, setProject] = useState('')
    const [target, setTarget] = useState('')

    const [projects, setProjects] = useState([])

    const [isEditing, setEditing] = useState(false)

    const [timeUnit, setTimeUnit] = useState('hours');

    const [goalType, setGoalType] = useState('total');//total per week, average per day, average per entry

    useEffect(() => {
        chrome.storage.sync.get(['projects'], (result) => {
            setProjects(result.projects)
        })
    }, [])

    if (isEditing) {
        return (
            <Paper style={{ width: '100%s' }}>
                <form noValidate autoComplete="off">
                    <TextField
                        id="description"
                        label="Description (optional)"
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder=""
                        variant="filled"
                        style={{ width: '100%' }}
                    />
                    <Autocomplete
                        id="project"
                        getOptionLabel={(option) => option.name}
                        disablePortal
                        options={projects}
                        style={{ width: '100%' }}
                        onChange={(event, newValue) => setProject(newValue)}
                        renderInput={(params) => <TextField {...params} label="Project" variant="filled" />}
                    />
                    <TextField
                        id="target"
                        label={`Target in ${timeUnit}`}
                        onChange={(event) => setTarget(event.target.value)}
                        variant="filled"
                        placeholder=""
                        style={{ width: '75%' }}
                    />
                    <ToggleButtonGroup
                        size="small"
                        orientation="vertical"
                        color="primary"
                        value={timeUnit}
                        exclusive
                        onChange={(event, newValue) => { if (newValue !== null) setTimeUnit(newValue) }}
                        style={{ width: '25%' }}
                    >
                        <ToggleButton
                            style={{ height: '28px' }}
                            value="minutes">Minutes</ToggleButton>
                        <ToggleButton
                            style={{ height: '28px' }}
                            value="hours">Hours</ToggleButton>
                    </ToggleButtonGroup>
                </form>

                <ButtonGroup
                    variant="text"
                    color="primary"
                    aria-label="text primary button group"
                    style={{ width: '100%' }}
                >
                    <Button
                        style={{ width: '50%' }}
                        onClick={() => {
                            props.add(description, project, timeUnit == 'hours' ? target * 60 : target)
                            setEditing(false)
                        }}>Save</Button>
                    <Button
                        style={{ width: '50%' }}
                        onClick={() => setEditing(false)}>Cancel</Button>
                </ButtonGroup>
            </Paper>

        )
    } else
        return (
            <Button
                style={{ width: '80%' }}
                startIcon={<AddIcon fontSize="large" />}
                onClick={() => setEditing(true)}
                size="large"
                variant="contained"
                color="primary"
            >
                New Weekly Goal
            </Button>
        )
}