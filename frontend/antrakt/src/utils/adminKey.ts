import axios from 'axios';

const ADMIN_KEY_STORAGE = 'admin_key';

export function getAdminKey(): string | null {
	try {
		return localStorage.getItem(ADMIN_KEY_STORAGE);
	} catch {
		return null;
	}
}

export function setAdminKey(key: string): void {
	try {
		localStorage.setItem(ADMIN_KEY_STORAGE, key);
		axios.defaults.headers.common['X-Admin-Key'] = key;
	} catch {}
}

export function clearAdminKey(): void {
	try {
		localStorage.removeItem(ADMIN_KEY_STORAGE);
		delete axios.defaults.headers.common['X-Admin-Key'];
	} catch {}
}

export function hasAdminKey(): boolean {
	return !!getAdminKey();
}

// Initialize on module load
const existing = getAdminKey();
if (existing) {
	axios.defaults.headers.common['X-Admin-Key'] = existing;
}