import { render, h } from 'preact';
import ToggleComponent from './ToggleComponent.jsx';

export default function ListView(props) {
    const entries=props.entries.reverse()

    return <div style={{ maxWidth: '200px' }}>
        {
            entries.map((entry) =>
                <ToggleComponent entry={entry} />
            )
        } </div>
}
