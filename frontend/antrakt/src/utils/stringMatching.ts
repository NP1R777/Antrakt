/**
 * Утилиты для нечёткого поиска и сравнения строк
 */

/**
 * Вычисляет расстояние Левенштейна между двумя строками
 * @param str1 - первая строка
 * @param str2 - вторая строка
 * @returns расстояние редактирования
 */
export const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) {
        matrix[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j++) {
        matrix[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            if (str1[i - 1] === str2[j - 1]) {
                matrix[j][i] = matrix[j - 1][i - 1];
            } else {
                matrix[j][i] = Math.min(
                    matrix[j - 1][i - 1] + 1, // замена
                    matrix[j][i - 1] + 1,     // вставка
                    matrix[j - 1][i] + 1      // удаление
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
};

/**
 * Очищает строку от лишних символов для сравнения
 * @param str - исходная строка
 * @returns очищенная строка
 */
export const cleanString = (str: string): string => {
    return str.toLowerCase().trim().replace(/[^\w\s]/g, '');
};

/**
 * Разбивает строку на слова
 * @param str - исходная строка
 * @returns массив слов
 */
export const getWords = (str: string): string[] => {
    return cleanString(str).split(/\s+/).filter(word => word.length > 0);
};

/**
 * Вычисляет коэффициент сходства между двумя строками
 * @param str1 - первая строка
 * @param str2 - вторая строка
 * @returns коэффициент сходства от 0 до 1
 */
export const calculateSimilarity = (str1: string, str2: string): number => {
    const cleanStr1 = cleanString(str1);
    const cleanStr2 = cleanString(str2);
    
    // Точное совпадение
    if (cleanStr1 === cleanStr2) return 1.0;
    
    // Проверка на включение одной строки в другую
    if (cleanStr1.includes(cleanStr2) || cleanStr2.includes(cleanStr1)) {
        const longer = cleanStr1.length > cleanStr2.length ? cleanStr1 : cleanStr2;
        const shorter = cleanStr1.length <= cleanStr2.length ? cleanStr1 : cleanStr2;
        return shorter.length / longer.length * 0.9; // Немного меньше 1 для различения от точного совпадения
    }
    
    // Поиск по словам - проверяем совпадение отдельных слов
    const words1 = getWords(str1);
    const words2 = getWords(str2);
    
    if (words1.length > 0 && words2.length > 0) {
        let matchingWords = 0;
        let totalWords = Math.max(words1.length, words2.length);
        
        // Подсчитываем совпадающие слова
        for (const word1 of words1) {
            for (const word2 of words2) {
                if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
                    matchingWords++;
                    break; // Каждое слово считаем только один раз
                }
            }
        }
        
        const wordSimilarity = matchingWords / totalWords;
        
        // Если есть совпадающие слова, используем это как базовую оценку
        if (wordSimilarity > 0) {
            // Комбинируем оценку по словам с расстоянием Левенштейна
            const maxLength = Math.max(cleanStr1.length, cleanStr2.length);
            const distance = levenshteinDistance(cleanStr1, cleanStr2);
            const levenshteinSimilarity = maxLength > 0 ? (maxLength - distance) / maxLength : 1.0;
            
            // Берём максимум из двух оценок, но с небольшим весом для каждой
            return Math.max(wordSimilarity * 0.8, levenshteinSimilarity * 0.7);
        }
    }
    
    // Расстояние Левенштейна как fallback
    const maxLength = Math.max(cleanStr1.length, cleanStr2.length);
    if (maxLength === 0) return 1.0;
    
    const distance = levenshteinDistance(cleanStr1, cleanStr2);
    return (maxLength - distance) / maxLength;
};

/**
 * Находит наиболее подходящий элемент из массива по заданному критерию поиска
 * @param searchTerm - строка для поиска
 * @param items - массив элементов для поиска
 * @param getSearchableText - функция для извлечения текста для поиска из элемента
 * @returns объект с найденным элементом и коэффициентом сходства
 */
export const findBestMatch = <T>(
    searchTerm: string,
    items: T[],
    getSearchableText: (item: T) => string
): { item: T | null, similarity: number } => {
    if (!items.length) return { item: null, similarity: 0 };
    
    let bestMatch: T | null = null;
    let bestSimilarity = 0;
    
    for (const item of items) {
        const itemText = getSearchableText(item);
        const similarity = calculateSimilarity(searchTerm, itemText);
        
        if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestMatch = item;
        }
    }
    
    return { item: bestMatch, similarity: bestSimilarity };
};

/**
 * Константы для пороговых значений сходства
 */
export const SIMILARITY_THRESHOLDS = {
    EXACT: 1.0,
    HIGH: 0.8,
    MEDIUM: 0.6,
    LOW: 0.4,
    MINIMAL: 0.3
} as const;