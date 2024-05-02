import { useState, useEffect } from 'react'

import EntryComponent from './EntryComponent.js'
import NewFavorite from './NewFavorite.js'

import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import useStore from '../useStore.js'


export default function FavoriteList() {
    const [isEditing, setIsEditing] = useState(false)
    const favorites = useStore((state) => (state.favorites))

    return <div>
        {favorites.map((favorite) => <EntryComponent
            key={favorite.id}
            entry={favorite}
            isEditing={isEditing} />
        )}
        <IconButton
            aria-label="edit"
            color="primary"
            size="large"
            onClick={() => { setIsEditing(!isEditing) }}>
            <EditIcon />
        </IconButton>
        {isEditing && <NewFavorite />}
    </div>
}


