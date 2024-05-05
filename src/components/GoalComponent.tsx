import LinearProgress from '@mui/material/LinearProgress'
import Card from '@mui/material/Card'
import CustomFab from './CustomFab.js'
import { colorShade, getTime } from '../utils.js'
import { Goal } from '../toboard.js'
import useStore from '../useStore.js'
import CardText from './CardText.js'

export default function GoalComponent(
    props: {
        goal: Goal,
        isEditing: boolean,
        delGoal: (goal: any) => void
    }) {
    const project = useStore((state) => state.projects.find((p) => p.id === props.goal.pid))
    const progress = Math.min((100 / props.goal.target) * (props.goal.duration / 60), 100)
    const lightColor = colorShade(project?.color, +50) || '#B2BEB5'

    const time = `${getTime(props.goal.duration)} / ${getTime(props.goal.target * 60)}`
    return (
        <Card className='relative flex items-center h-20 mb-1'>
            <CardText
                description={props.goal.description}
                project={project} />
            <CustomFab
                isRunning={props.goal.isRunning}
                isEditing={props.isEditing}
                nonHoverText={time}
                delete={() => props.delGoal(props.goal)}
                entry={props.goal}
                color={lightColor}
            />
            <LinearProgress
                className='absolute w-full h-full'
                variant={props.goal.isRunning ? "buffer" : "determinate"}
                value={progress}
                valueBuffer={progress + 5}
                color='inherit'
                style={{ height: '75px', color: project?.color }} />
        </Card>
    )
}