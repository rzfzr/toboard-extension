import bootstrap from "../main"
import "../global.css"
import EntryList from '../components/EntryList'
import FavoriteList from '../components/FavoriteList'
import GoalList from '../components/GoalList'
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
                    <GoalList />
                </Box>
                <Box className='childBox'>
                    <h2 className='boxLabel'> Weekly List </h2>
                    <EntryList />
                </Box>
                <Box className='childBox'>
                    <h2 className='boxLabel'> My Favorites </h2>
                    <FavoriteList />
                </Box>
            </Box>}
    </>
    )
}

NewTab.displayName = 'NewTab'
bootstrap(NewTab)