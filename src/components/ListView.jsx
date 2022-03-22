import { render, h } from 'preact';
import ListItem from './ListItem.jsx';

export default function ListView(props) {
    const entries=props.entries? props.entries.reverse():[]

    return <div >
        {entries.map((entry) =>
            <ListItem entry={entry} />
        )
        } </div>
}
