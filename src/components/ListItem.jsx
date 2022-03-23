import { render, h } from 'preact';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

export default function ListItem(props) {
    const time=props.entry.duration<0? 'Running':props.entry.time

    return (
        <Card className='content' sx={{ height: '75px', display: 'flex', marginBottom: '5px' }}>
            <Box className="floating-left" sx={{ display: 'flex', flexDirection: 'column', width: '75%', maxWidth: '75%' }}>
                <CardContent sx={{ flex: '1 0 auto', padding: '10px 20px' }}>
                    <Typography component="div" variant="h6" color="white">
                        {props.entry.description}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color={props.entry?.project?.hex_color}
                        component="div"
                        style={{ textShadow: '1px 1px grey' }}>
                        {props.entry.project?.name}
                    </Typography>
                </CardContent>
            </Box>

            <Box className="floating-right">
                <Typography
                    variant="subtitle1"
                    component="div"
                    color="white"
                    style={{ position: 'relative', top: '33%', height: '25%' }}>
                    {time}
                </Typography>

                {props.isEditing?
                    <IconButton
                        aria-label="delete"
                        size="large"
                        style={{ color: props.entry?.project?.hex_color }} onClick={() => { props.delete(props.entry) }} >
                        <DeleteIcon />
                    </IconButton>
                    :
                    <IconButton
                        aria-label="toggle"
                        size="large"
                        style={{ color: props.entry?.project?.hex_color }}  >
                        {props.entry.isRunning? <PauseCircleIcon />:<PlayCircleIcon />}
                    </IconButton>
                }
            </Box>
        </Card>
    );
}
