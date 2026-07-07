import { Box, Heading, Text, Button, Flex } from "@chakra-ui/react";
import { motion, useScroll, useTransform } from "framer-motion";

const MotionDiv = motion.div;

export default function Hero() {
    const { scrollY } = useScroll();

    // Параллакс фона
    const backgroundY = useTransform(scrollY, [0, 500], [0, 200]);

    // Исчезновение контента при скролле
    const fadeOut = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <Box h="100vh" position="relative" overflow="hidden" id="hero-section">
            {/* Фоновое изображение с параллаксом */}
            <MotionDiv
                style={{
                    y: backgroundY,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: "url('/images/hero-bg.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "black",
                    filter: "grayscale(100%) contrast(1.05)",
                    zIndex: 0,
                }}
            />

            {/* Затемнение фона: тёмный монохромный градиент */}
            <MotionDiv
                style={{
                    opacity: fadeOut,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.88) 100%)",
                    zIndex: 1,
                }}
            />

            {/* Мягкое белое свечение за заголовком */}
            <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w={{ base: "320px", md: "620px" }}
                h={{ base: "320px", md: "620px" }}
                bg="radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 70%)"
                filter="blur(20px)"
                zIndex={1}
                pointerEvents="none"
            />

            {/* Контент */}
            <Flex
                position="relative"
                direction="column"
                maxW="container.md"
                mx="auto"
                px={{ base: 4, md: 8 }}
                h="full"
                justify="center"
                align="center"
                textAlign="center"
                zIndex={2}
            >
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ opacity: fadeOut }}
                >
                    <Heading
                        as="h1"
                        fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
                        mb={6}
                        textShadow="0 0 10px rgba(255, 255, 255, 0.5)"
                        color="white"
                    >
                        Норильский народный театр
                    </Heading>

                    <Text fontSize={{ base: "md", md: "xl" }} mb={{ base: 6, md: 10 }} color="white">
                        Где каждый находит свою сцену и раскрывает творческий потенциал
                    </Text>
                </MotionDiv>
            </Flex>
        </Box>
    );
}
