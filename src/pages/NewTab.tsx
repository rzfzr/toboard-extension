import bootstrap from "../main"
import "../global.css"
import EntryList from '../components/EntryList'
import FavoriteList from '../components/FavoriteList'
import GoalList from '../components/GoalList'
import Box from '@mui/material/Box'
import useStore from "../useStore"
import NoTokenPrompt from "../components/NoTokenPrompt"
import { useEffect } from "react"
import GroupComponent from "../components/GroupComponent"
import CurrentEntry from "../components/CurrentEntry"


function NewTab() {
    const apiToken = useStore((state) => (state.apiToken))
    useEffect(() => {
        chrome.runtime.sendMessage({ message: 'refresh' })
    }, [])

    return (<>
        {!apiToken && <NoTokenPrompt />}
        {apiToken &&
            <Box className='flex flex-wrap justify-center'>
                <GroupComponent title="Weekly Goals">
                    <GoalList />
                </GroupComponent>
                <GroupComponent title="Current Entry">
                    <CurrentEntry />
                </GroupComponent>
                <GroupComponent title="Weekly List">
                    <EntryList />
                </GroupComponent>
                <GroupComponent title="Favorites">
                    <FavoriteList />
                </GroupComponent>
            </Box>}
    </>
    )
}

NewTab.displayName = 'NewTab'
bootstrap(NewTab)