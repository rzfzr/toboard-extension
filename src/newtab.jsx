import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import ListView from './components/ListView.jsx';


function NewPage() {
    const [entries, setEntries]=useState([]);
    useEffect(() => {
        chrome.storage.sync.get(['entries'], (result) => {
            setEntries(result.entries)
        })
    }, [])

    return <div> <ListView entries={entries} />  </div>
}

render(<NewPage />,
    document.getElementById('app')
);