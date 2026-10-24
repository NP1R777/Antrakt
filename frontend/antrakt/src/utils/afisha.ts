export type AfishaType = 'performance' | 'archive';

export const afishaPath = (type: AfishaType, id: number) => `/afisha/${type}/${id}`;

export function ticketUrl(value?: string | null): string | null {
    if (!value) return null;
    try {
        const url = new URL(value.trim());
        return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
    } catch {
        return null;
    }
}

export const formatShowDatetime = (value: string): string => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Время уточняется' : date.toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
        timeZone: 'Asia/Krasnoyarsk',
    });
};
