import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import CustomFab from './CustomFab.js'
import { colorShade } from '../utils.js'
import { Entry, Favorite } from '../toboard.js'
import useStore from '../useStore.js'

export default function FavoriteComponent(props: { favorite: Favorite, isEditing?: boolean }) {
    const project = useStore((state) => state.projects.find((p) => p.id === props.favorite?.pid))
    const lightColor = colorShade(project?.color, +50) || '#B2BEB5'


    return (<Card className='content' sx={{ height: '75px', display: 'flex', marginBottom: '5px' }}>
        <Box className="absolute left-0 right-0 flex-col w-3/4 text-xl text-white" sx={{ display: 'flex', flexDirection: 'column', width: '75%', maxWidth: '75%' }}>
            <CardContent sx={{ flex: '1 0 auto', padding: '10px 20px' }}>
                <Typography
                    variant="subtitle1"
                    component="div"
                    color="white">
                    {props.favorite.description}
                </Typography>
                <Typography
                    variant="subtitle2"
                    color={project?.color}
                    component="div"
                    style={{ textShadow: '1px 1px grey' }}>
                    {project?.name}
                </Typography>
            </CardContent>
        </Box>
        <Box className="absolute right-0 flex items-center p-3">
            <CustomFab
                entry={props.favorite}
                color={lightColor}
            />
        </Box>
    </Card>
    )
}
