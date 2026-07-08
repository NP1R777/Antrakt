import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export interface SiteContentItem {
    id: number;
    key: string;
    value: string;
    section: string;
    label: string;
    multiline: boolean;
    order: number;
}

interface SiteContentContextValue {
    content: Record<string, string>;
    getText: (key: string, fallback?: string) => string;
    reload: () => void;
}

const defaultValue: SiteContentContextValue = {
    content: {},
    getText: (_key: string, fallback = '') => fallback,
    reload: () => { },
};

export const SiteContentContext = createContext<SiteContentContextValue>(defaultValue);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [content, setContent] = useState<Record<string, string>>({});

    const load = useCallback(() => {
        axios.get('http://localhost:8000/site-content/')
            .then(res => {
                const map: Record<string, string> = {};
                (res.data || []).forEach((item: SiteContentItem) => {
                    map[item.key] = item.value;
                });
                setContent(map);
            })
            .catch(() => { /* при недоступности API остаются значения по умолчанию */ });
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    // Значение из БД, иначе — переданный запасной текст (хардкод в компоненте).
    const getText = useCallback(
        (key: string, fallback = '') => {
            const v = content[key];
            return v !== undefined && v !== null && v !== '' ? v : fallback;
        },
        [content]
    );

    return (
        <SiteContentContext.Provider value={{ content, getText, reload: load }}>
            {children}
        </SiteContentContext.Provider>
    );
};

export const useSiteContent = () => useContext(SiteContentContext);
