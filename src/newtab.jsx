import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import TogglClient from 'toggl-api';

function NewPage() {
    const [tokenValue, setTokenValue]=useState('');


    useEffect(() => {
        chrome.storage.sync.get(['token'], (result) => {
            setTokenValue(result.token)
            console.log('test', TogglClient)

        })
    }, [])

    return <div>
        <p>{tokenValue}</p>
    </div>
}

render(<NewPage />,
    document.getElementById('app')
);