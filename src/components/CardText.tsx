import { Box, CardContent, Typography } from "@mui/material"
import { Project } from "../toboard"

export default function CardText(props: { description: string | null | undefined, project: Project | null | undefined }) {
    return (
        <Box className="left-0 right-0 flex flex-col w-3/4 text-xl text-white" >
            <CardContent sx={{
                className: 'flex flex-col w-3/4 text-xl text-white ',
            }}>
                <Typography
                    className='relative z-50'
                    variant="subtitle1">
                    {props.description != '' ? props.description : props.project?.name}
                </Typography>
                <Typography
                    className='relative z-50'
                    variant="subtitle2"
                    color={props.project?.color || 'white'}
                >
                    {props.description != '' ? props.project?.name : ''}
                </Typography>
            </CardContent>
        </Box>
    )
}