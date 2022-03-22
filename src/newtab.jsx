import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import TogglClient from 'toggl-api';

function NewPage() {
    const [tokenValue, setTokenValue]=useState('');

    const [client, setClient]=useState(new TogglClient())

    useEffect(() => {
        chrome.storage.sync.get(['token'], (result) => {
            setTokenValue(result.token)
            const client=new TogglClient({ apiToken: result.token })
            setClient(client)
        })
    }, [])

    return <div> {tokenValue==""
        ? "No client"
        :JSON.stringify(client)
    }</div>
}

render(<NewPage />,
    document.getElementById('app')
);