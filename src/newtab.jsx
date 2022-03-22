import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import ListView from './components/ListView.jsx';
import css from "../global.css";

function NewPage() {
    const [entries, setEntries]=useState([]);
    useEffect(() => {
        chrome.storage.sync.get(['entries', 'projects'], (result) => {


            result.entries.forEach(entry => {
                entry.project=result.projects.find(p => p.id===entry.pid)
            });

            console.log('setting', result.entries)

            setEntries(result.entries)
        })
    }, [])

    return <div > <ListView entries={entries} />  </div>
}

render(<NewPage />,
    document.getElementById('app')
);