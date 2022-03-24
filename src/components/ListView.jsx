import { render, h, Fragment } from 'preact';
import ListItem from './ListItem.jsx';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
    formatDate
} from '../utils'

export default function ListView(props) {
    const entries=props.entries? props.entries.reverse():[]
    let days=[]

    entries.forEach((entry) => {
        let entryDate=formatDate(new Date(entry.start));
        let day=days.find((d) => d.label==entryDate);
        if (!day) {
            days.push({ label: entryDate });
            day=days.find((d) => d.label==entryDate);
        }
        if (!day.entries) day.entries=[];
        day.entries.push(entry);
    });

    days.sort();

    return <Fragment >
        {days.map(day =>
            <Accordion >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{day.label}</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ padding: 0 }}>
                    {day.entries.map((entry) =>
                        <ListItem entry={entry} />
                    )}
                </AccordionDetails>
            </Accordion>
        )}
    </Fragment>
}
