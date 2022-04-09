import "../global.css";
import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import ListView from './components/ListView.jsx';
import FavoritesView from './components/FavoritesView.jsx';
import GoalsView from './components/GoalsView.jsx';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const darkTheme=createTheme({
    palette: {
        mode: 'dark',
    },
});

function NewPage() {
    const [entries, setEntries]=useState([]);
    useEffect(() => {
        chrome.runtime.sendMessage({ message: 'getAll' }, function ({ entries, projects, error }) {
            if (error) return
            entries.forEach(entry => {
                entry.project=projects.find(p => p.id===entry.pid)
            });
            setEntries(entries)
        });
    }, [])

    return (<ThemeProvider theme={darkTheme}>
        <Box className='parentBox' >
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
    </ThemeProvider>)
}

render(<NewPage />,
    document.getElementById('app')
);