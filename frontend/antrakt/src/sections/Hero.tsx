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
                    height: "120%",
                    backgroundImage: "url('/images/stage-bg.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    zIndex: 0,
                }}
            />

            {/* Затемнение фона */}
            <MotionDiv
                style={{
                    opacity: fadeOut,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0.6)",
                    zIndex: 1,
                }}
            />

            {/* Контент */}
            <Flex
                position="relative"
                direction="column"
                maxW="container.md"
                mx="auto"
                px={8}
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
                        fontSize={{ base: "4xl", md: "6xl" }}
                        mb={6}
                        textShadow="0 0 10px rgba(128, 0, 32, 0.8)"
                        color="white"
                    >
                        Театральная студия "Антракт"
                    </Heading>

                    <Text fontSize="xl" mb={10} color="white">
                        Где каждый находит свою сцену и раскрывает творческий потенциал
                    </Text>

                    <Button
                        variant="theater"
                        size="lg"
                        maxW="350px"
                        mx="auto"
                        _hover={{
                            boxShadow: "0 0 15px rgba(255, 0, 0, 0.5)",
                        }}
                    >
                        Записаться на пробный урок
                    </Button>
                </MotionDiv>
            </Flex>
        </Box>
    );
}
