import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Container,
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
    VStack,
    chakra
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { FaTheaterMasks } from "react-icons/fa";

// Стилизованный компонент для иконки
const CFaTheaterMasks = chakra(FaTheaterMasks as any);

const MotionBox = motion(Box);
const MotionImage = motion(Image);

interface ArchiveProject {
    id: number;
    title: string;
    description: string;
    age_limit: string | null;
    premiere_date: string | null;
    afisha: boolean;
    image_url: string;
}

const ArchiveDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<ArchiveProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const primaryColor = "#800020";
    const darkBg = "#0a0a0a";
    const lightText = "#ffffff";
    const grayText = "#a0a0a0";

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await axios.get(`http://localhost:8000/archive${id}/`);
                setProject({
                    ...response.data,
                    description: response.data.description || "Описание отсутствует",
                    image_url: response.data.image_url || "/placeholder-image.jpg",
                    age_limit: response.data.age_limit || "Не указано",
                    premiere_date: response.data.premiere_date || null,
                    afisha: response.data.afisha || false
                });
            } catch (err) {
                setError("Ошибка загрузки данных проекта");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id]);

    if (loading) {
        return (
            <Box bg={darkBg} minH="100vh" display="flex" flexDirection="column">
                <Navigation />
                <Flex justify="center" align="center" minH="70vh" bg={darkBg}>
                    <Spinner size="xl" color={primaryColor} thickness="4px" />
                </Flex>
                <Footer />
            </Box>
        );
    }

    if (error || !project) {
        return (
            <Box bg={darkBg} minH="100vh" display="flex" flexDirection="column">
                <Navigation />
                <Box textAlign="center" py={20} bg={darkBg}>
                    <Alert status="error" variant="subtle" flexDirection="column" alignItems="center">
                        <AlertIcon boxSize="40px" mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize="md" color={lightText}>
                            Ошибка загрузки
                        </AlertTitle>
                        <AlertDescription maxWidth="sm" color={grayText} fontSize="sm">
                            {error || "Проект не найден"}
                        </AlertDescription>
                    </Alert>
                </Box>
                <Footer />
            </Box>
        );
    }

    return (
        <Box bg={darkBg} display="flex" flexDirection="column" minH="100vh">
            <Navigation />
            <Box flex="1" py={20} px={{ base: 4, md: 8 }} position="relative">
                <MotionBox
                    position="absolute"
                    bottom="-20%"
                    left="-10%"
                    w="500px"
                    h="500px"
                    bg={primaryColor}
                    borderRadius="full"
                    filter="blur(80px)"
                    opacity={0.15}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
                />

                <Container maxW="container.xl" position="relative" zIndex="1">
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
                            <MotionImage
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                src={project.image_url}
                                alt={project.title}
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
                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Heading as="h1" size="lg" color={lightText}>
                                        {project.title}
                                    </Heading>
                                </MotionBox>

                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <Text color="whiteAlpha.800" fontSize="sm">
                                        Архивный проект
                                    </Text>
                                </MotionBox>

                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <VStack align="start" spacing={2}>
                                        <Heading as="h3" size="sm" display="flex" alignItems="center" color={lightText}>
                                            <CFaTheaterMasks mr={2} color="#F56565" />
                                            Основная информация
                                        </Heading>
                                        <Text fontSize="md" color={grayText}>
                                            <b>Возрастное ограничение:</b> {project.age_limit || "Не указано"}
                                        </Text>
                                        <Text fontSize="md" color={grayText}>
                                            <b>Дата премьеры:</b> {project.premiere_date ? new Date(project.premiere_date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : "Не указана"}
                                        </Text>
                                    </VStack>
                                </MotionBox>

                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    w="full"
                                >
                                    <Heading as="h3" size="sm" mb={3} display="flex" alignItems="center" color={lightText}>
                                        <CFaTheaterMasks mr={2} color="#F56565" />
                                        Описание
                                    </Heading>
                                    <Text fontSize="md" color={grayText} w="full">
                                        {project.description}
                                    </Text>
                                </MotionBox>
                            </VStack>
                        </GridItem>
                    </Grid>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default ArchiveDetail;