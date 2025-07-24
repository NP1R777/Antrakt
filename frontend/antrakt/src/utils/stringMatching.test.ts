import { calculateSimilarity, findBestMatch, SIMILARITY_THRESHOLDS } from './stringMatching';

// Тестовые данные для проверки алгоритма
const testPerformances = [
    { id: 1, title: 'Гамлет' },
    { id: 2, title: 'Ромео и Джульетта' },
    { id: 3, title: 'Король Лир' },
    { id: 4, title: 'Макбет' },
    { id: 5, title: 'Сон в летнюю ночь' },
    { id: 6, title: 'Отелло' },
    { id: 7, title: 'Буря' },
];

// Функция для тестирования
const testStringMatching = () => {
    console.log('=== Тестирование алгоритма поиска спектаклей ===\n');

    // Тест 1: Точное совпадение
    console.log('Тест 1: Точное совпадение');
    const exact = findBestMatch('Гамлет', testPerformances, (p) => p.title);
    console.log(`Поиск: "Гамлет" -> "${exact.item?.title}" (${(exact.similarity * 100).toFixed(1)}%)`);
    console.log(`Пройдёт порог: ${exact.similarity >= SIMILARITY_THRESHOLDS.MEDIUM ? 'ДА' : 'НЕТ'}\n`);

    // Тест 2: Небольшая опечатка
    console.log('Тест 2: Небольшая опечатка');
    const typo = findBestMatch('Гамлед', testPerformances, (p) => p.title);
    console.log(`Поиск: "Гамлед" -> "${typo.item?.title}" (${(typo.similarity * 100).toFixed(1)}%)`);
    console.log(`Пройдёт порог: ${typo.similarity >= SIMILARITY_THRESHOLDS.MEDIUM ? 'ДА' : 'НЕТ'}\n`);

    // Тест 3: Частичное совпадение
    console.log('Тест 3: Частичное совпадение');
    const partial = findBestMatch('Ромео', testPerformances, (p) => p.title);
    console.log(`Поиск: "Ромео" -> "${partial.item?.title}" (${(partial.similarity * 100).toFixed(1)}%)`);
    console.log(`Пройдёт порог: ${partial.similarity >= SIMILARITY_THRESHOLDS.MEDIUM ? 'ДА' : 'НЕТ'}\n`);

    // Тест 4: Альтернативное написание
    console.log('Тест 4: Альтернативное написание');
    const alternative = findBestMatch('Король Лир', testPerformances, (p) => p.title);
    console.log(`Поиск: "Король Лир" -> "${alternative.item?.title}" (${(alternative.similarity * 100).toFixed(1)}%)`);
    console.log(`Пройдёт порог: ${alternative.similarity >= SIMILARITY_THRESHOLDS.MEDIUM ? 'ДА' : 'НЕТ'}\n`);

    // Тест 5: Сокращённое название
    console.log('Тест 5: Сокращённое название');
    const shortened = findBestMatch('Сон летнюю ночь', testPerformances, (p) => p.title);
    console.log(`Поиск: "Сон летнюю ночь" -> "${shortened.item?.title}" (${(shortened.similarity * 100).toFixed(1)}%)`);
    console.log(`Пройдёт порог: ${shortened.similarity >= SIMILARITY_THRESHOLDS.MEDIUM ? 'ДА' : 'НЕТ'}\n`);

    // Тест 6: Полностью другое название
    console.log('Тест 6: Полностью другое название');
    const different = findBestMatch('Чайка', testPerformances, (p) => p.title);
    console.log(`Поиск: "Чайка" -> "${different.item?.title}" (${(different.similarity * 100).toFixed(1)}%)`);
    console.log(`Пройдёт порог: ${different.similarity >= SIMILARITY_THRESHOLDS.MEDIUM ? 'ДА' : 'НЕТ'}\n`);

    // Тест прямого сравнения строк
    console.log('=== Тест прямого сравнения строк ===');
    const testCases = [
        ['Гамлет', 'Гамлет'],
        ['Гамлет', 'Гамлед'],
        ['Ромео и Джульетта', 'Ромео'],
        ['Король Лир', 'Король Лир'],
        ['Сон в летнюю ночь', 'Сон летнюю ночь'],
        ['Отелло', 'Чайка']
    ];

    testCases.forEach(([str1, str2]) => {
        const similarity = calculateSimilarity(str1, str2);
        console.log(`"${str1}" vs "${str2}": ${(similarity * 100).toFixed(1)}%`);
    });
};

// Экспортируем функцию для возможности вызова из консоли браузера
(window as any).testStringMatching = testStringMatching;

export { testStringMatching };