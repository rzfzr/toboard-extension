import { render, h } from 'preact';
import { withStyles } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

function Progress(props) {
    const BorderLinearProgress=withStyles((theme) => ({
        root: {
            height: 50,
            borderRadius: 5,
        },
        colorPrimary: {
            backgroundColor: theme.palette.grey[theme.palette.type==='light'? 200:700],
        },
        bar: {
            borderRadius: 5,
            backgroundColor: props.color,
        },
    }))(LinearProgress);
    return (
        <BorderLinearProgress variant={props.isRunning? 'buffer':'determinate'} value={props.value} valueBuffer={0} />
    )
}

export default function GoalComponent(props) {
    return (
        <div>
            <Progress isRunning={true} value={10} color={'red'} />
        </div>
    )
}