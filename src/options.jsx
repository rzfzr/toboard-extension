import { render, h } from 'preact';
import { useState } from 'preact/hooks';

function OptionsPage(props) {

    const [value, setValue]=useState('');

    const onSubmit=(event) => {
        alert("Submitted a form "+value);
        event.preventDefault();
    }

    const onInput=(event) => setValue(event.target.value)

    return <form onSubmit={onSubmit}>
        <label for="username">Enter API key:</label>
        <input type="text" value={value} onInput={onInput} />
        <button type="submit">Submit</button>
    </form>
}

render(<OptionsPage />,
    document.getElementById('app')
);