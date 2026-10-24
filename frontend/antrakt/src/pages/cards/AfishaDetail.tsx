import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import ShowTickets from "../../components/ShowTickets";
import PageFetchError from "../../components/PageFetchError";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import {
    Box,
    VStack,
    Heading,
    Text,
    Image,
    Grid,
    GridItem,
    Button,
    chakra
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { FaTheaterMasks } from "react-icons/fa";
import { getImageUrl } from '../../utils/imageUrl';
import { truncateMeta, usePageMeta } from '../../hooks/usePageMeta';

const CFaTheaterMasks = chakra(FaTheaterMasks as any);

const MotionBox = motion(Box);

// Интерфейс для данных, общий для спектаклей и мероприятий
interface AfishaItem {
    id: number;
    type: 'performance' | 'archive';
    title: string;
    description: string;
    premiere_date: string | null;
    age_limit: string | null;
    image_url: string | null;
    genre?: string; // Только для performance
    director_name?: string | null; // Режиссёр (виден уже в "Афише")
    shows?: { id?: number; show_datetime: string; ticket_url?: string | null }[]; // Только для performance
    afisha?: boolean;
    ticket_url?: string; // Только для performance
}

// Состав и роли в "Афише" намеренно не показываем — они открываются только
// после перехода спектакля в раздел "Спектакли".
const AfishaDetail: React.FC = () => {
    const { type, id } = useParams<{ type: string; id: string }>();
    const navigate = useNavigate();
    const [record, setItem] = useState<AfishaItem | null>(null);
    const item = record?.type === type && String(record.id) === id ? record : null;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retry, setRetry] = useState(0);
    const valid = (type === 'performance' || type === 'archive') && /^[1-9]\d*$/.test(id || '') && Number.isSafeInteger(Number(id));

    useEffect(() => {
        let current = true;
        const controller = new AbortController();
        setItem(null);
        setError('');
        if (!valid) {
            setLoading(false);
            return () => controller.abort();
        }
        setLoading(true);
        const endpoint = type === 'performance' ? `perfomance${id}` : `archive${id}`;
        axios.get(`${API_URL}/${endpoint}/`, { signal: controller.signal }).then(response => {
            if (current) setItem({ ...response.data, type });
        }).catch(error => {
            if (current && !controller.signal.aborted) {
                setError(error.response?.status === 404 ? 'not_found' : 'network');
            }
        }).finally(() => {
            if (current) setLoading(false);
        });
        return () => { current = false; controller.abort(); };
    }, [type, id, valid, retry]);

    usePageMeta(
        item?.title,
        item
            ? truncateMeta(
                item.description ||
                `«${item.title}» в афише Норильского народного театра.`
              )
            : null
    );

    if (!loading && item && item.afisha === false) {
        return <Navigate to={`/${type === 'performance' ? 'performance' : 'projects'}/${id}`} replace />;
    }

    if (loading || !item) {
        return (
            <Box bg="black" display="flex" flexDirection="column" minH="100vh">
                <Navigation />
                <Box textAlign="center" py={{ base: 12, md: 20 }} bg="black">
                    {loading ? <Text role="status" color="white">Загрузка афиши…</Text> : error === 'network' ?
                        <PageFetchError message="Не удалось загрузить запись афиши. Проверьте соединение и повторите попытку." onRetry={() => setRetry(value => value + 1)} /> :
                        <Heading size="md" mb={4} color="white">Запись не найдена</Heading>}
                    <Button
                        variant="outline"
                        color="#e2e2e2"
                        _hover={{ color: "#efefef", borderColor: "#efefef" }}
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
            <Box flex="1" py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }} bg="black" position="relative">
                <MotionBox
                    position="absolute"
                    bottom="-20%"
                    left="-10%"
                    w="500px"
                    h="500px"
                    bg="#2a2a2a"
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
                        color="#e2e2e2"
                        _hover={{ color: "#efefef", borderColor: "#efefef" }}
                        size="sm"
                        fontSize="sm"
                        onClick={() => navigate('/afisha')}
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
                            <Image
                                src={getImageUrl(item.image_url)}
                                fallbackSrc={getImageUrl()}
                                alt={item.title}
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
                                <Heading as="h1" size="lg" color="white">
                                    {item.title}
                                </Heading>

                                <Text color="whiteAlpha.800" fontSize="sm">
                                    {item.type === 'performance' ? 'Спектакль' : 'Мероприятие'}
                                </Text>

                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} w="full">
                                    <VStack align="start">
                                        <Heading as="h3" size="sm" display="flex" alignItems="center" color="white">
                                            <CFaTheaterMasks mr={2} color="#d9d9d9" />
                                            Основная информация
                                        </Heading>
                                        {item.genre && (
                                            <Text fontSize="md" color="gray.400">
                                                <b>Жанр:</b> {item.genre}
                                            </Text>
                                        )}
                                        {item.director_name && (
                                            <Text fontSize="md" color="gray.400">
                                                <b>Режиссёр:</b> {item.director_name}
                                            </Text>
                                        )}
                                        {item.age_limit && (
                                            <Text fontSize="md" color="gray.400">
                                                <b>Возрастное ограничение:</b> {item.age_limit}
                                            </Text>
                                        )}
                                        {item.type === 'performance' ? <ShowTickets shows={item.shows} generalUrl={item.ticket_url} /> : item.premiere_date && (
                                            <Text color="gray.400"><b>Дата:</b> {new Date(`${item.premiere_date}T12:00:00`).toLocaleDateString('ru-RU')}</Text>
                                        )}
                                    </VStack>

                                    <VStack align="start">
                                        <Box w="full" mt={4}>
                                            <Heading as="h3" size="sm" mb={3} display="flex" alignItems="center" color="white">
                                                <CFaTheaterMasks mr={2} color="#d9d9d9" />
                                                Описание
                                            </Heading>
                                            <Text fontSize="md" color="gray.400" w="full">
                                                {item.description}
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