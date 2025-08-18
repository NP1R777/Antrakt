import React, { useEffect, useState } from "react";
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
import { FaTheaterMasks, FaFilm, FaQuoteLeft, FaUserTie, FaBook, FaUser, FaPaintBrush, FaVideo, FaMusic } from "react-icons/fa";
import { yearDeclension, performanceDeclension } from "../../utils/declension";

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

interface ServerActor {
    name: string;
    image_url: string;
    place_of_work: string;
    time_in_theatre: string;
    favorite_writer: string[] | null;
    favorite_character: string[] | null;
    favorite_painter: string[] | null;
    favorite_film: string[] | null;
    favorite_piece: string[] | null;
    favorite_quote: string;
    author_quote: string;
    favorite_song: string[] | null;
    author_song: string[] | null;
    perfomances: string[] | null;
    role_in_perfomances: string[] | null;
}

interface Performance {
    id: number;
    title: string;
    author: string;
    genre: string;
    age_limit: string;
}

const ActorDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [actor, setActor] = useState<ServerActor | null>(null);
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [actorResponse, performancesResponse] = await Promise.all([
                    axios.get(`http://localhost:8000/actor${id}`),
                    axios.get(`http://localhost:8000/perfomances/`)
                ]);

                setActor({
                    ...actorResponse.data,
                    favorite_writer: actorResponse.data.favorite_writer || [],
                    favorite_character: actorResponse.data.favorite_character || [],
                    favorite_painter: actorResponse.data.favorite_painter || [],
                    favorite_film: actorResponse.data.favorite_film || [],
                    favorite_piece: actorResponse.data.favorite_piece || [],
                    favorite_song: actorResponse.data.favorite_song || [],
                    author_song: actorResponse.data.author_song || [],
                    perfomances: actorResponse.data.perfomances || [],
                    role_in_perfomances: actorResponse.data.role_in_perfomances || []
                });

                setPerformances(performancesResponse.data);
            } catch (e) {
                setError("Ошибка загрузки данных актера");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const findPerformanceIdByTitle = (title: string): number | null => {
        const performance = performances.find(p => p.title.toLowerCase() === title.toLowerCase());
        return performance ? performance.id : null;
    };

    const handlePerformanceClick = (performanceTitle: string) => {
        const performanceId = findPerformanceIdByTitle(performanceTitle);
        if (performanceId) navigate(`/performance/${performanceId}`);
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="100vh" bg="black">
                <Spinner size="xl" color="#F56565" />
            </Flex>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" py={{ base: 12, md: 20 }} bg="black">
                <Alert status="error" variant="subtle" flexDirection="column" alignItems="center">
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="md" color="white">Ошибка загрузки</AlertTitle>
                    <AlertDescription maxWidth="sm" color="gray.400" fontSize="sm">{error}</AlertDescription>
                </Alert>
            </Box>
        );
    }

    if (!actor) {
        return (
            <Box textAlign="center" py={{ base: 12, md: 20 }} bg="black">
                <Heading size="md" mb={4} color="white">Актер не найден</Heading>
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

    const experienceMatch = actor.time_in_theatre.match(/\d+/);
    const experience = experienceMatch ? parseInt(experienceMatch[0]) : 0;
    const isFemale = actor.name.match(/[ая]$/i);

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
                    bg="#C53030"
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
                        templateColumns={{ base: "1fr", md: "280px 1fr" }}
                        gap={{ base: 4, md: 8 }}
                        bg="rgba(25, 25, 25, 0.8)"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="gray.800"
                        boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                        p={{ base: 4, md: 8 }}
                    >
                        <GridItem minW="0">
                            <Image
                                src={actor.image_url}
                                alt={actor.name}
                                width={{ base: "100%", md: "280px" }}
                                height="auto"
                                objectFit="contain"
                                border="4px solid"
                                borderColor="#C53030"
                                borderRadius="md"
                                boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                            />
                        </GridItem>

                        <GridItem minW="0">
                            <VStack align="start" spacing={6} sx={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
                                <Heading as="h1" size="lg" color="white">{actor.name}</Heading>
                                <Text color="whiteAlpha.800" fontSize="sm">{isFemale ? "Актриса" : "Актер"}</Text>

                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} w="full">
                                    <VStack align="start">
                                        <Heading as="h3" size="sm" display="flex" alignItems="center" color="white">
                                            <CFaUserTie mr={2} color="#F56565" />
                                            Основная информация
                                        </Heading>
                                        {actor.place_of_work && (
                                            <Text fontSize="md" color="gray.400"><b>Место работы:</b> {actor.place_of_work}</Text>
                                        )}
                                        {actor.time_in_theatre && (
                                            <Text fontSize="md" color="gray.400"><b>В студии:</b> {experience} {yearDeclension(experience)}</Text>
                                        )}
                                        {actor.favorite_writer?.length ? (
                                            <Text fontSize="md" color="gray.400"><b>Любимый писатель:</b> {actor.favorite_writer.join(", ")}</Text>
                                        ) : null}
                                        {actor.favorite_character?.length ? (
                                            <Text fontSize="md" color="gray.400"><b>Любимый персонаж:</b> {actor.favorite_character.join(", ")}</Text>
                                        ) : null}
                                        {actor.favorite_painter?.length ? (
                                            <Text fontSize="md" color="gray.400"><b>Любимый художник:</b> {actor.favorite_painter.join(", ")}</Text>
                                        ) : null}
                                    </VStack>

                                    <VStack align="start">
                                        <Heading as="h3" size="sm" display="flex" alignItems="center" color="white">
                                            <CFaFilm mr={2} color="#F56565" />
                                            Творчество
                                        </Heading>
                                        {actor.perfomances?.length ? (
                                            <Text fontSize="md" color="gray.400"><b>Спектаклей:</b> {actor.perfomances.length} {performanceDeclension(actor.perfomances.length)}</Text>
                                        ) : null}
                                        {actor.favorite_film?.length ? (
                                            <Text fontSize="md" color="gray.400"><b>Любимый фильм:</b> {actor.favorite_film.join(", ")}</Text>
                                        ) : null}
                                        {actor.favorite_piece?.length ? (
                                            <Text fontSize="md" color="gray.400"><b>Любимая пьеса:</b> {actor.favorite_piece.join(", ")}</Text>
                                        ) : null}
                                        {actor.favorite_song?.length ? (
                                            <Text fontSize="md" color="gray.400"><b>Любимая песня:</b> {actor.favorite_song.join(", ")}</Text>
                                        ) : null}
                                        {actor.author_song?.length ? (
                                            <Text fontSize="md" color="gray.400"><b>Автор песни:</b> {actor.author_song.join(", ")}</Text>
                                        ) : null}
                                    </VStack>
                                </Grid>

                                {actor.favorite_quote && (
                                    <Box w="full" mt={4}>
                                        <Heading as="h3" size="sm" mb={3} display="flex" alignItems="center" color="white">
                                            <CFaQuoteLeft mr={2} color="#F56565" />
                                            Любимая цитата
                                        </Heading>
                                        <Text fontStyle="italic" fontSize="md" color="gray.400">"{actor.favorite_quote}"</Text>
                                        {actor.author_quote && (
                                            <Text textAlign="right" mt={2} fontSize="sm" color="gray.400">— {actor.author_quote}</Text>
                                        )}
                                    </Box>
                                )}

                                {actor.perfomances?.length ? (
                                    <Box w="full" mt={6}>
                                        <Heading as="h3" size="sm" mb={3} display="flex" alignItems="center" color="white">
                                            <CFaTheaterMasks mr={2} color="#F56565" />
                                            Роли в спектаклях
                                        </Heading>
                                        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
                                            {actor.perfomances.map((perfomance, idx) => (
                                                <MotionBox
                                                    key={idx}
                                                    p={3}
                                                    border="1px solid"
                                                    borderColor="gray.800"
                                                    borderRadius="md"
                                                    bg="rgba(25, 25, 25, 0.8)"
                                                    cursor="pointer"
                                                    whileHover={{ y: -4, boxShadow: "0 8px 16px rgba(245, 101, 101, 0.3)", scale: 1.02, transition: { duration: 0.2 } }}
                                                    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                                                    onClick={() => handlePerformanceClick(perfomance)}
                                                >
                                                    <Text fontWeight="bold" color="white" fontSize="sm">{perfomance}</Text>
                                                    {actor.role_in_perfomances?.[idx] && (
                                                        <Text fontSize="xs" color="gray.400" mt={1}>Роль: {actor.role_in_perfomances[idx]}</Text>
                                                    )}
                                                </MotionBox>
                                            ))}
                                        </Grid>
                                    </Box>
                                ) : null}
                            </VStack>
                        </GridItem>
                    </Grid>
                </Box>
            </Box>
            <Footer />
        </Box>
    );
};

export default ActorDetail;