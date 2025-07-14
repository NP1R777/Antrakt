import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Flex,
    Heading,
    Text,
    Image,
    Grid,
    GridItem,
    Button,
    chakra,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    VStack
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { FaTrophy, FaCalendarAlt } from "react-icons/fa";

const MotionBox = motion(Box);
const CFaTrophy = chakra(FaTrophy as any);
const CFaCalendarAlt = chakra(FaCalendarAlt as any);

interface Achievement {
    id: number;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    achievement: string;
    image_url: string;
}

const AchievementDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [achievement, setAchievement] = useState<Achievement | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAchievement = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8000/achievement${id}/`);
                setAchievement(response.data);
            } catch (err) {
                setError("Ошибка загрузки достижения");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAchievement();
        }
    }, [id]);

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="100vh" bg="black">
                <Spinner size="xl" color="#F56565" />
            </Flex>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" py={20} bg="black">
                <Alert status="error" variant="subtle" flexDirection="column" alignItems="center">
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="md" color="white">
                        Ошибка загрузки
                    </AlertTitle>
                    <AlertDescription maxWidth="sm" color="gray.400" fontSize="sm">
                        {error}
                    </AlertDescription>
                    <Button mt={4} colorScheme="red" size="sm" onClick={() => window.location.reload()}>
                        Повторить попытку
                    </Button>
                </Alert>
            </Box>
        );
    }

    if (!achievement) {
        return (
            <Box textAlign="center" py={20} bg="black">
                <Heading size="md" mb={4} color="white">Достижение не найдено</Heading>
                <Button
                    variant="outline"
                    color="#FC8181"
                    _hover={{ color: "#FEB2B2", borderColor: "#FEB2B2" }}
                    size="sm"
                    fontSize="sm"
                    onClick={() => navigate("/achievements")}
                >
                    Вернуться к достижениям
                </Button>
            </Box>
        );
    }

    return (
        <Box bg="black" display="flex" flexDirection="column" minH="100vh">
            <Navigation />
            <Box flex="1" py={20} px={{ base: 4, md: 8 }} bg="black" position="relative">
                <MotionBox
                    position="absolute"
                    top="-15%"
                    right="-10%"
                    w="400px"
                    h="400px"
                    bg="linear-gradient(135deg, #800020, #400010)"
                    borderRadius="full"
                    filter="blur(80px)"
                    opacity={0.2}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                />

                <Box maxW="container.xl" mx="auto" position="relative" zIndex="1">
                    <Button
                        leftIcon={<ChevronLeftIcon />}
                        mb={6}
                        variant="outline"
                        color="#FC8181"
                        _hover={{ color: "#FEB2B2", borderColor: "#FEB2B2" }}
                        size="sm"
                        fontSize="sm"
                        onClick={() => navigate(-1)}
                    >
                        Назад
                    </Button>

                    <Grid
                        templateColumns={{ base: "1fr", lg: "1fr 2fr" }}
                        gap={10}
                        bg="rgba(20, 20, 20, 0.9)"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="rgba(64, 0, 16, 0.7)"
                        boxShadow="0 8px 25px rgba(0, 0, 0, 0.6)"
                        p={6}
                    >
                        <GridItem>
                            <Image
                                src={achievement.image_url}
                                alt="Achievement Image"
                                w="100%"
                                h="auto"
                                maxH="400px"
                                objectFit="contain"
                                border="4px solid"
                                borderColor="#800020"
                                borderRadius="lg"
                                boxShadow="0 8px 20px rgba(0, 0, 0, 0.5)"
                            />
                        </GridItem>

                        <GridItem>
                            <VStack align="start" spacing={8}>
                                <Heading as="h1" size="xl" color="white" textTransform="uppercase">
                                    Достижение
                                </Heading>

                                <Box w="full">
                                    <Heading as="h3" size="md" mb={4} display="flex" alignItems="center" color="white">
                                        <CFaTrophy mr={2} color="#F56565" />
                                        Описание
                                    </Heading>
                                    <Text fontSize="lg" color="gray.300" lineHeight="tall">
                                        {achievement.achievement}
                                    </Text>
                                </Box>

                                <Grid templateColumns="repeat(2, 1fr)" gap={6} w="full">
                                    <VStack align="start">
                                        <Heading as="h3" size="sm" display="flex" alignItems="center" color="white">
                                            <CFaCalendarAlt mr={2} color="#F56565" />
                                            История
                                        </Heading>
                                        {achievement.created_at && (
                                            <Text fontSize="md" color="gray.400">
                                                <b>Дата создания:</b> {new Date(achievement.created_at).toLocaleDateString()}
                                            </Text>
                                        )}
                                        {achievement.updated_at && (
                                            <Text fontSize="md" color="gray.400">
                                                <b>Последнее обновление:</b> {new Date(achievement.updated_at).toLocaleDateString()}
                                            </Text>
                                        )}
                                        {achievement.deleted_at && (
                                            <Text fontSize="md" color="gray.400">
                                                <b>Удалено:</b> {new Date(achievement.deleted_at).toLocaleDateString()}
                                            </Text>
                                        )}
                                    </VStack>
                                </Grid>
                            </VStack>
                        </GridItem>
                    </Grid>
                </Box>
            </Box>
            <Footer />
        </Box>
    );
};

export default AchievementDetail;