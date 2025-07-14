import React, { useState, useEffect } from "react";
import { Box, Flex, Heading, Text, Grid, GridItem, Spinner, Button, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import axios from "axios";

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);

interface Achievement {
    id: number;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    achievement: string;
    image_url: string;
}

const AchievementsPage: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8000/achievements/");
                setAchievements(response.data);
            } catch (err) {
                setError("Ошибка загрузки достижений");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    if (loading) {
        return (
            <Box>
                <Navigation />
                <Flex justify="center" align="center" minH="70vh" bg="#0a0a0a">
                    <Spinner size="xl" color="#F56565" />
                </Flex>
                <Footer />
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Navigation />
                <Box textAlign="center" py={20} bg="#0a0a0a">
                    <Text color="#ffffff">Ошибка: {error}</Text>
                </Box>
                <Footer />
            </Box>
        );
    }

    return (
        <Box bg="#0a0a0a" minH="100vh" display="flex" flexDirection="column" color="#ffffff">
            <Navigation />
            <Box flex="1" py={20} px={{ base: 4, md: 8 }} position="relative">
                <MotionBox
                    position="absolute"
                    top="-15%"
                    left="-15%"
                    w="600px"
                    h="600px"
                    bg="linear-gradient(135deg, #800020, #400010)"
                    borderRadius="full"
                    filter="blur(100px)"
                    opacity={0.2}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                />

                <Box maxW="container.xl" mx="auto" position="relative" zIndex="1">
                    <MotionBox
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        mb={12}
                        textAlign="center"
                    >
                        <Heading
                            as="h1"
                            fontSize={{ base: "2xl", md: "4xl" }}
                            color="#ffffff"
                            position="relative"
                            _after={{
                                content: '""',
                                position: "absolute",
                                bottom: "-10px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "80px",
                                height: "4px",
                                bg: "#800020",
                                borderRadius: "full"
                            }}
                        >
                            Наши достижения
                        </Heading>
                        <Text fontSize="lg" color="#a0a0a0" mt={4} maxW="lg" mx="auto">
                            История успеха и признания театральной студии "Антракт"
                        </Text>
                    </MotionBox>

                    {achievements.length > 0 ? (
                        <MotionGrid
                            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                            gap={8}
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.3 }
                                }
                            }}
                        >
                            {achievements.map((achievement) => (
                                <MotionGridItem
                                    key={achievement.id}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.9 },
                                        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
                                    }}
                                >
                                    <MotionBox
                                        as="div"
                                        bg="linear-gradient(45deg, #1a1a1a, #0a0a0a)"
                                        borderRadius="2xl"
                                        overflow="hidden"
                                        border="2px solid"
                                        borderColor="#D4A017"
                                        boxShadow="0 10px 30px rgba(0, 0, 0, 0.5)"
                                        whileHover={{
                                            scale: 1.05,
                                            boxShadow: "0 15px 40px rgba(212, 160, 23, 0.5)",
                                            borderColor: "#FFC107",
                                            transition: { duration: 0.5, ease: "easeOut" }
                                        }}
                                        p={6}
                                        h="100%"
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="space-between"
                                    >
                                        <Box>
                                            <Image
                                                src={achievement.image_url}
                                                alt={achievement.achievement}
                                                w="100%"
                                                h="200px"
                                                objectFit="cover"
                                                borderRadius="lg"
                                                mb={4}
                                                fallbackSrc="/placeholder-image.jpg"
                                            />
                                            <Text
                                                fontSize="md"
                                                color="#a0a0a0"
                                                mb={6}
                                                h="100px"
                                                overflow="hidden"
                                                textOverflow="ellipsis"
                                                display="-webkit-box"
                                                css={{
                                                    WebkitLineClamp: 4,
                                                    WebkitBoxOrient: "vertical"
                                                }}
                                            >
                                                {achievement.achievement}
                                            </Text>
                                        </Box>
                                        <Button
                                            variant="outline"
                                            color="#D4A017"
                                            borderColor="#D4A017"
                                            _hover={{
                                                bg: "#D4A017",
                                                color: "#ffffff",
                                                transform: "translateY(-2px)"
                                            }}
                                            transition="all 0.3s"
                                            onClick={() => navigate(`/achievement/${achievement.id}`)}
                                        >
                                            Подробнее
                                        </Button>
                                    </MotionBox>
                                </MotionGridItem>
                            ))}
                        </MotionGrid>
                    ) : (
                        <Text color="#a0a0a0" textAlign="center">
                            Пока нет достижений для отображения
                        </Text>
                    )}
                </Box>
            </Box>
            <Footer />
        </Box>
    );
};

export default AchievementsPage;