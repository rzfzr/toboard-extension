import { useState, useEffect } from 'react'
// import { useContext } from 'react';
import { Button, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Paper from '@mui/material/Paper'
import ButtonGroup from '@mui/material/ButtonGroup'

import Autocomplete from '@mui/material/Autocomplete'
import { Project } from '../toboard'
import useStore from '../useStore'

export default function NewGoal(props: { add: (description: string, project: Project, target: number) => void }) {
    const [description, setDescription] = useState('')
    const [project, setProject] = useState(null as Project | null)
    const [target, setTarget] = useState(0 as number)

    const projects = useStore((state) => state.projects)

    const [isEditing, setEditing] = useState(false)

    const [timeUnit, setTimeUnit] = useState('hours')


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
                        onChange={(event) => setTarget(Number(event.target.value))}
                        variant="filled"
                        placeholder=""
                        style={{ width: '100%' }}
                    />
                </form>

                <ButtonGroup
                    variant="text"
                    color="primary"
                    aria-label="text primary button group"
                    style={{ width: '100%' }}
                >
                    <Button
                        disabled={!project}
                        style={{ width: '50%' }}
                        onClick={() => {
                            if (!project) return

                            props.add(description, project, timeUnit == 'hours' ? target * 60 : target)
                            setDescription('')
                            setProject(null)
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