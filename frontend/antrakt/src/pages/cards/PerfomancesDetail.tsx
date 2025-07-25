import React, { useState, useEffect, useRef } from "react";
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
    useDisclosure,
    IconButton,
    Center
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion"; // Добавлен AnimatePresence
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaTheaterMasks, FaFilm, FaUserTie, FaClock, FaUsers, FaExpand } from "react-icons/fa";

// Стилизованные компоненты для иконок
const CFaTheaterMasks = chakra(FaTheaterMasks as any);
const CFaFilm = chakra(FaFilm as any);
const CFaUserTie = chakra(FaUserTie as any);
const CFaClock = chakra(FaClock as any);
const CFaUsers = chakra(FaUsers as any);
const CFaExpand = chakra(FaExpand as any)

const MotionBox = motion(Box);
const MotionImage = motion(Image);

interface Performance {
    id: number;
    title: string;
    author: string;
    genre: string;
    age_limit: string;
    duration: string | null;
    premiere_date: string | null;
    production_team: string[] | null;
    the_cast: string[] | null;
    description: string;
    afisha: boolean;
    image_url: string;
    images_list: string[] | null;
}

const PerformanceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [performance, setPerformance] = useState<Performance | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isManualNavigation, setIsManualNavigation] = useState(false);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8000/perfomance${id}`);
                setPerformance({
                    ...response.data,
                    production_team: response.data.production_team || [],
                    the_cast: response.data.the_cast || [],
                    images_list: response.data.images_list || []
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

    // Автоматическое перелистывание только когда нет ручной навигации и модальное окно закрыто
    useEffect(() => {
        if (!performance?.images_list?.length || isManualNavigation || isOpen) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        intervalRef.current = setInterval(() => {
            setDirection(1);
            setGalleryIndex(prev => (prev + 1) % performance.images_list!.length);
        }, 4000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [performance?.images_list, isManualNavigation, isOpen]);

    // Сброс флага ручной навигации через некоторое время
    useEffect(() => {
        if (isManualNavigation) {
            const timeout = setTimeout(() => {
                setIsManualNavigation(false);
            }, 8000); // 8 секунд без активности

            return () => clearTimeout(timeout);
        }
    }, [isManualNavigation]);

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        onOpen();
    };

    const handleModalClose = () => {
        onClose();
        // Возобновляем автоперелистывание после закрытия модального окна
        setIsManualNavigation(false);
    };

    const nextImage = () => {
        if (!performance?.images_list) return;
        setDirection(1);
        setCurrentImageIndex(prev => (prev + 1) % performance.images_list.length);
    };

    const prevImage = () => {
        if (!performance?.images_list) return;
        setDirection(-1);
        setCurrentImageIndex(prev => (prev - 1 + performance.images_list.length) % performance.images_list.length);
    };

    const handleGalleryNext = () => {
        if (!performance?.images_list) return;
        setIsManualNavigation(true);
        setDirection(1);
        setGalleryIndex(prev => (prev + 1) % performance.images_list.length);
    };

    const handleGalleryPrev = () => {
        if (!performance?.images_list) return;
        setIsManualNavigation(true);
        setDirection(-1);
        setGalleryIndex(prev => (prev - 1 + performance.images_list.length) % performance.images_list.length);
    };

    const handleDotClick = (index: number) => {
        setIsManualNavigation(true);
        setDirection(index > galleryIndex ? 1 : -1);
        setGalleryIndex(index);
    };

    // Анимация для фотогалереи без задержек при ручном управлении
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
                        onClick={() => navigate("/performances")}
                    >
                        Вернуться к спектаклям
                    </Button>
                </Box>
                <Footer />
            </Box>
        );
    }

    const formatDuration = (duration: string | null) => {
        if (!duration) return "Не указано";
        const [hours, minutes] = duration.split(":");
        return `${hours}ч ${minutes}мин`;
    };

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
                                            <CFaUserTie mr={2} color="#F56565" />
                                            Основная информация
                                        </Heading>
                                        <Text fontSize="md" color="gray.400">
                                            <b>Автор:</b> {performance.author}
                                        </Text>
                                        <Text fontSize="md" color="gray.400">
                                            <b>Жанр:</b> {performance.genre}
                                        </Text>
                                        <Text fontSize="md" color="gray.400">
                                            <b>Возрастное ограничение:</b> {performance.age_limit}
                                        </Text>
                                        <Text fontSize="md" color="gray.400">
                                            <b>Длительность:</b> {formatDuration(performance.duration)}
                                        </Text>
                                        <Text fontSize="md" color="gray.400">
                                            <b>Дата премьеры:</b> {performance.premiere_date ? new Date(performance.premiere_date).toLocaleDateString() : "Не указана"}
                                        </Text>
                                    </VStack>

                                    <VStack align="start">
                                        <Heading as="h3" size="sm" display="flex" alignItems="center" color="white">
                                            <CFaUsers mr={2} color="#F56565" />
                                            Команда
                                        </Heading>
                                        {performance.production_team?.length > 0 && (
                                            <Text fontSize="md" color="gray.400">
                                                <b>Постановочная команда:</b> {performance.production_team.join(", ")}
                                            </Text>
                                        )}
                                        {performance.the_cast?.length > 0 && (
                                            <Text fontSize="md" color="gray.400">
                                                <b>Актёрский состав:</b> {performance.the_cast.join(", ")}
                                            </Text>
                                        )}
                                    </VStack>
                                </Grid>

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
                        </GridItem>
                    </Grid>

                    {performance.images_list && performance.images_list.length > 0 && (
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
                                    bg: "#F56565",
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
                                h={{ base: "250px", md: "400px" }} // Увеличенная высота
                                w="100%" // Занимает всю доступную ширину
                                borderRadius="xl"
                                bg="rgba(20, 20, 20, 0.5)"
                                border="1px solid"
                                borderColor="rgba(64, 0, 16, 0.7)"
                                boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                                p={2}
                            >
                                <IconButton
                                    aria-label="Предыдущее фото"
                                    icon={<ChevronLeftIcon />}
                                    position="absolute"
                                    left="10px"
                                    zIndex="1"
                                    bg="rgba(0, 0, 0, 0.5)"
                                    color="white"
                                    _hover={{ bg: "#F56565" }}
                                    onClick={handleGalleryPrev}
                                />

                                <IconButton
                                    aria-label="Следующее фото"
                                    icon={<ChevronRightIcon />}
                                    position="absolute"
                                    right="10px"
                                    zIndex="1"
                                    bg="rgba(0, 0, 0, 0.5)"
                                    color="white"
                                    _hover={{ bg: "#F56565" }}
                                    onClick={handleGalleryNext}
                                />

                                {/* Анимированное изображение */}
                                <AnimatePresence initial={false} custom={direction}>
                                    <MotionImage
                                        key={galleryIndex}
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: { type: "spring", stiffness: 400, damping: 40 },
                                            opacity: { duration: 0.15 }
                                        }}
                                        src={performance.images_list[galleryIndex]}
                                        alt={`Фото спектакля ${galleryIndex + 1}`}
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
                                    _hover={{ bg: "#F56565" }}
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
                                    {performance.images_list.map((_, index) => (
                                        <Box
                                            key={index}
                                            w="10px"
                                            h="10px"
                                            borderRadius="full"
                                            bg={index === galleryIndex ? "#F56565" : "gray.600"}
                                            cursor="pointer"
                                            onClick={() => handleDotClick(index)}
                                            _hover={{ bg: "#F56565" }}
                                        />
                                    ))}
                                </Flex>
                            </Flex>
                        </Box>
                    )}
                </Box>
            </Box>
            <Footer />

            {/* Модальное окно для просмотра фото */}
            <Modal isOpen={isOpen} onClose={handleModalClose} size="6xl" isCentered>
                <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
                <ModalContent bg="transparent" boxShadow="none">
                    <ModalCloseButton
                        color="white"
                        bg="rgba(0, 0, 0, 0.5)"
                        _hover={{ bg: "#F56565" }}
                        size="lg"
                        zIndex="overlay"
                        onClick={handleModalClose}
                    />

                    <Flex position="relative" h="85vh" align="center" justify="center">
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
                            _hover={{ bg: "#F56565" }}
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
                            _hover={{ bg: "#F56565" }}
                            onClick={nextImage}
                        />

                        {/* Анимированное изображение в модальном окне без задержек */}
                        <AnimatePresence initial={false} custom={direction}>
                            <MotionImage
                                key={currentImageIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 500, damping: 50 },
                                    opacity: { duration: 0.1 }
                                }}
                                src={performance?.images_list?.[currentImageIndex] || ""}
                                alt={`Фото спектакля ${currentImageIndex + 1}`}
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
                            {currentImageIndex + 1} / {performance?.images_list?.length}
                        </Text>
                    </Flex>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default PerformanceDetail;