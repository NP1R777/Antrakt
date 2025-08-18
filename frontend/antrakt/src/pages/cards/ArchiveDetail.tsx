import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box,
    VStack,
    Heading,
    Text,
    Grid,
    GridItem,
    Button,
    Container,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    chakra
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { FaProjectDiagram } from "react-icons/fa";
import { Image as ChakraImage } from "@chakra-ui/react";

const MotionBox = motion(Box);
const MotionImage = motion(ChakraImage);
const CFaProject = chakra(FaProjectDiagram as any);

interface ArchiveProject {
    id: number;
    title: string;
    description?: string;
    image_url: string;
}

const ArchiveDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [project, setProject] = useState<ArchiveProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8000/archive${id}/`);
                setProject(response.data);
            } catch (e) {
                setError("Ошибка загрузки архива");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProject();
    }, [id]);

    if (loading) {
        return (
            <Box bg="#0a0a0a" minH="100vh" display="flex" flexDirection="column">
                <Navigation />
                <Box textAlign="center" py={{ base: 12, md: 20 }} bg="#0a0a0a">
                    Загрузка...
                </Box>
                <Footer />
            </Box>
        );
    }

    if (error) {
        return (
            <Box bg="#0a0a0a" minH="100vh" display="flex" flexDirection="column">
                <Navigation />
                <Box textAlign="center" py={{ base: 12, md: 20 }} bg="#0a0a0a">
                    <Alert status="error" variant="subtle" flexDirection="column" alignItems="center">
                        <AlertIcon boxSize="40px" mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize="md" color="#e0e0e0">Ошибка загрузки</AlertTitle>
                        <AlertDescription maxWidth="sm" color="#a0a0a0" fontSize="sm">{error}</AlertDescription>
                    </Alert>
                </Box>
                <Footer />
            </Box>
        );
    }

    if (!project) {
        return (
            <Box bg="#0a0a0a" minH="100vh" display="flex" flexDirection="column">
                <Navigation />
                <Box textAlign="center" py={{ base: 12, md: 20 }} bg="#0a0a0a">
                    Нет данных
                </Box>
                <Footer />
            </Box>
        );
    }

    return (
        <Box bg="#0a0a0a" display="flex" flexDirection="column" minH="100vh">
            <Navigation />
            <Box flex="1" py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }} position="relative">
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
                        templateColumns={{ base: "1fr", md: "280px 1fr" }}
                        gap={{ base: 4, md: 8 }}
                        bg="linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(64, 0, 16, 0.3))"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="rgba(64, 0, 16, 0.7)"
                        boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                        p={{ base: 4, md: 8 }}
                    >
                        <GridItem>
                            <MotionImage
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                src={project.image_url}
                                alt={project.title}
                                width={{ base: "100%", md: "280px" }}
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
                                <Heading as="h1" size="lg" color="#e0e0e0">{project.title}</Heading>
                                <Box w="full" mt={4}>
                                    <Heading as="h3" size="sm" mb={3} display="flex" alignItems="center" color="#e0e0e0">
                                        <CFaProject mr={2} color="#800020" />
                                        Описание
                                    </Heading>
                                    <Text fontSize="md" color="#a0a0a0" w="full">
                                        {project.description || "Описание отсутствует"}
                                    </Text>
                                </Box>
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