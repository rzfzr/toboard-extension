import Fab from '@mui/material/Fab'

import CircularProgress from '@mui/material/CircularProgress'

import DeleteIcon from '@mui/icons-material/Delete'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'

export default function CustomFab(props:
    {
        isEditing?: boolean,
        isRunning?: boolean,
        color: string,
        entry: any,
        delete?: (entry: any) => void
    }) {
    return <>
        {props.isEditing ?
            <Fab sx={{ color: props.color, transform: 'scale(0.5)' }}
                onClick={() => { props.delete && props.delete(props.entry) }}>
                <DeleteIcon sx={{ transform: 'scale(2)' }} />
            </Fab>
            :
            <Fab sx={{ color: props.color, transform: 'scale(0.5)' }}
                onClick={() => {
                    console.log('trying', props.entry)
                    chrome.runtime.sendMessage({
                        message: 'toggle',
                        description: props.entry.description,
                        projectId: props.entry.pid
                    }, function (response) {
                        console.log(response)
                    })
                }}>
                {props.isRunning ?
                    <>
                        <PauseCircleIcon sx={{ transform: 'scale(2.2)' }} />
                        <CircularProgress
                            size={55}
                            sx={{
                                color: props.color,
                                position: 'absolute',
                                zIndex: 0,
                            }}
                        />
                    </>
                    :
                    <PlayCircleIcon sx={{ transform: 'scale(2.2)' }} />

                }
            </Fab>
        }
    </>
}