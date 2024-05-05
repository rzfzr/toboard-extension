import EntryComponent from './EntryComponent.js'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import useStore from '../useStore.js'

import {
    formatDate
} from '../utils.js'

export default function CurrentEntry() {
    const entry = useStore((state) => state.entries[0])

    return <EntryComponent
        entry={entry}
    />

}
