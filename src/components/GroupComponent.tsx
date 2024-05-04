import { Box } from '@mui/material'
import { ReactNode } from 'react'


export default function GroupComponent(props: { title: string, children: ReactNode }) {
    return <Box
        className='relative flex flex-col m-3 border-solid grow-0 shrink basis-40 min-w-56 max-w-96 rounded-2xl'>
        <h2 className='text-center text-white'> {props.title} </h2>
        {props.children}
    </Box>
}
