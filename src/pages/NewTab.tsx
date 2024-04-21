import bootstrap from "../main"
//@ts-nocheck
import { useState, useEffect } from 'react';
import ListView from '../components/ListView';
import OptionList from '../components/OptionList';
import FavoritesView from '../components/FavoritesView';
import GoalsView from '../components/GoalsView';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function NewTab() {
    console.log('-> NewTab')
    const [entries, setEntries] = useState([]);
    const [status, setStatus] = useState('')

    useEffect(() => {
        chrome.storage.local.get(['apiToken'], (result: any) => {
            setStatus(result.apiToken ? 'current' : 'new')
        })

        chrome.runtime.sendMessage({ message: 'getAll' }, function ({ entries, projects, error }) {
            if (error) return
            entries.forEach((entry: any) => {
                entry.project = projects.find(p => p.id === entry.pid)
            });
            setEntries(entries)
        });
    }, [])

    return (<ThemeProvider theme={darkTheme}>

        {status === 'new' && <OptionList />}

        {status === 'current' &&
            <Box className='parentBox' >
                <Box className='childBox'>
                    <h2 className='boxLabel'> Weekly Goals </h2>
                    <GoalsView entries={entries} />
                </Box>
                <Box className='childBox'>
                    <h2 className='boxLabel'> Weekly List </h2>
                    <ListView entries={entries} />
                </Box>
                <Box className='childBox'>
                    <h2 className='boxLabel'> My Favorites </h2>
                    <FavoritesView />
                </Box>
            </Box>}
    </ThemeProvider>)
}

NewTab.displayName = 'NewTab'
bootstrap(NewTab)