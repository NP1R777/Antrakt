import { PLACEHOLDER_IMAGE_URL } from '../config';

/** Основное изображение или заглушка из REACT_APP_PLACEHOLDER_IMAGE_URL. */
export function getImageUrl(...candidates: Array<string | null | undefined>): string {
    for (const candidate of candidates) {
        if (candidate && String(candidate).trim()) {
            return String(candidate).trim();
        }
    }
    return PLACEHOLDER_IMAGE_URL;
}
