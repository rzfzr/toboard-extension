import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import ToggleComponent from './components/ToggleComponent.jsx';


function NewPage() {
    const [entries, setEntries]=useState([]);
    useEffect(() => {
        chrome.storage.sync.get(['entries'], (result) => {
            setEntries(result.entries)
        })
    }, [])

    return <div> {entries.map((entry) =>
        <ToggleComponent entry={entry} />
    )} </div>
}

render(<NewPage />,
    document.getElementById('app')
);