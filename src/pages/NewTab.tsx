import bootstrap from "../main"
import "../global.css"
import ListView from '../components/ListView'
import FavoritesView from '../components/FavoritesView'
import GoalsView from '../components/GoalsView'
import Box from '@mui/material/Box'
import useStore from "../useStore"
import NoTokenPrompt from "../components/NoTokenPrompt"
import { useEffect } from "react"


function NewTab() {
    const apiToken = useStore((state) => (state.apiToken))
    useEffect(() => {
        chrome.runtime.sendMessage({ message: 'refresh' })
    }, [])

    return (<>
        {!apiToken && <NoTokenPrompt />}
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
    </>
    )
}

NewTab.displayName = 'NewTab'
bootstrap(NewTab)