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
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { FaTheaterMasks, FaFilm, FaQuoteLeft, FaUserTie, FaBook, FaUser, FaPaintBrush, FaVideo, FaMusic } from "react-icons/fa";

// Стилизованные компоненты для иконок
const CFaTheaterMasks = chakra(FaTheaterMasks as any);
const CFaFilm = chakra(FaFilm as any);
const CFaQuoteLeft = chakra(FaQuoteLeft as any);
const CFaUserTie = chakra(FaUserTie as any);
const CFaBook = chakra(FaBook as any);
const CFaUser = chakra(FaUser as any);
const CFaPaintBrush = chakra(FaPaintBrush as any);
const CFaVideo = chakra(FaVideo as any);
const CFaMusic = chakra(FaMusic as any);

const MotionBox = motion(Box);

// Интерфейс для данных режиссёра
interface ServerDirector {
    name: string;
    image_url: string;
    description: string;
    perfomances: string[] | null;
    years: number[] | null;
    team_name: string[] | null;
}

// Интерфейс для спектакля
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

const DirectorDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [director, setDirector] = useState<ServerDirector | null>(null);
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notFoundPerformance, setNotFoundPerformance] = useState<string>("");
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Функция для получения ID спектакля по названию
    const findPerformanceIdByTitle = (title: string): number | null => {
        const performance = performances.find(p => p.title.toLowerCase() === title.toLowerCase());
        return performance ? performance.id : null;
    };

    // Функция для обработки клика по карточке спектакля
    const handlePerformanceClick = (performanceTitle: string) => {
        const performanceId = findPerformanceIdByTitle(performanceTitle);
        if (performanceId) {
            navigate(`/performance/${performanceId}`);
        } else {
            setNotFoundPerformance(performanceTitle);
            onOpen();
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Загружаем данные режиссёра и список всех спектаклей параллельно
                const [directorResponse, performancesResponse] = await Promise.all([
                    axios.get(`http://localhost:8000/director${id}`),
                    axios.get(`http://localhost:8000/perfomances/`)
                ]);

                setDirector({
                    ...directorResponse.data,
                    perfomances: directorResponse.data.perfomances || [],
                    years: directorResponse.data.years || [],
                    team_name: directorResponse.data.team_name || []
                });

                setPerformances(performancesResponse.data);
            } catch (err) {
                setError("Ошибка загрузки данных режиссёра");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
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

    if (!director) {
        return (
            <Box textAlign="center" py={20} bg="black">
                <Heading size="md" mb={4} color="white">Режиссёр не найден</Heading>
                <Button
                    variant="outline"
                    color="#FC8181"
                    _hover={{ color: "#FEB2B2", borderColor: "#FEB2B2" }}
                    size="sm"
                    fontSize="sm"
                    onClick={() => navigate("/team")}
                >
                    Вернуться к команде
                </Button>
            </Box>
        );
    }

    return (
        <Box bg="black" display="flex" flexDirection="column" minH="100vh">
            <Navigation />
            <Box flex="1" py={20} px={{ base: 4, md: 8 }} bg="black" position="relative">
                {/* Декоративный элемент */}
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
                                src={director.image_url}
                                alt={director.name}
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
                                    {director.name}
                                </Heading>

                                <Text color="whiteAlpha.800" fontSize="sm">
                                    Режиссёр
                                </Text>

                                <Box w="full">
                                    <Heading as="h3" size="sm" display="flex" alignItems="center" color="white" mb={3}>
                                        <CFaUserTie mr={2} color="#F56565" />
                                        О себе
                                    </Heading>
                                    <Text fontSize="md" color="gray.400" w="full">
                                        {director.description}
                                    </Text>
                                </Box>

                                {director.perfomances?.length > 0 && (
                                    <Box w="full" mt={6}>
                                        <Heading as="h3" size="sm" mb={3} display="flex" alignItems="center" color="white">
                                            <CFaTheaterMasks mr={2} color="#F56565" />
                                            Поставленные спектакли
                                        </Heading>
                                        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
                                            {director.perfomances.map((perfomance, idx) => (
                                                <MotionBox
                                                    key={idx}
                                                    p={4}
                                                    border="1px solid"
                                                    borderColor="rgba(64, 0, 16, 0.5)"
                                                    borderRadius="md"
                                                    bg="linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(64, 0, 16, 0.2))"
                                                    cursor="pointer"
                                                    whileHover={{
                                                        scale: 1.05,
                                                        boxShadow: "0 10px 25px rgba(245, 101, 101, 0.4)",
                                                        transition: { duration: 0.3 }
                                                    }}
                                                    whileTap={{
                                                        scale: 0.98,
                                                        transition: { duration: 0.1 }
                                                    }}
                                                    initial={{ scale: 1, boxShadow: "0 5px 20px rgba(0, 0, 0, 0.5)" }}
                                                    onClick={() => handlePerformanceClick(perfomance)}
                                                >
                                                    <Text fontWeight="bold" color="white" fontSize="sm">
                                                        {perfomance}
                                                    </Text>
                                                    {director.years?.[idx] && (
                                                        <Text fontSize="xs" color="gray.400" mt={1}>
                                                            Год: {director.years[idx]}
                                                        </Text>
                                                    )}
                                                    {director.team_name?.[idx] && (
                                                        <Text fontSize="xs" color="gray.400" mt={1}>
                                                            Коллектив: {director.team_name[idx]}
                                                        </Text>
                                                    )}
                                                </MotionBox>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}
                            </VStack>
                        </GridItem>
                    </Grid>
                </Box>
            </Box>
            <Footer />

            {/* Модальное окно для ошибки */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
                <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
                <ModalContent
                    bg="#1a1a1a"
                    color="white"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="rgba(64, 0, 16, 0.7)"
                >
                    <ModalHeader>
                        <Flex align="center">
                            <CFaTheaterMasks mr={2} color="#F56565" />
                            Спектакль не найден
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb={4}>
                            К сожалению, спектакль <Text as="span" fontWeight="bold" color="#F56565">"{notFoundPerformance}"</Text> не найден в нашей базе данных.
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                            Возможно, этот спектакль ещё не добавлен на сайт или был удалён из репертуара.
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="red"
                            mr={3}
                            onClick={onClose}
                            size="sm"
                        >
                            Понятно
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/performances')}
                            size="sm"
                            color="gray.400"
                            _hover={{ color: "white" }}
                        >
                            Посмотреть все спектакли
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default DirectorDetail;