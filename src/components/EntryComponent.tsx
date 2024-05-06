import Card from '@mui/material/Card'
import Box from '@mui/material/Box'

import CustomFab from './CustomFab.js'
import { getTime, colorShade, getEntryDuration } from '../utils.js'
import { Entry } from '../toboard.js'
import useStore from '../useStore.js'
import CardText from './CardText.js'
import { useEffect, useState } from 'react'

export default function EntryComponent(props: { entry: Entry, isEditing?: boolean }) {
    const project = useStore((state) => state.projects.find((p) => p.id === props.entry.pid))
    const lightColor = colorShade(project?.color, +50) || '#B2BEB5'

    const [time, setTime] = useState(getTime(getEntryDuration(props.entry), true))

    useEffect(() => {
        if (props.entry.duration > 0) return
        const interval = setInterval(() => {
            setTime(getTime(getEntryDuration(props.entry), true))
        }, 1000)
        return () => clearInterval(interval)
    }, [props.entry.duration])


    return (
        <Card className='relative flex items-center h-20 mb-1'>
            <CardText
                description={props.entry.description}
                project={project} />
            <Box className="absolute right-0 flex items-center p-3">
                <CustomFab
                    isRunning={props.entry.duration < 0}
                    entry={props.entry}
                    color={lightColor}
                    nonHoverText={time}
                />
            </Box>
        </Card>
    )
}
