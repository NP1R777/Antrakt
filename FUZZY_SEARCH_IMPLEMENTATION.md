# Реализация нечёткого поиска спектаклей

## Описание проблемы

В компоненте `DirectorDetail.tsx` при нажатии на карточку с названием спектакля пользователь переносится на страницу спектакля. Однако названия спектаклей на карточках режиссёров и названия в базе данных могут различаться, что приводило к показу модального окна "Спектакль не найден" даже при наличии похожих спектаклей.

## Решение

Реализован алгоритм нечёткого поиска, который находит наиболее подходящий спектакль по максимальному совпадению названий.

### Основные компоненты

#### 1. Утилитарный файл `stringMatching.ts`

Содержит все алгоритмы для сравнения строк:

- **`levenshteinDistance()`** - вычисляет расстояние редактирования между строками
- **`calculateSimilarity()`** - основная функция для вычисления коэффициента сходства (0-1)
- **`findBestMatch()`** - универсальная функция поиска наиболее подходящего элемента
- **`SIMILARITY_THRESHOLDS`** - константы для пороговых значений

#### 2. Алгоритм сравнения

Функция `calculateSimilarity()` использует многоуровневый подход:

1. **Точное совпадение** - возвращает 1.0
2. **Включение строк** - если одна строка содержится в другой (0.9)
3. **Поиск по словам** - сравнивает отдельные слова в названиях
4. **Расстояние Левенштейна** - как fallback для общего сравнения

#### 3. Пороги сходства

```typescript
export const SIMILARITY_THRESHOLDS = {
    EXACT: 1.0,     // 100% - точное совпадение
    HIGH: 0.8,      // 80% - высокое сходство
    MEDIUM: 0.6,    // 60% - среднее сходство (порог для автоперехода)
    LOW: 0.4,       // 40% - низкое сходство
    MINIMAL: 0.3    // 30% - минимальное сходство (порог для показа предложения)
} as const;
```

### Обновлённая логика в DirectorDetail.tsx

#### Функция поиска

```typescript
const findBestMatchingPerformance = (searchTitle: string) => {
    const { item, similarity } = findBestMatch(searchTitle, performances, (performance) => performance.title);
    return { performance: item, similarity };
};
```

#### Обработка клика

```typescript
const handlePerformanceClick = (performanceTitle: string) => {
    const { performance, similarity } = findBestMatchingPerformance(performanceTitle);
    
    if (performance && similarity >= SIMILARITY_THRESHOLDS.MEDIUM) {
        // Автоматический переход при сходстве >= 60%
        navigate(`/performance/${performance.id}`);
    } else {
        // Показ модального окна с предложением при сходстве < 60%
        setNotFoundPerformance(performanceTitle);
        setSuggestedPerformance(performance);
        setSuggestionSimilarity(similarity);
        onOpen();
    }
};
```

### Улучшенное модальное окно

Теперь модальное окно показывает:
- Информацию о том, что точное совпадение не найдено
- Предложение наиболее похожего спектакля (если сходство > 30%)
- Процент сходства
- Кнопку для перехода к предложенному спектаклю

### Примеры работы алгоритма

| Поиск | Найдено | Сходство | Действие |
|-------|---------|----------|----------|
| "Гамлет" | "Гамлет" | 100% | Автопереход |
| "Гамлед" | "Гамлет" | ~83% | Автопереход |
| "Ромео" | "Ромео и Джульетта" | ~72% | Автопереход |
| "Сон летнюю ночь" | "Сон в летнюю ночь" | ~64% | Автопереход |
| "Чайка" | "Гамлет" | ~20% | Модальное окно без предложения |

### Тестирование

Создан тестовый файл `stringMatching.test.ts` для проверки алгоритма. Для запуска тестов в консоли браузера:

```javascript
testStringMatching();
```

### Преимущества реализации

1. **Гибкость** - алгоритм находит совпадения даже при опечатках и сокращениях
2. **Многоуровневость** - использует несколько методов сравнения для лучшей точности
3. **Настраиваемость** - легко изменить пороги сходства
4. **Переиспользуемость** - утилиты можно использовать в других компонентах
5. **UX** - пользователь видит предложения вместо просто ошибки

### Возможные улучшения

1. **Синонимы** - добавить словарь синонимов для театральных терминов
2. **Кэширование** - сохранять результаты поиска для повышения производительности
3. **Локализация** - учёт особенностей разных языков
4. **Машинное обучение** - использование ML для улучшения качества поиска

### Использование в других компонентах

Утилиты из `stringMatching.ts` можно использовать в любых других компонентах для поиска:

```typescript
import { findBestMatch, SIMILARITY_THRESHOLDS } from '../utils/stringMatching';

// Поиск актёра
const findActor = (searchName: string, actors: Actor[]) => {
    return findBestMatch(searchName, actors, (actor) => actor.name);
};

// Поиск новости
const findNews = (searchTitle: string, news: NewsItem[]) => {
    return findBestMatch(searchTitle, news, (item) => item.title);
};
```