import React, { useEffect, useState, useRef } from "react";
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
    Flex,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    useDisclosure,
    chakra
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import ReviewsSection from "../../components/ReviewsSection";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaProjectDiagram, FaExpand } from "react-icons/fa";
import { Image as ChakraImage } from "@chakra-ui/react";
import { API_URL } from '../../config';

const MotionBox = motion(Box);
const MotionImage = motion(ChakraImage);
const CFaProject = chakra(FaProjectDiagram as any);
const CFaExpand = chakra(FaExpand as any);

interface ArchiveProject {
    id: number;
    title: string;
    description?: string;
    image_url: string;
    images_list?: string[] | null;
    afisha: boolean;
}

const ArchiveDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [project, setProject] = useState<ArchiveProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/archive${id}/`);
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

    const gallery = project?.images_list?.filter(Boolean) || [];

    useEffect(() => {
        if (gallery.length <= 1) return;
        intervalRef.current = setInterval(() => {
            setDirection(1);
            setGalleryIndex(prev => (prev + 1) % gallery.length);
        }, 5000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [gallery.length]);

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
                        color="#e2e2e2"
                        _hover={{ color: "#efefef", borderColor: "#efefef" }}
                        size="sm"
                        fontSize="sm"
                        onClick={() => navigate(-1)}
                    >
                        Назад
                    </Button>

                    <Grid
                        templateColumns={{ base: "1fr", md: "280px 1fr" }}
                        gap={{ base: 4, md: 8 }}
                        bg="linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(255, 255, 255, 0.06))"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="rgba(255, 255, 255, 0.15)"
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
                                borderColor="#d9d9d9"
                                borderRadius="md"
                                boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                            />
                        </GridItem>

                        <GridItem>
                            <VStack align="start" spacing={6} w="full">
                                <Heading as="h1" size="lg" color="#e0e0e0">{project.title}</Heading>
                                <Box w="full" mt={4}>
                                    <Heading as="h3" size="sm" mb={3} display="flex" alignItems="center" color="#e0e0e0">
                                        <CFaProject mr={2} color="#f2f2f2" />
                                        Описание
                                    </Heading>
                                    <Text fontSize="md" color="#a0a0a0" w="full">
                                        {project.description || "Описание отсутствует"}
                                    </Text>
                                </Box>
                            </VStack>
                        </GridItem>
                    </Grid>

                    {gallery.length > 0 && (
                        <Box mt={16}>
                            <Heading
                                as="h2"
                                size="md"
                                mb={6}
                                color="white"
                                textAlign="center"
                            >
                                Фотогалерея
                            </Heading>

                            <Flex
                                position="relative"
                                align="center"
                                justify="center"
                                overflow="hidden"
                                h={{ base: "250px", md: "400px" }}
                                w="100%"
                            >
                                {gallery.length > 1 && (
                                    <IconButton
                                        aria-label="Назад"
                                        icon={<ChevronLeftIcon />}
                                        position="absolute"
                                        left={2}
                                        zIndex={2}
                                        onClick={() => {
                                            setDirection(-1);
                                            setGalleryIndex(prev => (prev - 1 + gallery.length) % gallery.length);
                                        }}
                                    />
                                )}
                                <AnimatePresence mode="wait" custom={direction}>
                                    <MotionBox
                                        key={galleryIndex}
                                        custom={direction}
                                        initial={{ opacity: 0, x: direction * 40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: direction * -40 }}
                                        transition={{ duration: 0.35 }}
                                        position="relative"
                                    >
                                        <ChakraImage
                                            src={gallery[galleryIndex]}
                                            alt={`Фото ${galleryIndex + 1}`}
                                            maxH={{ base: "230px", md: "380px" }}
                                            objectFit="contain"
                                            borderRadius="md"
                                            cursor="pointer"
                                            onClick={onOpen}
                                        />
                                        <IconButton
                                            aria-label="Открыть"
                                            icon={<CFaExpand />}
                                            size="sm"
                                            position="absolute"
                                            top={2}
                                            right={2}
                                            onClick={onOpen}
                                        />
                                    </MotionBox>
                                </AnimatePresence>
                                {gallery.length > 1 && (
                                    <IconButton
                                        aria-label="Вперёд"
                                        icon={<ChevronRightIcon />}
                                        position="absolute"
                                        right={2}
                                        zIndex={2}
                                        onClick={() => {
                                            setDirection(1);
                                            setGalleryIndex(prev => (prev + 1) % gallery.length);
                                        }}
                                    />
                                )}
                            </Flex>
                        </Box>
                    )}

                    {project.afisha === false && (
                        <ReviewsSection type="archive" targetId={Number(id)} />
                    )}
                </Container>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
                <ModalOverlay />
                <ModalContent bg="transparent" boxShadow="none" maxW="90vw">
                    <ModalCloseButton color="white" />
                    {gallery[galleryIndex] && (
                        <ChakraImage
                            src={gallery[galleryIndex]}
                            alt="Фото"
                            maxH="90vh"
                            objectFit="contain"
                            mx="auto"
                        />
                    )}
                </ModalContent>
            </Modal>

            <Footer />
        </Box>
    );
};

export default ArchiveDetail;
