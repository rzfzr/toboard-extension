export function colorShade(col: any, amt: any) {
    if (!col) return;
    col = col.replace(/^#/, "");
    if (col.length === 3)
        col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

    let [r, g, b] = col.match(/.{2}/g);
    [r, g, b] = [
        parseInt(r, 16) + amt,
        parseInt(g, 16) + amt,
        parseInt(b, 16) + amt,
    ];

    r = Math.max(Math.min(255, r), 0).toString(16);
    g = Math.max(Math.min(255, g), 0).toString(16);
    b = Math.max(Math.min(255, b), 0).toString(16);

    const rr = (r.length < 2 ? "0" : "") + r;
    const gg = (g.length < 2 ? "0" : "") + g;
    const bb = (b.length < 2 ? "0" : "") + b;

    return `#${rr}${gg}${bb}`;
}
export function getTime(seconds: bigint, returnSeconds = false) {
    const d = Number(seconds);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);
    const hDisplay =
        h > 0 ? `${h.toString().length > 1 ? `${h}` : `${0}${h}`}` : "00";
    const mDisplay =
        m > 0 ? `${m.toString().length > 1 ? `${m}` : `${0}${m}`}` : "00";
    const sDisplay =
        s > 0 ? `${s.toString().length > 1 ? `${s}` : `${0}${s}`}` : "00";

    if (returnSeconds) return `${hDisplay}:${mDisplay}:${sDisplay}`;
    else return `${hDisplay}:${mDisplay}`;
}
export function getPreviousMonday() {
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
export function getCalendarFormat(date: any) {
    var yyyy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    return String((yyyy) + '-' + (mm) + '-' + dd + ' ' + h + ':' + m);
}
export function formatDate(date: any, returnYear = false) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    if (returnYear)
        return [day, month, year].join('/');
    else return [day, month].join('/');
}