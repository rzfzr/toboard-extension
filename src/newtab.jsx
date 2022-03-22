import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import TogglClient from 'toggl-api';
import 'babel-polyfill'

function NewPage() {
    const [tokenValue, setTokenValue]=useState('');
    const [client, setClient]=useState(new TogglClient())

    useEffect(() => {
        chrome.storage.sync.get(['token'], (result) => {
            setTokenValue(result.token)
            const client=new TogglClient({ apiToken: result.token })
            setClient(client)
            function getPreviousMonday() {
                var date=new Date();
                var day=date.getDay();
                var prevMonday=new Date();
                if (date.getDay()===0) {
                    prevMonday.setDate(date.getDate()-7);
                } else {
                    prevMonday.setDate(date.getDate()-(day-1));
                }
                prevMonday.setHours(0, 0, 0, 0);
                return prevMonday.toISOString();
            }

            console.log('sup')
            client.getTimeEntries(
                getPreviousMonday(),
                new Date().toISOString(),
                (err, timeEntries) => {
                    console.log(timeEntries, err)
                }
            )
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