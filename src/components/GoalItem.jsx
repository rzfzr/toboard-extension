import { render, h, Fragment } from 'preact';

import LinearProgress from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomFab from './CustomFab.jsx'
import { colorShade, getTime } from '../utils'

export default function GoalItem(props) {
    const progress=Math.min((100/props.goal.target)*(props.goal.duration/60), 100)
    const lightColor=colorShade(props.goal?.project?.hex_color, +50)

    return (
        <Card className='content' sx={{ height: '75px', display: 'flex', marginBottom: '5px' }}>
            <LinearProgress
                className='progress'
                variant={props.goal.isRunning? "buffer":"determinate"}
                value={progress}
                valueBuffer={progress+5}
                color='inherit'
                style={{ height: '75px', color: props.goal?.project?.hex_color }} />
            <Box className="floating-left" >
                <CardContent sx={{
                    flex: '1 0 auto',
                    padding: '10px 20px',
                    paddingTop: props.goal.description!=''? '10px':'23px',
                }}>
                    <Typography
                        component="div"
                        variant="subtitle1">
                        {props.goal.description!=''? props.goal.description:props.goal.project.name}
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        component="div" >
                        {props.goal.description!=''? props.goal.project?.name:''}
                    </Typography>
                </CardContent>
            </Box>
            <Box className="floating-right">
                <Typography
                    variant="subtitle2"
                    component="div"
                    color="white"
                    style={{ position: 'relative', top: '33%', height: '25%' }}>
                    {getTime(props.goal.duration)}/{getTime(props.goal.target*60)}
                </Typography>
                <CustomFab
                    isRunning={props.goal.isRunning}
                    isEditing={props.isEditing}
                    delete={props.delete}
                    entry={props.goal}
                    color={lightColor}
                />
            </Box>
        </Card>
    )
}