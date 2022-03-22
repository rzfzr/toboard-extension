import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

function OptionsPage() {
    const [tokenValue, setTokenValue]=useState('');
    const [status, setStatus]=useState('');

    useEffect(() => {
        chrome.storage.local.get(['token'], (result) => {
            setTokenValue(result.token)
        })
    }, [])

    const onSubmit=(event) => {
        event.preventDefault();
        chrome.storage.local.set({
            token: tokenValue,
        }, () => {
            setStatus("Token was saved !")
            setTimeout(() => {
                setStatus('');
            }, 750);
        });
    }

    const onInput=(event) => setTokenValue(event.target.value)

    return <form onSubmit={onSubmit}>
        <label for="username">Enter API Token:</label>
        <input type="text" value={tokenValue} onInput={onInput} />
        <p>{status}</p>
        <button type="submit">Submit</button>
    </form>
}

render(<OptionsPage />,
    document.getElementById('app')
);