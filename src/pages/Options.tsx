import bootstrap from '../main'
import "../global.css"
import OptionList from '../components/OptionList'
export default function Options() {
    return (<OptionList />)
}

Options.displayName = 'Options'
bootstrap(Options)