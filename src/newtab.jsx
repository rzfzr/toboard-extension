import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

function NewPage() {
    const [entries, setEntries]=useState([]);
    useEffect(() => {
        chrome.storage.sync.get(['entries'], (result) => {
            setEntries(result.entries)
        })
    }, [])

    return <div> {entries.map((entry) =>
        <div key={entry.id}>{entry.description}</div>)} </div>
}

render(<NewPage />,
    document.getElementById('app')
);