import bootstrap from "../main"

// import { useState, useEffect } from 'react';
// import ListView from '../components/ListView.jsx';
// import Options from '../components/Options.jsx';
// import FavoritesView from '../components/FavoritesView.jsx';
// import GoalsView from '../components/GoalsView.jsx';
// import Box from '@mui/material/Box';
// import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

// const darkTheme = createTheme({
//     palette: {
//         mode: 'dark',
//     },
// });

function NewTab() {
    console.log('NewTab')
    return <h1>NewTab</h1>


    // const [entries, setEntries] = useState([]);
    // const [status, setStatus] = useState('')

    // useEffect(() => {
    //     chrome.storage.local.get(['apiToken'], (result) => {
    //         setStatus(result.apiToken ? 'current' : 'new')
    //     })

    //     chrome.runtime.sendMessage({ message: 'getAll' }, function ({ entries, projects, error }) {
    //         if (error) return
    //         entries.forEach(entry => {
    //             entry.project = projects.find(p => p.id === entry.pid)
    //         });
    //         setEntries(entries)
    //     });
    // }, [])

    // return (<ThemeProvider theme={darkTheme}>

    //     {status === 'new' && <Options />}

    //     {status === 'current' &&
    //         <Box className='parentBox' >
    //             <Box className='childBox'>
    //                 <h2 className='boxLabel'> Weekly Goals </h2>
    //                 <GoalsView entries={entries} />
    //             </Box>
    //             <Box className='childBox'>
    //                 <h2 className='boxLabel'> Weekly List </h2>
    //                 <ListView entries={entries} />
    //             </Box>
    //             <Box className='childBox'>
    //                 <h2 className='boxLabel'> My Favorites </h2>
    //                 <FavoritesView />
    //             </Box>
    //         </Box>}
    // </ThemeProvider>)
}

NewTab.displayName = 'NewTab'
bootstrap(NewTab)