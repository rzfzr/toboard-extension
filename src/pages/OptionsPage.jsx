import "../../global.css";
import { render, h } from 'preact';
import Options from '../components/Options.jsx';


export default function OptionsPage() {
    return <Options />
}

render(<OptionsPage />,
    document.getElementById('app')
);