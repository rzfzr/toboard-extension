import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import ListView from './components/ListView.jsx';
import FavoritesView from './components/FavoritesView.jsx';
import GoalsView from './components/GoalsView.jsx';
import Box from '@mui/material/Box';
import css from "../global.css";

function NewPage() {
    const [entries, setEntries]=useState([]);

    useEffect(() => {
        chrome.storage.local.get(['entries', 'projects'], (result) => {
            result?.entries?.forEach(entry => {
                entry.project=result.projects.find(p => p.id===entry.pid)
            });
            setEntries(result.entries)
        })
    }, [])

    return <Box className='parentBox' >

        <Box className='childBox'>
            <h2 className='boxLabel'> Weekly Goals </h2>
            <GoalsView />
        </Box>

        <Box className='childBox'>
            <h2 className='boxLabel'> Weekly List </h2>
            <ListView entries={entries} />
        </Box>

        <Box className='childBox'>
            <h2 className='boxLabel'> My Favorites </h2>
            <FavoritesView />
        </Box>

    </Box>
}

render(<NewPage />,
    document.getElementById('app')
);