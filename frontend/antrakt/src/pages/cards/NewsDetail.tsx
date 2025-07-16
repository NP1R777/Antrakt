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
    Button,
    chakra,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { FaNewspaper, FaCalendarAlt } from "react-icons/fa";

const MotionBox = motion(Box);
const CFaNewspaper = chakra(FaNewspaper as any);
const CFaCalendarAlt = chakra(FaCalendarAlt as any);

interface News {
    id: number;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    title: string;
    description: string;
    summary: string;
    is_published: boolean;
    image_url: string;
}

const NewsDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [news, setNews] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8000/news${id}/`);
                setNews(response.data);
            } catch (err) {
                setError("Ошибка загрузки новости");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNews();
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
                        <AlertTitle mt={4} mb={1} fontSize="md" color="#e0e0e0">
                            Ошибка загрузки
                        </AlertTitle>
                        <AlertDescription maxWidth="sm" color="#a0a0a0" fontSize="sm">
                            {error}
                        </AlertDescription>
                    </Alert>
                </Box>
                <Footer />
            </Box>
        );
    }

    if (!news) {
        return (
            <Box>
                <Navigation />
                <Box textAlign="center" py={20} bg="black">
                    <Heading size="md" mb={4} color="#e0e0e0">Новость не найдена</Heading>
                    <Button
                        variant="outline"
                        color="#FC8181"
                        _hover={{ color: "#FEB2B2", borderColor: "#FEB2B2" }}
                        size="sm"
                        fontSize="sm"
                        onClick={() => navigate("/news")}
                    >
                        Вернуться к новостям
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
                    top="-15%"
                    right="-10%"
                    w="400px"
                    h="400px"
                    bg="linear-gradient(135deg, #D4A017, #80002010)"
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
                        templateColumns={{ base: "1fr", md: "300px 1fr" }}
                        gap={8}
                        bg="linear-gradient(135deg, rgba(25, 25, 25, 0.9), rgba(64, 64, 64, 0.3))"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="rgba(64, 64, 64, 0.7)"
                        boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                        p={8}
                    >
                        <GridItem>
                            <Image
                                src={news.image_url}
                                alt={news.title}
                                width="300px"
                                height="auto"
                                objectFit="contain"
                                border="4px solid"
                                borderColor="#800020"
                                borderRadius="md"
                                boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                            />
                        </GridItem>

                        <GridItem>
                            <VStack align="start" spacing={6} w="full">
                                <Heading as="h1" size="lg" color="#e0e0e0">
                                    {news.title}
                                </Heading>

                                <Text color="#a0a0a0" fontSize="sm">
                                    Новость
                                </Text>

                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} w="full">
                                    <VStack align="start">
                                        <Heading as="h3" size="sm" display="flex" alignItems="center" color="#e0e0e0">
                                            <CFaCalendarAlt mr={2} color="#800020" />
                                            История
                                        </Heading>
                                        {news.created_at && (
                                            <Text fontSize="md" color="#e0e0e0">
                                                <b>Дата создания:</b> {new Date(news.created_at).toLocaleDateString()}
                                            </Text>
                                        )}
                                        {news.updated_at && (
                                            <Text fontSize="md" color="#e0e0e0">
                                                <b>Последнее обновление:</b> {new Date(news.updated_at).toLocaleDateString()}
                                            </Text>
                                        )}
                                        {news.deleted_at && (
                                            <Text fontSize="md" color="#e0e0e0">
                                                <b>Удалено:</b> {new Date(news.deleted_at).toLocaleDateString()}
                                            </Text>
                                        )}
                                    </VStack>
                                </Grid>

                                <Box w="full" mt={4}>
                                    <Heading as="h3" size="sm" mb={3} display="flex" alignItems="center" color="#e0e0e0">
                                        <CFaNewspaper mr={2} color="#800020" />
                                        Описание
                                    </Heading>
                                    <Text fontSize="md" color="#a0a0a0" w="full">
                                        {news.description}
                                    </Text>
                                </Box>
                            </VStack>
                        </GridItem>
                    </Grid>
                </Box>
            </Box>
            <Footer />
        </Box>
    );
};

export default NewsDetail;