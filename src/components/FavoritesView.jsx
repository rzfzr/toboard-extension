import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import ListItem from './ListItem.jsx';
import NewFavorite from './NewFavorite.jsx';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';


export default function FavoritesView() {
    const [favorites, setFavorites]=useState([]);
    const [isEditing, setIsEditing]=useState(false);

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
        setFavorites(favorites.filter(f => !(f.description===favorite.description&&f.project.name===favorite.project.name)))
    }

    function addFavorite(favorite) {
        setFavorites([...favorites, favorite])
    }

    return <div> {favorites.map((favorite) =>
        <ListItem entry={favorite} isEditing={isEditing} delete={deleteFavorite} />
    )}
        <IconButton aria-label="edit" color="primary" size="large" onClick={() => { setIsEditing(!isEditing) }}>
            <EditIcon />
        </IconButton>

        {isEditing&&<NewFavorite add={addFavorite} />}
    </div>
}


