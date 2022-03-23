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



function getTime(seconds, returnSeconds=false) {
    const d=Number(seconds);
    const h=Math.floor(d/3600);
    const m=Math.floor((d%3600)/60);
    const s=Math.floor((d%3600)%60);
    const hDisplay=
        h>0? `${h.toString().length>1? `${h}`:`${0}${h}`}`:"00";
    const mDisplay=
        m>0? `${m.toString().length>1? `${m}`:`${0}${m}`}`:"00";
    const sDisplay=
        s>0? `${s.toString().length>1? `${s}`:`${0}${s}`}`:"00";

    if (returnSeconds) return `${hDisplay}:${mDisplay}:${sDisplay}`;
    else return `${hDisplay}:${mDisplay}`;
}


export default function GoalItem(props) {
    const progress=(100/props.goal.target)*(props.goal.duration/60)
    console.log('Goal', props.goal, progress)
    return (
        <Card className='content' sx={{ height: '75px', display: 'flex', marginBottom: '5px' }}>

            <LinearProgress
                className='progress'
                variant="buffer"
                value={progress}
                valueBuffer={progress+5}
                color='inherit'
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
                <Typography
                    variant="subtitle1"
                    component="div"
                    color="white"
                    style={{ position: 'relative', top: '33%', height: '25%' }}>
                    {getTime(props.goal.duration)}/{getTime(props.goal.target*60)}
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