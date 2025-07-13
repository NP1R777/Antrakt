export function getDeclension(count: number, forms: [string, string, string]): string {
    const n = Math.abs(count) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
}

export const yearDeclension = (count: number) => getDeclension(count, ["год", "года", "лет"]);
export const performanceDeclension = (count: number) => getDeclension(count, ["спектакль", "спектакля", "спектаклей"]);