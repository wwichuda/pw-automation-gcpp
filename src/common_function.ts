import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Kolkata');

export function getCurrentDate() {
    return String(dayjs().tz().format('YYYY-MM-DD'));
}

export function getSubtractDate(day:number) {
    return String(dayjs().tz().subtract(day, 'day').format('YYYY-MM-DD'));
}

export function getSubtractDateWithFormat(day:number,format:string) {
    return String(dayjs().tz().subtract(day, 'day').format(format));
}

export function getCurrentDateWithFormat(format:string) {
    return String(dayjs().tz().format(format));
}

export function getCurrentTime() {
    return String(dayjs().tz().format('hh:mm'));
}

export function getCurrentTimeWithFormat(format:string) {
    return String(dayjs().tz().format(format));
}

export function extractedSubstring(inputString: string) {
    const match = inputString.match(/\[(.*?)\]/);
    return match ? match[1] : null;
}
