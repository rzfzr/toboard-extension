import { useState, useEffect } from 'react'

import ListItem from './ListItem.jsx'
import NewFavorite from './NewFavorite.jsx'

import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'


export default function FavoritesView() {
    const [favorites, setFavorites] = useState([] as any[])
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        chrome.storage.sync.get(['favorites'], (result: any) => {
            setFavorites(result.favorites)
        })
    }, [])

    useEffect(() => {
        chrome.storage.sync.set({
            favorites: favorites,
        })
    }, [favorites])

    function deleteFavorite(favorite: any) {
        setFavorites(favorites.filter((f: any) =>
            !(f.description === favorite.description && f.project.name === favorite.project.name)))
    }

    function addFavorite(description: any, project: any) {
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


