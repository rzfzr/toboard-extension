import { render, h } from 'preact';

import Button from '@mui/material/Button';
// import PlayArrowIcon from '@mui/icons/PlayArrow';

export default function ToggleComponent(props) {
    return (
        <div>
            {/* <PlayArrowIcon /> */}
            <Button variant="contained" color="primary">
                {props.entry.description}
            </Button>
        </div>
    );
}
