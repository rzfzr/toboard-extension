import EntryComponent from './EntryComponent.js'

import useStore from '../useStore.js'

export default function CurrentEntry() {
    const entry = useStore((state) => state.entries.find((e) => e.duration < 0))

    if (!entry) return null

    return <EntryComponent
        entry={entry}
    />

}
