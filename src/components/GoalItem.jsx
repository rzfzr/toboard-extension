import { render, h } from 'preact';
import { styled } from '@mui/material/styles';

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';


import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export default function GoalComponent(props) {
    return (
        <Card className='content' sx={{ height: '75px', display: 'flex', marginBottom: '5px' }}>

            <LinearProgress className='progress' variant="buffer" value={100/props.goal.target*50} valueBuffer={85} color='inherit'
                style={{ height: '75px', color: props.goal?.project?.hex_color }} />

            <Box className="floating-left" >
                <CardContent sx={{ flex: '1 0 auto', padding: '10px 20px' }}>
                    <Typography component="div" variant="h6">
                        {props.goal.description}
                    </Typography>

                    <Typography variant="subtitle1" component="div" >
                        {props.goal.project?.name}
                    </Typography>
                </CardContent>
            </Box>

            <Box className="floating-right">
                <Typography variant="subtitle1" component="div" style={{ position: 'relative', top: '33%', height: '25%' }}>
                    {props.goal.time}
                </Typography>

                {props.isEditing?
                    <IconButton aria-label="delete" size="large" style={{ color: props.goal?.project?.hex_color }} onClick={() => { props.delete(props.goal) }} >
                        <DeleteIcon />
                    </IconButton>:


                    <IconButton aria-label="toggle" size="large" style={{ color: props.goal?.project?.hex_color }}  >
                        {props.goal.isRunning? <PauseCircleIcon />:<PlayCircleIcon />}
                    </IconButton>
                }
            </Box>
        </Card>
    )
}