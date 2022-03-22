import { render, h } from 'preact';
import ListItem from './ListItem.jsx';
import NewFavorite from './NewFavorite.jsx';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

import { useState } from 'preact/hooks';

export default function FavoritesView(props) {
    let favorites=props.favorites.length>0? props.favorites:[]

    console.log('from view', favorites)

    function deleteFavorite(favorite) {

        favorites=favorites.filter(f => f.name!==favorite.name&&f.project!==favorite.project)
        console.log('new list', favorites)
        chrome.storage.local.set({
            favorites: [favorites],
        })
    }


    const [isEditing, setIsEditing]=useState(false);
    return <div> {favorites.map((favorite) =>
        <ListItem entry={favorite} isEditing={isEditing} delete={deleteFavorite} />
    )}

        <IconButton aria-label="edit" color="primary" size="large" onClick={() => { setIsEditing(!isEditing) }}>
            <EditIcon />
        </IconButton>:

        {isEditing&&<NewFavorite favorites={props.favorites} />}
    </div>
}


