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
import PageFetchError from "../../components/PageFetchError";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaTheaterMasks, FaFilm, FaUserTie, FaClock, FaUsers, FaExpand } from "react-icons/fa";
import { API_URL } from '../../config'
import { getImageUrl } from '../../utils/imageUrl';

// Стилизованные компоненты для иконок
const CFaTheaterMasks = chakra(FaTheaterMasks as any);
const CFaFilm = chakra(FaFilm as any);
const CFaUserTie = chakra(FaUserTie as any);
const CFaClock = chakra(FaClock as any);
const CFaUsers = chakra(FaUsers as any);
const CFaExpand = chakra(FaExpand as any)

const MotionBox = motion(Box);
const MotionImage = motion(Image);

type CastMember = {
    id?: number;
    actor?: number | null;
    actor_name?: string;
    role: string;
};

/** Разделить «должность - имя», не ломая должности с дефисом (Хореограф-постановщик). */
function parseProductionTeamMember(raw: string): { label: string; value: string } {
    const trimmed = (raw || '').trim();
    if (!trimmed) {
        return { label: 'Участник', value: '' };
    }
    // Пробельные разделители и двоеточие — не одиночный «-» внутри слова.
    // Поддерживаем em-dash —, en-dash – и обычный дефис с пробелами.
    const separators = [' — ', ' – ', ' - ', ': ', '—', '–', ':'];
    for (const sep of separators) {
        const idx = trimmed.indexOf(sep);
        if (idx > 0) {
            const label = trimmed.slice(0, idx).trim();
            const value = trimmed.slice(idx + sep.length).trim();
            if (label && value) {
                return { label, value };
            }
        }
    }
    return { label: 'Участник', value: trimmed };
}

/** Группировка актёров по роли с сохранением порядка первого появления роли. */
function groupCastByRole(cast: CastMember[]): { role: string; actors: CastMember[] }[] {
    const groups: { role: string; actors: CastMember[] }[] = [];
    const indexByRole = new Map<string, number>();
    for (const member of cast) {
        const role = (member.role || '').trim() || 'Роль';
        const existing = indexByRole.get(role);
        if (existing === undefined) {
            indexByRole.set(role, groups.length);
            groups.push({ role, actors: [member] });
        } else {
            groups[existing].actors.push(member);
        }
    }
    return groups;
}

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
    cast: CastMember[] | null;
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
                const response = await axios.get(`${API_URL}/perfomance${id}`);
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
                <Box py={{ base: 12, md: 20 }} px={4} bg="black">
                    <PageFetchError message={error} />
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
                                src={getImageUrl(performance.image_url)}
                                fallbackSrc={getImageUrl()}
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
                                            <Box w="full">
                                                <Text fontSize="md" color="#e0e0e0" mb={2}>
                                                    <b>Показы:</b>
                                                </Text>
                                                <VStack align="stretch" spacing={2} w="full">
                                                    {performance.shows.map((s, i) => {
                                                        const dt = new Date(s.show_datetime);
                                                        const dateLabel = dt.toLocaleDateString('ru-RU', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            timeZone: 'Asia/Krasnoyarsk',
                                                        });
                                                        const timeLabel = dt.toLocaleTimeString('ru-RU', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            timeZone: 'Asia/Krasnoyarsk',
                                                        });
                                                        return (
                                                            <Flex
                                                                key={s.id ?? i}
                                                                align="baseline"
                                                                gap={2}
                                                                borderLeft="2px solid"
                                                                borderColor="#3a3a3a"
                                                                pl={3}
                                                                py={1}
                                                            >
                                                                <Text
                                                                    fontWeight="semibold"
                                                                    color="#ffffff"
                                                                    minW={{ base: "120px", md: "160px" }}
                                                                >
                                                                    {dateLabel}
                                                                </Text>
                                                                <Text color="#a0a0a0">—</Text>
                                                                <Text color="#c9c9c9">{timeLabel}</Text>
                                                            </Flex>
                                                        );
                                                    })}
                                                </VStack>
                                            </Box>
                                        )}
                                    </VStack>

                                    <VStack align="start">
                                        <Heading as="h3" size="sm" display="flex" alignItems="center" color="#e0e0e0">
                                            <CFaUsers mr={2} color="#d9d9d9" />
                                            Команда
                                        </Heading>
                                        {performance.production_team && performance.production_team.length > 0 && (
                                            <Box w="full">
                                                <Text fontSize="md" color="#e0e0e0" mb={2}>
                                                    <b>Постановочная команда:</b>
                                                </Text>
                                                <VStack align="stretch" spacing={2} w="full">
                                                    {performance.production_team.map((member, i) => {
                                                        const raw = (member || '').trim();
                                                        const { label, value } = parseProductionTeamMember(raw);
                                                        return (
                                                            <Flex
                                                                key={`${raw}-${i}`}
                                                                align="baseline"
                                                                gap={2}
                                                                borderLeft="2px solid"
                                                                borderColor="#3a3a3a"
                                                                pl={3}
                                                                py={1}
                                                            >
                                                                <Text
                                                                    fontWeight="semibold"
                                                                    color="#ffffff"
                                                                    minW={{ base: "120px", md: "180px" }}
                                                                >
                                                                    {label}
                                                                </Text>
                                                                <Text color="#a0a0a0">—</Text>
                                                                <Text color="#c9c9c9">{value}</Text>
                                                            </Flex>
                                                        );
                                                    })}
                                                </VStack>
                                            </Box>
                                        )}
                                        {!performance.afisha && performance.cast && performance.cast.length > 0 && (
                                            <Box w="full">
                                                <Text fontSize="md" color="#e0e0e0" mb={2}>
                                                    <b>Актёрский состав:</b>
                                                </Text>
                                                <VStack align="stretch" spacing={2} w="full">
                                                    {groupCastByRole(performance.cast).map((group, i) => (
                                                        <Flex
                                                            key={`${group.role}-${i}`}
                                                            align="center"
                                                            gap={2}
                                                            borderLeft="2px solid"
                                                            borderColor="#3a3a3a"
                                                            pl={3}
                                                            py={1}
                                                        >
                                                            <VStack
                                                                align="start"
                                                                spacing={0}
                                                                minW={{ base: "120px", md: "160px" }}
                                                            >
                                                                {group.actors.map((actor, actorIdx) => (
                                                                    <Text
                                                                        key={actor.id ?? `${actor.actor_name}-${actorIdx}`}
                                                                        fontWeight="semibold"
                                                                        color="#ffffff"
                                                                        lineHeight="1.35"
                                                                    >
                                                                        {actor.actor_name || 'Актёр'}
                                                                    </Text>
                                                                ))}
                                                            </VStack>
                                                            <Text color="#a0a0a0" flexShrink={0}>—</Text>
                                                            <Text color="#c9c9c9">{group.role}</Text>
                                                        </Flex>
                                                    ))}
                                                </VStack>
                                            </Box>
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
                                borderColor="rgba(255, 255, 255, 0.15)"
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