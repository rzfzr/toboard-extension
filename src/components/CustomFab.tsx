import Fab from '@mui/material/Fab'

import CircularProgress from '@mui/material/CircularProgress'

import DeleteIcon from '@mui/icons-material/Delete'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import { Typography } from '@mui/material'

export default function CustomFab(props:
    {
        isEditing?: boolean,
        isRunning?: boolean,
        nonHoverText?: string,
        color: string,
        entry: any,
        delete?: (entry: any) => void
    }) {

    const sendToggle = () => {
        chrome.runtime.sendMessage({
            message: 'toggle',
            description: props.entry.description,
            projectId: props.entry.pid
        }, function (response) {
            console.log(response)
        })
    }

    if (props.isEditing && props.delete) {
        return <Fab sx={{ color: props.color, transform: 'scale(0.5)' }}
            onClick={() => { props.delete && props.delete(props.entry) }}>
            <DeleteIcon sx={{ transform: 'scale(2)' }} />
        </Fab>
    }


    return <>
        <Typography
            variant="subtitle2"
            component="div"
            color="white"
            className='block m-0 text-center align-middle group-hover:hidden'
        >
            {props.nonHoverText || ''}
        </Typography >

        <Fab sx={{ color: props.color, transform: 'scale(0.5)' }}
            className='hidden group-hover:block'
            onClick={sendToggle}>

            {props.isRunning && <>
                <PauseCircleIcon sx={{ transform: 'scale(2.2)' }} />
                <CircularProgress
                    size={55}
                    sx={{
                        color: props.color,
                        zIndex: 0,
                    }}
                />
            </>
            }
            {!props.isRunning &&
                <PlayCircleIcon sx={{ transform: 'scale(2.2)' }} />
            }
        </Fab >

    </>
}