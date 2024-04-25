import { render, h } from 'react';
import { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';

import Autocomplete from '@mui/material/Autocomplete'

export default function NewFavorite(props) {

    const [description, setDescription] = useState('')
    const [project, setProject] = useState('')

    const [projects, setProjects] = useState([])

    const [isEditing, setEditing] = useState(false)

    useEffect(() => {
        chrome.storage.sync.get(['projects'], (result) => {
            setProjects(result.projects)
        })
    }, [])


    if (isEditing) {
        return (
            <Paper style={{ width: '100%' }}>
                <form noValidate autoComplete="off">
                    <TextField
                        id="description"
                        label="Description"
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder=""
                        variant="filled"
                        style={{ width: '100%' }} />

                    <Autocomplete
                        id="project"
                        getOptionLabel={(option) => option.name}
                        disablePortal
                        options={projects}
                        style={{ width: '100%' }}
                        onChange={(event, newValue) => setProject(newValue)}
                        renderInput={(params) => <TextField {...params} label="Project" variant="filled" />}
                    />

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
                            props.add(description, project)
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
                New Favorite
            </Button>
        )
}