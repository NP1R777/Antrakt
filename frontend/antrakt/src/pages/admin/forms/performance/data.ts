import type { Performance } from './types';
import { COLLECTIVE_OPTIONS } from './options';
import { emptyStringsToNull } from '../../../../utils/adminPayload';

// Даты показа сохраняют местное время театра: без пересчёта через часовой пояс браузера.
const toLocalInput = (value?: string | null) =>
    value ? value.slice(0, 16) : '';

export const normalizeInitial = (data?: Partial<Performance>): Partial<Performance> => {
    const base: Partial<Performance> = {
        is_active: true,
        production_team: [],
        shows: [],
        cast: [],
        afisha: true,
        deleted_at: null,
        performances_image: '',
        images_list: [],
        production_collective: COLLECTIVE_OPTIONS[0] // по умолчанию — труппа Норильского театра
    };
    if (!data) return base;
    return {
        ...base,
        ...data,
        production_team: data.production_team || [],
        images_list: data.images_list || [],
        shows: (data.shows || []).map(s => ({
            ...s,
            show_datetime: toLocalInput(s.show_datetime)
        })),
        cast: (data.cast || []).map(c => ({
            id: c.id,
            actor: c.actor,
            director: (c as any).director ?? null,
            actor_name: c.actor_name,
            role: c.role
        }))
    };
};

export const formatShowLabel = (value: string) => {
    if (!value) return '';
    const [datePart, timePart] = value.split('T');
    if (!datePart) return value;
    const [y, m, d] = datePart.split('-');
    return `${d}.${m}.${y}${timePart ? ' ' + timePart.slice(0, 5) : ''}`;
};

export const buildPerformancePayload = (currentPerformance: Partial<Performance>) => emptyStringsToNull(
    { ...currentPerformance } as Record<string, unknown>,
    [
        'duration',
        'premiere_date',
        'ticket_url',
        'performances_image',
        'deleted_at',
        'director',
        'production_year',
    ],
);
