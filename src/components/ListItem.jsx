import { render, h } from 'preact';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomFab from './CustomFab.jsx'
import { getTime, colorShade } from '../utils'

export default function ListItem(props) {
    const time=props.entry.duration<0?
        getTime(props.entry.duration+Date.now()/1000)
        :props.entry.time

    const lightColor=colorShade(props.entry?.project?.hex_color, +50)

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

                <CustomFab isRunning={props.entry.isRunning} isEditing={props.isEditing} color={lightColor} />

            </Box>
        </Card>
    );
}
