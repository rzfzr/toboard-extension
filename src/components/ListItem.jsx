import { render, h } from 'preact';

import { useTheme } from '@mui/material/styles';

import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export default function ListItem(props) {
    const theme=useTheme();

    return (
        <Card sx={{ height: '75px', display: 'flex', marginBottom: '5px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '75%', maxWidth: '75%' }}>
                <CardContent sx={{ flex: '1 0 auto', padding: '10px 20px' }}>
                    <Typography component="div" variant="h6">
                        {props.entry.description}
                    </Typography>
                    <Typography variant="subtitle1" color={props.entry.project.hex_color} component="div" >
                        {props.entry.project.name}
                    </Typography>
                </CardContent>
            </Box>

            <Box sx={{ display: 'flex' }}>
                <Typography variant="subtitle1" component="div" style={{ position: 'relative', top: '33%', height: '25%' }}>
                    {props.entry.time}
                </Typography>
                <IconButton aria-label="delete" size="large" style={{ color: props.entry.project.hex_color }}  >
                    {props.entry.isRunning? <PauseCircleIcon />:<PlayCircleIcon />}
                </IconButton>
            </Box>
        </Card>
    );
}
