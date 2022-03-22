import { render, h } from 'preact';
import { Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';


export default function NewFavorite(props) {

    const [description, setDescription]=useState('')
    const [project, setProject]=useState('')

    const [isEditing, setEditing]=useState(false)

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
                    <TextField
                        id="project"
                        label="Project"
                        onChange={(event) => setProject(event.target.value)}
                        placeholder=""
                        variant="filled"
                        style={{ width: '100%' }} />
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
                            const fav={ description: description, project: { name: project } }

                            chrome.storage.local.set({
                                favorites: [...props.favorites, fav],
                            })
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