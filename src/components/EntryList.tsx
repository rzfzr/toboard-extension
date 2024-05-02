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

export default function EntryList() {
    const entries = useStore((state) => state.entries)

    let days: any[] = []

    entries.forEach((entry: any) => {
        let entryDate = formatDate(new Date(entry.start))
        let day = days.find((d: any) => d.label == entryDate)
        if (!day) {
            days.push({ label: entryDate })
            day = days.find((d) => d.label == entryDate)
        }
        if (!day?.entries) day.entries = []
        day.entries.push(entry)
    })

    days.sort()
    return < >
        {days.map(day =>
            <Accordion
                key={day.label}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{day.label}</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ padding: 0 }}>
                    {day.entries.map((entry: any) =>
                        <EntryComponent
                            key={entry.id}
                            entry={entry}
                        />
                    )}
                </AccordionDetails>
            </Accordion>
        )}
    </>
}
