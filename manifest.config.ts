import { defineManifest } from '@crxjs/vite-plugin'
//@ts-ignore
import packageJson from './package.json'
const { version, name } = packageJson

const [major, minor, patch, label = '0'] = version
    .replace(/[^\d.-]+/g, '')
    .split(/[.-]/)

export default defineManifest(async (env) => ({
    manifest_version: 3,
    name: 'toboard',
    version: `${major}.${minor}.${patch}.${label}`,
    version_name: version,
    action: {
        default_popup: 'src/templates/popup.html'
    },
    description: "Dashboard for quick switching entries with toggl's API",
    options_page: "src/templates/options.html",
    permissions: [
        "alarms",
        "storage",
    ],
    host_permissions: [
        "*://*.api.track.toggl.com/*"
    ],
    chrome_url_overrides: {
        "newtab": "src/templates/newtab.html"
    },
    background: {
        "service_worker": "src/background.ts",
        "type": "module"
    },
    icons: {
        "16": "icons/16.png",
        "48": "icons/48.png",
        "128": "icons/128.png"
    }
}))