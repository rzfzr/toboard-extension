import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import ListView from './components/ListView.jsx';
import FavoritesView from './components/FavoritesView.jsx';
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

    return <Box sx={{ display: 'flex' }}>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <ListView entries={entries} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FavoritesView favorites={[]} />
        </Box>

    </Box>
}

render(<NewPage />,
    document.getElementById('app')
);