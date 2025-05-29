export function formatDateGermanNoTime(date: Date): string {

    if (!date)
        return '-';

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}