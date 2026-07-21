/**
 * Перед отправкой в API: пустые строки в опциональных полях → null.
 * Иначе DRF DateField/TimeField отклоняют '' («Date has wrong format»),
 * а unique CharField (phone_number) ломается на повторном ''.
 */
export function emptyStringsToNull<T extends Record<string, unknown>>(
    data: T,
    fields: (keyof T)[],
): T {
    const next = { ...data };
    for (const field of fields) {
        if (next[field] === '') {
            (next as Record<string, unknown>)[field as string] = null;
        }
    }
    return next;
}
