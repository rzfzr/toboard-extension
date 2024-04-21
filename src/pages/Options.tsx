import bootstrap from '../main'
export default function Options() {
    console.log('-> Options')
    return <h1>Options</h1>
}

Options.displayName = 'Options'
bootstrap(Options)