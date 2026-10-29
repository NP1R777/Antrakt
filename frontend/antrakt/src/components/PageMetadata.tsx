import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { DEFAULT_META_DESCRIPTION, SITE_NAME } from '../hooks/usePageMeta';

export interface PublicMetadata {
    path: string;
    title: string;
    description: string;
    image: string;
    canonical: string | null;
    type: string;
    noindex: boolean;
}

function setMeta(key: string, content: string, property = false) {
    const attribute = property ? 'property' : 'name';
    const nodes = document.head.querySelectorAll<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    const node = nodes[0] || document.createElement('meta');
    nodes.forEach((other, index) => { if (index) other.remove(); });
    node.setAttribute(attribute, key);
    node.content = content;
    if (!node.parentNode) document.head.appendChild(node);
}

export function applyPublicMetadata(data: PublicMetadata) {
    document.head.querySelectorAll('link[rel="canonical"], meta[property="og:url"]').forEach(node => node.remove());
    if (data.canonical) {
        const link = document.createElement('link');
        link.rel = 'canonical'; link.href = data.canonical;
        document.head.appendChild(link);
        setMeta('og:url', data.canonical, true);
    }
    setMeta('robots', data.noindex ? 'noindex, nofollow' : 'index, follow');
    Object.entries({ 'og:title': data.title, 'og:description': data.description, 'og:image': data.image,
        'og:type': data.type, 'og:site_name': SITE_NAME, 'og:locale': 'ru_RU' }).forEach(([key, value]) => setMeta(key, value, true));
    Object.entries({ 'twitter:card': 'summary_large_image', 'twitter:title': data.title,
        'twitter:description': data.description, 'twitter:image': data.image }).forEach(([key, value]) => setMeta(key, value));
}

/** Сервер уже отдал метатеги. Здесь обновляем их при переходах внутри SPA. */
export default function PageMetadata() {
    const { pathname } = useLocation();
    useEffect(() => {
        let current = true;
        const controller = new AbortController();
        const normalizedPath = pathname.replace(/\/+$/, '') || '/';
        const initial = document.getElementById('page-metadata');
        if (initial) {
            try {
                const data: PublicMetadata = JSON.parse(initial.textContent || '');
                if (data.path === normalizedPath) {
                    applyPublicMetadata(data);
                    initial.remove();
                    return () => { current = false; controller.abort(); };
                }
            } catch { /* В dev нет серверного JSON, получим данные через API. */ }
            initial.remove();
        }
        // Пока идёт запрос, не оставляем постер/канонический URL предыдущей страницы.
        applyPublicMetadata({ path: normalizedPath, title: SITE_NAME, description: DEFAULT_META_DESCRIPTION,
            image: `${window.location.origin}/logo512.png`, canonical: null, type: 'website', noindex: true });
        axios.get(`${API_URL}/page-metadata/`, { params: { path: pathname }, signal: controller.signal })
            .then(response => { if (current) applyPublicMetadata(response.data); })
            .catch(() => { /* Ошибка не мешает React-странице; чужие метатеги уже очищены. */ });
        return () => { current = false; controller.abort(); };
    }, [pathname]);
    return null;
}
