export type ActorGender = "male" | "female";
export type ActorRoleLabel = "Актёр" | "Актриса";

const maleGivenNames = new Set([
    "илья", "никита", "лука", "кузьма", "фома", "савва", "данила",
]);

const femaleGivenNames = new Set([
    "зайнап", "гузель", "гузел", "любовь", "нинэль", "нинель",
    "рашель", "эсфирь", "юдифь",
]);

const tokenize = (fullName: string): string[] =>
    fullName.toLocaleLowerCase("ru-RU").match(/[a-zа-яё-]+/gi) || [];

export const inferActorGender = (fullName: string): ActorGender => {
    const tokens = tokenize(fullName);
    if (tokens.some((token) => maleGivenNames.has(token))) return "male";
    if (tokens.some((token) => femaleGivenNames.has(token))) return "female";

    if (tokens.some((token) => /(?:ова|ёва|ева|ина|ына|ская|цкая|ая)$/i.test(token))) {
        return "female";
    }
    if (tokens.some((token) => /(?:ов|ёв|ев|ин|ын|ский|цкий|ой|ый|ий)$/i.test(token))) {
        return "male";
    }
    if (tokens.some((token) => /[ая]$/i.test(token))) return "female";
    return "male";
};

export const getActorRoleLabel = (
    fullName: string,
    genderOverride?: ActorGender | null,
): ActorRoleLabel =>
    (genderOverride || inferActorGender(fullName)) === "female"
        ? "Актриса"
        : "Актёр";
