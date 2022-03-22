import TogglClient from 'toggl-api';
import 'babel-polyfill'


chrome.storage.sync.get(['token'], (result) => {
    const client = new TogglClient({
        apiToken: result.token
    })

    function getPreviousMonday() {
        var date = new Date();
        var day = date.getDay();
        var prevMonday = new Date();
        if (date.getDay() === 0) {
            prevMonday.setDate(date.getDate() - 7);
        } else {
            prevMonday.setDate(date.getDate() - (day - 1));
        }
        prevMonday.setHours(0, 0, 0, 0);
        return prevMonday.toISOString();
    }
    client.getTimeEntries(
        getPreviousMonday(),
        new Date().toISOString(),
        (err, timeEntries) => {
            if (err) {
                console.log("Error getting timeEntries: ", err);
            } else {
                console.log("Received timeEntries:", timeEntries)
                timeEntries.forEach((entry) => {
                    entry.isRunning = entry.duration < 0
                });

                chrome.storage.sync.set({
                    entries: timeEntries,
                }, () => {
                    console.log('Saved entries!')
                })
            }
        }
    )
})