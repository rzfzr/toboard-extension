import bootstrap from "../main"
import "../global.css";
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
    const [hasApiKey, setHasApiKey] = useState(false)

    useEffect(() => {
        (async () => {
            const { apiToken } = await chrome.storage.sync.get(['apiToken'])
            setHasApiKey(!!apiToken)

            if (!apiToken) {
                return
            }



        })()


        chrome.runtime.sendMessage({ message: 'getAll' }, function ({ entries, projects, error }: any) {
            if (error) return
            entries.forEach((entry: any) => {
                entry.project = projects.find((p: any) => p.id === entry.pid)
            });
            setEntries(entries)
        });
    }, [])

    return (<ThemeProvider theme={darkTheme}>

        {!hasApiKey && <OptionList />}

        {hasApiKey &&
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