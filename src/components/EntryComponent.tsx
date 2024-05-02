import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import CustomFab from './CustomFab.js'
import { getTime, colorShade, getEntryDuration } from '../utils.js'
import { Entry } from '../toboard.js'
import useStore from '../useStore.js'

export default function EntryComponent(props: { entry: Entry, isEditing?: boolean }) {
    const project = useStore((state) => state.projects.find((p) => p.id === props.entry.pid))
    const lightColor = colorShade(project?.color, +50) || '#B2BEB5'

    const time = getTime(getEntryDuration(props.entry), true)

    return (<Card className='content' sx={{ height: '75px', display: 'flex', marginBottom: '5px' }}>
        <Box className="floating-left" sx={{ display: 'flex', flexDirection: 'column', width: '75%', maxWidth: '75%' }}>
            <CardContent sx={{ flex: '1 0 auto', padding: '10px 20px' }}>
                <Typography
                    variant="subtitle1"
                    component="div"
                    color="white">
                    {props.entry.description}
                </Typography>
                <Typography
                    variant="subtitle2"
                    color={project?.color}
                    component="div"
                    style={{ textShadow: '1px 1px grey' }}>
                    {project?.name}
                </Typography>
            </CardContent>
        </Box>
        <Box className="floating-right">
            <Typography
                variant="subtitle2"
                component="div"
                color="white"
                style={{ position: 'relative', top: '33%', height: '25%' }}>
                {time}
            </Typography>
            <CustomFab
                isRunning={props.entry.duration < 0}
                entry={props.entry}
                color={lightColor}
            />
        </Box>
    </Card>
    )
}