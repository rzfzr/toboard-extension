import bootstrap from "../main"
import "../global.css"
import { Button } from "@mui/material"

function Popup() {
    return (<>
        <Button onClick={() => {
            chrome.tabs.update({ url: "chrome://newtab" })
        }} >Go to New Page
        </Button>
        <Button onClick={() => {
            chrome.tabs.update({ url: chrome.runtime.getURL("src/templates/options.html") })
        }} >Go to Options Page
        </Button>
    </>)
}

Popup.displayName = 'Popup'
bootstrap(Popup)
