import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import CustomFab from './CustomFab.js'
import { getTime, colorShade } from '../utils.js'
import { Entry } from '../toboard.js'

export default function ListItem(props: { entry: Entry, isEditing?: boolean }) {
    const time = props.entry.duration < 0 ?
        getTime(props.entry.duration + Date.now() / 1000)
        : props.entry.time

    const lightColor = colorShade(props.entry?.project?.color, +50) || '#B2BEB5'

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
                    color={props.entry?.project?.color}
                    component="div"
                    style={{ textShadow: '1px 1px grey' }}>
                    {props.entry.project?.name}
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
                // isRunning={props.entry.isRunning}
                entry={props.entry}
                color={lightColor}
            />
        </Box>
    </Card>
    )
}
