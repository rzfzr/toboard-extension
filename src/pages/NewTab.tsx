import bootstrap from "../main"
import "../global.css"
import ListView from '../components/ListView'
import OptionList from '../components/OptionList'
import FavoritesView from '../components/FavoritesView'
import GoalsView from '../components/GoalsView'
import Box from '@mui/material/Box'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import useStore from "../useStore"

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
})

function NewTab() {
    const apiToken = useStore((state) => (state.apiToken))
    console.log('-> NewTab, hasApiToken', !!apiToken)

    return (<ThemeProvider theme={darkTheme}>
        {!apiToken && <OptionList />}
        {apiToken &&
            <Box className='parentBox' >
                <Box className='childBox'>
                    <h2 className='boxLabel'> Weekly Goals </h2>
                    <GoalsView />
                </Box>
                <Box className='childBox'>
                    <h2 className='boxLabel'> Weekly List </h2>
                    <ListView />
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