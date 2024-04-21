import { render, h } from 'react';
import { useState, useEffect } from 'react';

import ListItem from './ListItem.jsx';
import NewFavorite from './NewFavorite.jsx';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';


export default function FavoritesView() {
    const [favorites, setFavorites] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(['favorites'], (result) => {
            setFavorites(result.favorites)
        })
    }, [])

    useEffect(() => {
        chrome.storage.local.set({
            favorites: favorites,
        })
    }, [favorites])

    function deleteFavorite(favorite) {
        setFavorites(favorites.filter(f =>
            !(f.description === favorite.description && f.project.name === favorite.project.name)))
    }

    function addFavorite(description, project) {
        const favorite = { description, project: project.name ? project : { name: project } }
        setFavorites([...favorites, favorite])
    }

    return <div>
        {favorites.map((favorite) =>
            <ListItem
                entry={favorite}
                isEditing={isEditing}
                delete={deleteFavorite} />
        )}
        <IconButton
            aria-label="edit"
            color="primary"
            size="large"
            onClick={() => { setIsEditing(!isEditing) }}>
            <EditIcon />
        </IconButton>
        {isEditing && <NewFavorite add={addFavorite} />}
    </div>
}


