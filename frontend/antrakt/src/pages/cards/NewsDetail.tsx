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
    AlertDescription,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    IconButton,
    Center,
    useDisclosure
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaNewspaper, FaCalendarAlt, FaExpand } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionImage = motion(Image);
const CFaNewspaper = chakra(FaNewspaper as any);
const CFaCalendarAlt = chakra(FaCalendarAlt as any);
const CFaExpand = chakra(FaExpand as any);

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
    images_list: string[] | null;
}

const NewsDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [news, setNews] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [direction, setDirection] = useState(1);

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

    useEffect(() => {
        if (!news?.images_list?.length) return;

        const interval = setInterval(() => {
            setDirection(1);
            setGalleryIndex(prev => (prev + 1) % news.images_list!.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [news?.images_list]);

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        onOpen();
    };

    const nextImage = () => {
        if (!news?.images_list) return;
        setDirection(1);
        setCurrentImageIndex(prev => (prev + 1) % news.images_list.length);
    };

    const prevImage = () => {
        if (!news?.images_list) return;
        setDirection(-1);
        setCurrentImageIndex(prev => (prev - 1 + news.images_list.length) % news.images_list.length);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -1000 : 1000,
            opacity: 0
        })
    };

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
                <Box textAlign="center" py={{ base: 12, md: 20 }} bg="black">
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
                <Box textAlign="center" py={{ base: 12, md: 20 }} bg="black">
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
            <Box flex="1" py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }} bg="black" position="relative" overflow='hidden'>
                <MotionBox
                    position="absolute"
                    top="-15%"
                    right="-10%"
                    w="400px"
                    h="400px"
                    bg="linear-gradient(135deg, #800020, #40001010)"
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
                        templateColumns={{ base: "1fr", md: "280px 1fr" }}
                        gap={{ base: 4, md: 8 }}
                        bg="linear-gradient(135deg, rgba(25, 25, 25, 0.9), rgba(64, 64, 64, 0.3))"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="rgba(64, 64, 64, 0.7)"
                        boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                        p={{ base: 4, md: 8 }}
                        w='100%'
                    >
                        <GridItem>
                            <Image
                                src={news.image_url}
                                alt={news.title}
                                width={{ base: "100%", md: "280px" }}
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

                    {news.images_list && news.images_list.length > 0 && (
                        <Box mt={16}>
                            <Heading
                                as="h2"
                                size="md"
                                mb={6}
                                color="white"
                                textAlign="center"
                                position="relative"
                                _after={{
                                    content: '""',
                                    position: "absolute",
                                    bottom: "-8px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "60px",
                                    height: "3px",
                                    bg: "#800020",
                                    borderRadius: "full"
                                }}
                            >
                                Фотогалерея
                            </Heading>

                            <Flex
                                position="relative"
                                align="center"
                                justify="center"
                                overflow="hidden"
                                h={{ base: "240px", sm: "300px", md: "420px" }}
                                w="100%"
                                borderRadius="xl"
                                bg="rgba(20, 20, 20, 0.5)"
                                border="1px solid"
                                borderColor="rgba(64, 0, 16, 0.7)"
                                boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                                p={{ base: 1, md: 2 }}
                            >
                                <IconButton
                                    aria-label="Предыдущее фото"
                                    icon={<ChevronLeftIcon />}
                                    position="absolute"
                                    left="10px"
                                    zIndex="1"
                                    bg="rgba(0, 0, 0, 0.5)"
                                    color="white"
                                    _hover={{ bg: "#800020" }}
                                    onClick={() => {
                                        setDirection(-1);
                                        setGalleryIndex(prev =>
                                            (prev - 1 + news.images_list!.length) % news.images_list!.length
                                        );
                                    }}
                                />

                                <IconButton
                                    aria-label="Следующее фото"
                                    icon={<ChevronRightIcon />}
                                    position="absolute"
                                    right="10px"
                                    zIndex="1"
                                    bg="rgba(0, 0, 0, 0.5)"
                                    color="white"
                                    _hover={{ bg: "#800020" }}
                                    onClick={() => {
                                        setDirection(1);
                                        setGalleryIndex(prev =>
                                            (prev + 1) % news.images_list!.length
                                        );
                                    }}
                                />

                                <AnimatePresence initial={false} custom={direction}>
                                    <MotionImage
                                        key={galleryIndex}
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: { type: "spring", stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.2 }
                                        }}
                                        src={news.images_list[galleryIndex]}
                                        alt={`Фото новости ${galleryIndex + 1}`}
                                        position="absolute"
                                        h="100%"
                                        w="auto"
                                        maxW="100%"
                                        objectFit="contain"
                                        cursor="pointer"
                                        onClick={() => handleImageClick(galleryIndex)}
                                        borderRadius="md"
                                    />
                                </AnimatePresence>

                                <IconButton
                                    aria-label="Увеличить фото"
                                    icon={<CFaExpand />}
                                    position="absolute"
                                    bottom="10px"
                                    right="10px"
                                    zIndex="1"
                                    bg="rgba(0, 0, 0, 0.5)"
                                    color="white"
                                    _hover={{ bg: "#800020" }}
                                    onClick={() => handleImageClick(galleryIndex)}
                                />

                                <Flex
                                    position="absolute"
                                    bottom="10px"
                                    left="50%"
                                    transform="translateX(-50%)"
                                    gap={2}
                                    zIndex="1"
                                >
                                    {news.images_list.map((_, index) => (
                                        <Box
                                            key={index}
                                            w="10px"
                                            h="10px"
                                            borderRadius="full"
                                            bg={index === galleryIndex ? "#800020" : "gray.600"}
                                            cursor="pointer"
                                            onClick={() => setGalleryIndex(index)}
                                            _hover={{ bg: "#800020" }}
                                        />
                                    ))}
                                </Flex>
                            </Flex>
                        </Box>
                    )}
                </Box>
            </Box>
            <Footer />

            <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "6xl" }} isCentered>
                <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
                <ModalContent bg="transparent" boxShadow="none">
                    <ModalCloseButton
                        color="white"
                        bg="rgba(0, 0, 0, 0.5)"
                        _hover={{ bg: "#800020" }}
                        size="lg"
                        zIndex="overlay"
                        onClick={onClose}
                    />

                    <Flex position="relative" h={{ base: "80vh", md: "85vh" }} align="center" justify="center">
                        <IconButton
                            aria-label="Предыдущее фото"
                            icon={<ChevronLeftIcon />}
                            position="absolute"
                            left="10px"
                            zIndex="1"
                            bg="rgba(0, 0, 0, 0.5)"
                            color="white"
                            fontSize="xl"
                            size="lg"
                            _hover={{ bg: "#800020" }}
                            onClick={prevImage}
                        />

                        <IconButton
                            aria-label="Следующее фото"
                            icon={<ChevronRightIcon />}
                            position="absolute"
                            right="10px"
                            zIndex="1"
                            bg="rgba(0, 0, 0, 0.5)"
                            color="white"
                            fontSize="xl"
                            size="lg"
                            _hover={{ bg: "#800020" }}
                            onClick={nextImage}
                        />

                        <AnimatePresence initial={false} custom={direction}>
                            <MotionImage
                                key={currentImageIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                src={news?.images_list?.[currentImageIndex] || ""}
                                alt={`Фото новости ${currentImageIndex + 1}`}
                                maxH="85vh"
                                maxW="100%"
                                objectFit="contain"
                                borderRadius="md"
                            />
                        </AnimatePresence>

                        <Text
                            position="absolute"
                            bottom="20px"
                            left="50%"
                            transform="translateX(-50%)"
                            color="white"
                            bg="rgba(0, 0, 0, 0.5)"
                            px={3}
                            py={1}
                            borderRadius="md"
                            zIndex="1"
                        >
                            {currentImageIndex + 1} / {news?.images_list?.length}
                        </Text>
                    </Flex>
                </ModalContent>
            </Modal>
        </Box >
    );
};

export default NewsDetail;