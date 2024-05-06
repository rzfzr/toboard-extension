import Fab from '@mui/material/Fab'

import CircularProgress from '@mui/material/CircularProgress'

import DeleteIcon from '@mui/icons-material/Delete'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import { Typography } from '@mui/material'
import useStore from '../useStore'

export default function CustomFab(props:
    {
        isEditing?: boolean,
        isRunning?: boolean,
        nonHoverText?: string,
        color: string,
        entry: any,
        delete?: (entry: any) => void
    }) {

    const { addEntry, editEntry } = useStore((state) => ({
        addEntry: state.addEntry,
        editEntry: state.editEntry
    }))

    const sendToggle = () => {
        chrome.runtime.sendMessage({
            message: 'toggle',
            description: props.entry.description,
            projectId: props.entry.pid
        }, (result) => {
            for (const change of result) {
                if (change.status === 'started') {
                    addEntry(change.entry)
                } else if (change.status === 'stopped') {
                    editEntry(change.entry)
                }
            }
        })
    }
    if (props.isEditing && props.delete) {
        return <Fab sx={{ color: props.color, transform: 'scale(0.5)' }}
            onClick={() => { props.delete && props.delete(props.entry) }}>
            <DeleteIcon sx={{ transform: 'scale(2)' }} />
        </Fab>
    }


    return <div className='relative grid place-items-center group'>
        <Typography
            variant="subtitle2"
            component="div"
            color="white"
            className='absolute z-50 m-0 text-center align-middle opacity-100 right-1 group-hover:opacity-0'
        >
            {props.nonHoverText || ''}
        </Typography >
        <Fab
            sx={{ color: props.color, transform: 'scale(0.5)' }}
            className={props.nonHoverText && 'opacity-0 group-hover:opacity-100'}
            onClick={sendToggle}>
            {props.isRunning && <>
                <PauseCircleIcon
                    className='absolute'
                    sx={{ transform: 'scale(2.2)' }} />
                <CircularProgress
                    className='absolute'
                    size={55}
                    sx={{
                        color: props.color,
                        zIndex: 0,
                    }}
                />
            </>}
            {!props.isRunning &&
                <PlayCircleIcon
                    className='absolute'
                    sx={{ transform: 'scale(2.2)' }} />
            }
        </Fab >
    </div>
}