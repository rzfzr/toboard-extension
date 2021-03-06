import { render, h, Fragment } from 'preact';

import Fab from '@mui/material/Fab';

import CircularProgress from '@mui/material/CircularProgress';

import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

export default function CustomFab(props) {
    return <Fragment>
        {props.isEditing?
            <Fab sx={{ color: props.color, transform: 'scale(0.5)' }}
                onClick={() => { props.delete(props.entry) }}>
                <DeleteIcon sx={{ transform: 'scale(2)' }} />
            </Fab>
            :
            <Fab sx={{ color: props.color, transform: 'scale(0.5)' }}
                onClick={() => {
                    chrome.runtime.sendMessage({ message: 'toggle', entry: props.entry }, function (response) {
                        console.log(response);
                    });
                }}>
                {props.isRunning?
                    <Fragment>
                        <PauseCircleIcon sx={{ transform: 'scale(2.2)' }} />
                        <CircularProgress
                            size={55}
                            sx={{
                                color: props.color,
                                position: 'absolute',
                                zIndex: 0,
                            }}
                        />
                    </Fragment>
                    :
                    <PlayCircleIcon sx={{ transform: 'scale(2.2)' }} />

                }
            </Fab>
        }
    </Fragment>
}