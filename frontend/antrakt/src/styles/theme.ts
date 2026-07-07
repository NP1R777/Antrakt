import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    breakpoints: {
        xs: "20em",   // 320px — узкие устройства
        sm: "30em",   // 480px
        md: "48em",   // 768px (планшеты портрет)
        lg: "62em",   // 992px
        xl: "80em",   // 1280px
        "2xl": "96em" // 1536px
    },
    colors: {
        // Монохромная палитра ННТ: чёрный, белый и оттенки серого
        brand: {
            50: "#ffffff",
            100: "#f2f2f2",
            200: "#d9d9d9",
            300: "#bfbfbf",
            400: "#8a8a8a",
            500: "#f2f2f2", // Основной акцент — платиновый (белый)
            600: "#c9c9c9",
            700: "#e0e0e0", // Осветление для hover на тёмном фоне
            800: "#2a2a2a",
            900: "#141414",
        },
        accent: "#ffffff",
    },
    fonts: {
        heading: "'Playfair Display', serif", // Классический для театра
        body: "'Raleway', sans-serif",
    },
    styles: {
        global: {
            "html": {
                scrollBehavior: "smooth",
            },
            "body": {
                bg: "#0a0a0a",
                color: "#e0e0e0",
            },
            // Выделение текста в стиле логотипа
            "::selection": {
                background: "rgba(255, 255, 255, 0.85)",
                color: "#0a0a0a",
            },
            // Элегантный монохромный скроллбар
            "::-webkit-scrollbar": {
                width: "10px",
                height: "10px",
            },
            "::-webkit-scrollbar-track": {
                background: "#0a0a0a",
            },
            "::-webkit-scrollbar-thumb": {
                background: "#3a3a3a",
                borderRadius: "9999px",
                border: "2px solid #0a0a0a",
            },
            "::-webkit-scrollbar-thumb:hover": {
                background: "#5a5a5a",
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "wider",
                transition: "all 0.25s ease",
            },
            variants: {
                // Основная кнопка: белая на чёрном с мягким свечением
                "theater": {
                    bg: "#f2f2f2",
                    color: "#0a0a0a",
                    _hover: {
                        bg: "#ffffff",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 28px rgba(255, 255, 255, 0.22)",
                        _disabled: { transform: "none", boxShadow: "none" },
                    },
                    _active: { bg: "#e0e0e0", transform: "translateY(0)" },
                },
                // Контурная кнопка в монохромном стиле
                "outlineLight": {
                    bg: "transparent",
                    color: "#f2f2f2",
                    border: "1px solid",
                    borderColor: "rgba(255, 255, 255, 0.6)",
                    _hover: {
                        bg: "rgba(255, 255, 255, 0.08)",
                        borderColor: "#ffffff",
                        boxShadow: "0 0 18px rgba(255, 255, 255, 0.18)",
                    },
                },
            },
        },
    },
});

export default theme;
