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

            <Paper>
                <h4>New Favorite</h4>
                <form noValidate autoComplete="off">
                    <TextField
                        id="description"
                        label="Description"
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder=""
                        variant="outlined" />
                    <TextField
                        id="project"
                        label="Project"
                        onChange={(event) => setProject(event.target.value)}
                        placeholder=""
                        variant="outlined" />
                </form>
                <ButtonGroup
                    variant="text"
                    color="primary"
                    aria-label="text primary button group">
                    <Button
                        onClick={() => {
                            const fav={ description: description, project: project, position: favorites.length }
                            sendFavorites([fav])
                            setFavorites([...favorites, fav])
                            setEditing(false)
                        }}>Save</Button>
                    <Button
                        onClick={() => setEditing(false)}>Cancel</Button>
                </ButtonGroup>
            </Paper>

        )
    } else
        return (
            <Button
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