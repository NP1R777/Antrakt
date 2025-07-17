import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box,
    VStack,
    Heading,
    Text,
    Image,
    Grid,
    GridItem,
    Flex,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button,
    chakra
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { FaTheaterMasks } from "react-icons/fa";

const CFaTheaterMasks = chakra(FaTheaterMasks as any);

const MotionBox = motion(Box);

interface Performance {
    id: number;
    title: string;
    genre: string;
    age_limit: string;
    the_cast: string[] | null;
    description: string;
    afisha: boolean;
    image_url: string;
    ticket_url?: string; // Added field for ticket purchase link
}

const AfishaDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [performance, setPerformance] = useState<Performance | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8000/perfomance${id}`);
                setPerformance({
                    id: response.data.id,
                    title: response.data.title,
                    genre: response.data.genre,
                    age_limit: response.data.age_limit,
                    the_cast: response.data.the_cast || [],
                    description: response.data.description,
                    afisha: response.data.afisha,
                    image_url: response.data.image_url,
                    ticket_url: response.data.ticket_url
                });
            } catch (err) {
                setError("Ошибка загрузки данных спектакля");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPerformance();
        }
    }, [id]);

    if (loading) {
        return (
            <Box>
                <Navigation />
                <Flex justify="center" align="center" minH="70vh" bg="black">
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
                <Box textAlign="center" py={20} bg="black">
                    <Alert status="error" variant="subtle" flexDirection="column" alignItems="center">
                        <AlertIcon boxSize="40px" mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize="md" color="white">
                            Ошибка загрузки
                        </AlertTitle>
                        <AlertDescription maxWidth="sm" color="gray.400" fontSize="sm">
                            {error}
                        </AlertDescription>
                    </Alert>
                </Box>
                <Footer />
            </Box>
        );
    }

    if (!performance) {
        return (
            <Box>
                <Navigation />
                <Box textAlign="center" py={20} bg="black">
                    <Heading size="md" mb={4} color="white">Спектакль не найден</Heading>
                    <Button
                        variant="outline"
                        color="#FC8181"
                        _hover={{ color: "#FEB2B2", borderColor: "#FEB2B2" }}
                        size="sm"
                        fontSize="sm"
                        onClick={() => navigate("/afisha")}
                    >
                        Вернуться к афише
                    </Button>
                </Box>
                <Footer />
            </Box>
        );
    }

    return (
        <Box bg="black" display="flex" flexDirection="column" minH="100vh">
            <Navigation />
            <Box flex="1" py={20} px={{ base: 4, md: 8 }} bg="black" position="relative">
                <MotionBox
                    position="absolute"
                    bottom="-20%"
                    left="-10%"
                    w="500px"
                    h="500px"
                    bg="#800020"
                    borderRadius="full"
                    filter="blur(80px)"
                    opacity={0.15}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
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
                        templateColumns={{ base: "1fr", md: "300px 1fr" }}
                        gap={8}
                        bg="linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(64, 0, 16, 0.3))"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="rgba(64, 0, 16, 0.7)"
                        boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                        p={8}
                    >
                        <GridItem>
                            <Image
                                src={performance.image_url}
                                alt={performance.title}
                                width="300px"
                                height="auto"
                                objectFit="contain"
                                border="4px solid"
                                borderColor="#F56565"
                                borderRadius="md"
                                boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                            />
                        </GridItem>

                        <GridItem>
                            <VStack align="start" spacing={6} w="full">
                                <Heading as="h1" size="lg" color="white">
                                    {performance.title}
                                </Heading>

                                <Text color="whiteAlpha.800" fontSize="sm">
                                    Спектакль
                                </Text>

                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} w="full">
                                    <VStack align="start">
                                        <Heading as="h3" size="sm" display="flex" alignItems="center" color="white">
                                            <CFaTheaterMasks mr={2} color="#F56565" />
                                            Основная информация
                                        </Heading>
                                        <Text fontSize="md" color="gray.400">
                                            <b>Жанр:</b> {performance.genre}
                                        </Text>
                                        <Text fontSize="md" color="gray.400">
                                            <b>Возрастное ограничение:</b> {performance.age_limit}
                                        </Text>
                                        {performance.the_cast?.length > 0 && (
                                            <Text fontSize="md" color="gray.400">
                                                <b>Актёрский состав:</b> {performance.the_cast.join(", ")}
                                            </Text>
                                        )}
                                    </VStack>

                                    <VStack align="start">
                                        {performance.ticket_url && (
                                            <Button
                                                variant="solid"
                                                colorScheme="red"
                                                size="md"
                                                mt={-100}
                                                onClick={() => window.location.href = performance.ticket_url!}
                                            >
                                                Купить билет!
                                            </Button>
                                        )}
                                        <Box w="full" mt={4}>
                                            <Heading as="h3" size="sm" mb={3} display="flex" alignItems="center" color="white">
                                                <CFaTheaterMasks mr={2} color="#F56565" />
                                                Описание
                                            </Heading>
                                            <Text fontSize="md" color="gray.400" w="full">
                                                {performance.description}
                                            </Text>
                                        </Box>
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

export default AfishaDetail;