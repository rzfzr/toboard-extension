import bootstrap from "../main"
function Popup() {
    console.log('Popup')
    return (<h1>Popup</h1>)
}

Popup.displayName = 'Popup'
bootstrap(Popup)
