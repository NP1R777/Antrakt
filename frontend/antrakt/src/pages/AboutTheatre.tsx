import React from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import { Box, Flex, Heading, Text, VStack, Grid, GridItem, Image, Center } from "@chakra-ui/react";

const MotionBox = motion(Box);

const AboutTheatre: React.FC = () => {
    const primaryColor = "#800020";

    return (
        <Box bg="#0a0a0a" minH="100vh" display="flex" flexDirection="column" color="#ffffff">
            <Navigation />
            <Box flex="1" py={20} px={{ base: 4, md: 8 }} position="relative">
                <MotionBox
                    position="absolute"
                    top="-10%"
                    left="-10%"
                    w="500px"
                    h="500px"
                    bg="linear-gradient(135deg, #800020, #400010)"
                    borderRadius="full"
                    filter="blur(100px)"
                    opacity={0.2}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
                />

                <Box maxW="container.xl" mx="auto" position="relative" zIndex="1">
                    <MotionBox
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        mb={12}
                        textAlign="center"
                    >
                        <Heading
                            as="h1"
                            fontSize={{ base: "2xl", md: "4xl" }}
                            color="#ffffff"
                            position="relative"
                            display="inline-block"
                            _after={{
                                content: '""',
                                position: "absolute",
                                bottom: "-10px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "80px",
                                height: "4px",
                                bg: primaryColor,
                                borderRadius: "full"
                            }}
                        >
                            О театре
                        </Heading>
                    </MotionBox>

                    <Grid
                        templateColumns={{ base: "1fr", md: "1fr" }}
                        gap={10}
                        bg="rgba(15, 15, 15, 0.9)"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="rgba(64, 0, 16, 0.5)"
                        p={8}
                        boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                    >
                        <GridItem>
                            <VStack align="center" justify="center" spacing={6}>
                                <Text color="gray.300" lineHeight="tall"
                                    fontSize={20} textAlign="center">
                                    Театр-студия "Антракт" была основана в 2021 году под руководством художественного руководителя Андрея Аидмазоновича Дустимова.
                                </Text>
                            </VStack>
                        </GridItem>

                        <GridItem>
                            <Image
                                src="http://localhost:9000/antrakt-images/%D0%9E%D0%B1%D1%89%D0%B0%D1%8F.jpg"
                                alt="Театр-студия Антракт"
                                w="100%"
                                h="700px"
                                objectFit="cover"
                                borderRadius="lg"
                                border="2px solid"
                                borderColor="#800020"
                                mb={8}
                            />
                        </GridItem>

                        <GridItem>
                            <VStack align="center" spacing={6}>
                                <Heading fontSize={40} textAlign="center" color="#F56565" mb={4}>
                                    Наша миссия
                                </Heading>
                                <Text color="gray.300" lineHeight="tall" textAlign="center" fontSize={20}>
                                    Театр-студия "Антракт" – это творческая площадка, где каждый может раскрыть свой потенциал и стать частью большого театрального сообщества.
                                    Мы верим в силу искусства объединять людей и вдохновлять на создание лучшего будущего.
                                    Наша миссия – создавать качественные спектакли, которые будут затрагивать сердца зрителей и поднимать важные социальные вопросы.
                                    Мы создаем пространство для самовыражения, где каждый может раскрыть свой творческий потенциал.
                                    Творчество норильчан для норильчан: вместе мы создаем театр!
                                </Text>
                            </VStack>
                        </GridItem>
                    </Grid>
                </Box>
            </Box>
            <Footer />
        </Box >
    );
};

export default AboutTheatre;