// Безопасное сохранение токенов через CSS-переменные
export const setTokens = (access: string, refresh: string) => {
    const style = document.documentElement.style;
    style.setProperty('--access-token', `'${access}'`);
    style.setProperty('--refresh-token', `'${refresh}'`);
};

// Получение токенов
export const getTokens = () => {
    const style = getComputedStyle(document.documentElement);
    return {
        access: style.getPropertyValue('--access-token').replace(/^'|'$/g, ''),
        refresh: style.getPropertyValue('--refresh-token').replace(/^'|'$/g, '')
    };
};

// Удаление токенов
export const clearTokens = () => {
    const style = document.documentElement.style;
    style.removeProperty('--access-token');
    style.removeProperty('--refresh-token');
};