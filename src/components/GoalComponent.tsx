import LinearProgress from '@mui/material/LinearProgress'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import CustomFab from './CustomFab.js'
import { colorShade, getTime } from '../utils.js'
import { Goal } from '../toboard.js'
import useStore from '../useStore.js'

export default function GoalComponent(props: { goal: Goal, isEditing: boolean, delete: (goal: any) => void }) {
    const project = useStore((state) => state.projects.find((p) => p.id === props.goal.pid))
    const progress = Math.min((100 / props.goal.target) * (props.goal.duration / 60), 100)
    const lightColor = colorShade(project?.color, +50) || '#B2BEB5'

    const time = `${getTime(props.goal.duration)} / ${getTime(props.goal.target * 60)}`
    return (
        <Card className='relative flex items-center group' sx={{ height: '75px', display: 'flex', marginBottom: '5px' }}>

            <Box className="left-0 right-0 flex flex-col w-3/4 text-xl text-white" >
                <CardContent sx={{
                    flex: '1 0 auto',
                    padding: '10px 20px',
                    paddingTop: props.goal.description != '' ? '10px' : '23px',
                }}>
                    <Typography
                        component="div"
                        variant="subtitle1">
                        {props.goal.description != '' ? props.goal.description : project?.name}
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        component="div" >
                        {props.goal.description != '' ? project?.name : ''}
                    </Typography>
                </CardContent>
            </Box>
            <CustomFab
                isRunning={props.goal.isRunning}
                isEditing={props.isEditing}
                nonHoverText={time}
                delete={() => props.delete(props.goal)}
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