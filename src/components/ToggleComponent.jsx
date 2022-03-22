import { render, h } from 'preact';

import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
export default function ToggleComponent(props) {
    return (
        <Button
            size="large"
            startIcon={props.entry.isRunning? <PauseCircleFilledIcon fontSize="large" />:<PlayArrowIcon fontSize="large" />}
            variant="contained" color="primary" >{props.entry.description}
        </Button>
    );
}
