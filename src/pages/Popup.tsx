import bootstrap from "../main"
import "../global.css";

function Popup() {
    console.log('-> Popup')
    return (<h1>Popup</h1>)
}

Popup.displayName = 'Popup'
bootstrap(Popup)
