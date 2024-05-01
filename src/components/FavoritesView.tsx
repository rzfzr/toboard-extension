import { useState, useEffect } from 'react'

import ListItem from './ListItem.jsx'
import NewFavorite from './NewFavorite.jsx'

import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import useStore from '../useStore.js'


export default function FavoritesView() {
    const [isEditing, setIsEditing] = useState(false)

    const { favorites, setFavorites } = useStore((state) => ({
        favorites: state.favorites,
        setFavorites: state.setFavorites
    }))

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
                key={favorite.description + favorite.project.name}
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


