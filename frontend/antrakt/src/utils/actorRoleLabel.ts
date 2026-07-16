/**
 * Russian actor role label inferred from the surname (the first name token).
 *
 * Looking at the full display name is incorrect: male names such as «Илья»
 * end in «я», while female names such as «Зайнап» do not. In this project
 * names are stored as «Фамилия Имя», so the surname is the useful signal.
 */
export const getActorRoleLabel = (fullName: string): "Актёр" | "Актриса" => {
    const surname = fullName.trim().split(/\s+/)[0] || "";
    return /(?:ова|ева|ёва|ина|ына|ская|цкая|ая)$/i.test(surname)
        ? "Актриса"
        : "Актёр";
};
