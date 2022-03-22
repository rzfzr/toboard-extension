import { render, h } from 'preact';

import Button from '@mui/material/Button';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

export default function ToggleComponent(props) {
    console.log('receivied props', props.entry)

    return (
        <Button
            size="large"
            startIcon={props.entry.isRunning? <PauseCircleIcon fontSize="large" />:<PlayCircleIcon fontSize="large" />}
            variant="contained" color="primary"
            style={{ width: '100%', margin: '5px', backgroundColor: props.entry.project.hex_color }}
        >{props.entry.description}
        </Button>
    );
}
