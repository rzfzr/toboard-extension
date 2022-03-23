import { render, h } from 'preact';
import { styled } from '@mui/material/styles';

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';


import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const BorderLinearProgress=styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode==='light'? 200:800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode==='light'? '#1a90ff':'#308fe8',
    },
}));

export default function GoalComponent(props) {
    return (
        <Card sx={{ height: '75px', display: 'flex', marginBottom: '5px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '75%', maxWidth: '75%' }}>
                <CardContent sx={{ flex: '1 0 auto', padding: '10px 20px' }}>
                    <Typography component="div" variant="h6">
                        {props.goal.description}
                    </Typography>
                    <BorderLinearProgress variant="determinate" value={50} />

                    <Typography variant="subtitle1" color={props.goal?.project?.hex_color} component="div" >
                        {props.goal.project?.name}
                    </Typography>
                </CardContent>
            </Box>

            <Box sx={{ display: 'flex' }}>
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