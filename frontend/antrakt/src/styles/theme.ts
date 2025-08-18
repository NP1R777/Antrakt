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
        brand: {
            100: "#F9F1F1",
            500: "#800020", // Основной бордовый
            700: "#5A0017", // Темный бордовый
        },
        accent: "#FF0000", // Красный акцент
    },
    fonts: {
        heading: "'Playfair Display', serif", // Классический для театра
        body: "'Raleway', sans-serif",
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "wider",
            },
            variants: {
                "theater": {
                    bg: "brand.500",
                    _hover: { bg: "brand.700", transform: "scale(1.05)" },
                    _active: { bg: "brand.700" },
                },
            },
        },
    },
});

export default theme;