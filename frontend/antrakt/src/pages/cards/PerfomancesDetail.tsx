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
import ReviewsSection from "../../components/ReviewsSection";
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
    director_name?: string | null;
    cast: { id?: number; actor: number; actor_name?: string; role: string }[] | null;
    shows: { id?: number; show_datetime: string; ticket_url?: string | null }[] | null;
    description: string;
    afisha: boolean;
    image_url: string;
    images_list: string[] | null;
    ticket_url?: string | null;
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
                    cast: response.data.cast || [],
                    shows: response.data.shows || [],
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

    // Предзагрузка всех изображений галереи, чтобы в полноэкранном режиме
    // перелистывание было мгновенным, без задержки на сетевую загрузку.
    useEffect(() => {
        const images = performance?.images_list;
        if (!images?.length) return;
        images.forEach((src) => {
            if (!src) return;
            const img = new window.Image();
            img.src = src;
        });
    }, [performance?.images_list]);

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
                    <Spinner size="xl" color="#d9d9d9" />
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
                <Box textAlign="center" py={{ base: 12, md: 20 }} bg="black">
                    <Heading size="md" mb={4} color="white">Спектакль не найден</Heading>
                    <Button
                        variant="outline"
                        color="#d9d9d9"
                        _hover={{ color: "#efefef", borderColor: "#efefef" }}
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
                    bg="linear-gradient(135deg, #d9d9d9, #15151510)"
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
                        color="#d9d9d9"
                        _hover={{ color: "#efefef", borderColor: "#efefef" }}
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
                                src={performance.image_url}
                                alt={performance.title}
                                width="300px"
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
                                <Flex justify="space-between" align="center" w="full">
                                    <Heading as="h1" size="lg" color="#e0e0e0">
                                        {performance.title}
                                    </Heading>
                                    {performance.afisha && performance.ticket_url && (
                                        <Button
                                            as="a"
                                            href={performance.ticket_url}
                                            colorScheme="gray"
                                            size="lg"
                                        >
                                            КУПИТЬ БИЛЕТ!
                                        </Button>
                                    )}
                                </Flex>

                                <Text color="#a0a0a0" fontSize="sm">
                                    Спектакль
                                </Text>

                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} w="full">
                                    <VStack align="start">
                                        <Heading as="h3" size="sm" display="flex" alignItems="center" color="#e0e0e0">
                                            <CFaTheaterMasks mr={2} color="#d9d9d9" />
                                            Основная информация
                                        </Heading>
                                        <Text fontSize="md" color="#e0e0e0">
                                            <b>Автор:</b> {performance.author}
                                        </Text>
                                        {performance.director_name && (
                                            <Text fontSize="md" color="#e0e0e0">
                                                <b>Режиссёр:</b> {performance.director_name}
                                            </Text>
                                        )}
                                        <Text fontSize="md" color="#e0e0e0">
                                            <b>Жанр:</b> {performance.genre}
                                        </Text>
                                        <Text fontSize="md" color="#e0e0e0">
                                            <b>Возрастное ограничение:</b> {performance.age_limit}
                                        </Text>
                                        {performance.duration && (
                                            <Text fontSize="md" color="#e0e0e0">
                                                <b>Продолжительность:</b> {performance.duration}
                                            </Text>
                                        )}
                                        {performance.premiere_date && (
                                            <Text fontSize="md" color="#e0e0e0">
                                                <b>Дата премьеры:</b> {new Date(performance.premiere_date).toLocaleDateString()}
                                            </Text>
                                        )}
                                        {performance.shows && performance.shows.length > 0 && (
                                            <Text fontSize="md" color="#e0e0e0">
                                                <b>Показы:</b>{' '}
                                                {performance.shows
                                                    .map(s => new Date(s.show_datetime).toLocaleString('ru-RU', {
                                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit',
                                                        timeZone: 'Asia/Krasnoyarsk',
                                                    }))
                                                    .join('; ')}
                                            </Text>
                                        )}
                                    </VStack>

                                    <VStack align="start">
                                        <Heading as="h3" size="sm" display="flex" alignItems="center" color="#e0e0e0">
                                            <CFaUsers mr={2} color="#d9d9d9" />
                                            Команда
                                        </Heading>
                                        <Text fontSize="md" color="#e0e0e0">
                                            <b>Постановочная команда:</b> {performance.production_team.join(', ')}
                                        </Text>
                                        {performance.cast && performance.cast.length > 0 && (
                                            <Text fontSize="md" color="#e0e0e0">
                                                <b>Актёрский состав:</b>{' '}
                                                {performance.cast
                                                    .map(c => `${c.actor_name || 'Актёр'} — ${c.role}`)
                                                    .join(', ')}
                                            </Text>
                                        )}
                                    </VStack>
                                </Grid>

                                <Box w="full" mt={4}>
                                    <Heading as="h3" size="sm" mb={3} display="flex" alignItems="center" color="#e0e0e0">
                                        <CFaFilm mr={2} color="#d9d9d9" />
                                        Описание
                                    </Heading>
                                    <Text fontSize="md" color="#a0a0a0" w="full">
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
                                    bg: "#d9d9d9",
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
                                h={{ base: "250px", md: "400px" }}
                                w="100%"
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
                                    _hover={{ bg: "#d9d9d9" }}
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
                                    _hover={{ bg: "#d9d9d9" }}
                                    onClick={handleGalleryNext}
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
                                    _hover={{ bg: "#d9d9d9" }}
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
                                            bg={index === galleryIndex ? "#d9d9d9" : "gray.600"}
                                            cursor="pointer"
                                            onClick={() => handleDotClick(index)}
                                            _hover={{ bg: "#d9d9d9" }}
                                        />
                                    ))}
                                </Flex>
                            </Flex>
                        </Box>
                    )}

                    {!performance.afisha && (
                        <ReviewsSection type="performance" targetId={performance.id} />
                    )}
                </Box>
            </Box>
            <Footer />

            <Modal isOpen={isOpen} onClose={handleModalClose} size={{ base: "full", md: "6xl" }} isCentered>
                <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
                <ModalContent bg="transparent" boxShadow="none">
                    <ModalCloseButton
                        color="white"
                        bg="rgba(0, 0, 0, 0.5)"
                        _hover={{ bg: "#d9d9d9" }}
                        size="lg"
                        zIndex="overlay"
                        onClick={handleModalClose}
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
                            _hover={{ bg: "#d9d9d9" }}
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
                            _hover={{ bg: "#d9d9d9" }}
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
                                    x: { type: "spring", stiffness: 900, damping: 60 },
                                    opacity: { duration: 0.15 }
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