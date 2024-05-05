import Card from '@mui/material/Card'
import Box from '@mui/material/Box'

import CustomFab from './CustomFab.js'
import { colorShade } from '../utils.js'
import { Favorite } from '../toboard.js'
import useStore from '../useStore.js'
import CardText from './CardText.js'

export default function FavoriteComponent(
    props: {
        favorite: Favorite,
        isEditing: boolean,
        delFavorite: (favorite: any) => void
    }) {
    const project = useStore((state) => state.projects.find((p) => p.id === props.favorite?.pid))
    const lightColor = colorShade(project?.color, +50) || '#B2BEB5'

    return (
        <Card className='relative flex items-center h-20 mb-1'>
            <CardText
                description={props.favorite.description}
                project={project} />
            <CustomFab
                entry={props.favorite}
                delete={() => props.delFavorite(props.favorite)}
                color={lightColor}
                isEditing={props.isEditing}
            />
        </Card>
    )
}
