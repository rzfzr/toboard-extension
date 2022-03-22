import { render, h } from 'preact';

import Button from '@mui/material/Button';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

export default function ToggleComponent(props) {
    return (
        <Button
            size="large"
            startIcon={props.entry.isRunning? <PauseCircleIcon fontSize="large" />:<PlayCircleIcon fontSize="large" />}
            variant="contained" color="primary"
            style={{ width: '100%', margin: '5px' }}
        >{props.entry.description}
        </Button>
    );
}
