import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Flex, Box } from "@chakra-ui/react";

const MotionBox = motion(Box);

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <MotionBox
            as="header"
            position="fixed"
            w="100%"
            zIndex="1000"
            animate={{
                background: scrolled ? "rgba(0, 0, 0, 0.9)" : "transparent",
                padding: scrolled ? 2 : 8,
            }}
            transition={{ duration: 0.3 }}
        >
            <Flex
                maxW="container.xl"
                mx="auto"
                align="center"
                justify="space-between"
                px={8}
            >
                {/* Навигация будет добавлена позже */}
            </Flex>
        </MotionBox>
    );
}