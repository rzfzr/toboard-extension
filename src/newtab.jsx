import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

function NewPage() {
    // const [tokenValue, setTokenValue]=useState('');
    // const [client, setClient]=useState(new TogglClient())

    return <div>No client</div>
}

render(<NewPage />,
    document.getElementById('app')
);