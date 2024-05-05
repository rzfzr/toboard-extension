import EntryComponent from './EntryComponent.js'

import useStore from '../useStore.js'

export default function CurrentEntry() {
    const entry = useStore((state) => state.entries[0])

    if (entry.duration > 0) return null

    return <EntryComponent
        entry={entry}
    />

}
