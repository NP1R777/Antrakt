import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Alert,
    AlertIcon,
    AlertDescription,
    AlertTitle,
    Box,
    Grid,
    GridItem,
    VStack,
    Text,
    Heading,
    Flex,
    Button,
    Image,
    Container,
    chakra,
    Spinner
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { FaTheaterMasks, FaCrown, FaFilm } from "react-icons/fa";
import { ChevronRightIcon, CalendarIcon } from "@chakra-ui/icons";
import { yearDeclension, performanceDeclension } from "../utils/declension";

// Стилизованные компоненты для иконок
const CFaTheaterMasks = chakra(FaTheaterMasks as any);
const CFaCrown = chakra(FaCrown as any);
const CFaFilm = chakra(FaFilm as any);

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);

interface TeamMember {
    id: number;
    name: string;
    role: string;
    experience: number;
    productions: number;
    isDirector: boolean;
    color: string;
    accentColor: string;
    imageUrl: string;
}

interface ServerDirector {
    id: number;
    name: string;
    description: string;
    perfomances: string[] | null;
    years: number[] | null;
    team_name: string[] | null;
    image_url: string;
}

interface ServerActor {
    id: number;
    name: string;
    place_of_work: string;
    time_in_theatre: string;
    favorite_quote: string;
    author_quote: string;
    perfomances: string[] | null;
    role_in_perfomances: string[] | null;
    image_url: string;
}

const TeamPage: React.FC = () => {
    const navigate = useNavigate();
    const [directors, setDirectors] = useState<TeamMember[]>([]);
    const [actors, setActors] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Цветовые схемы, унифицированные с Navigation и Footer
    const primaryColor = "#800020";
    const directorColors = [
        { color: primaryColor, accentColor: "#F56565" },
        { color: "#E53E3E", accentColor: "#FC8181" }
    ];
    const actorColors = [
        { color: primaryColor, accentColor: "#F56565" },
        { color: "#E53E3E", accentColor: "#FC8181" },
        { color: "#9B2C2C", accentColor: "#FEB2B2" },
        { color: "#742A2A", accentColor: "#F56565" }
    ];

    // Загрузка данных
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Загрузка режиссеров
                const directorsRes = await axios.get("http://localhost:8000/directors");
                const transformedDirectors = directorsRes.data.map((director: ServerDirector, index: number) => ({
                    id: director.id,
                    name: director.name,
                    role: "Режиссёр",
                    experience: director.years?.length || 0,
                    productions: director.perfomances?.length || 0,
                    isDirector: true,
                    ...directorColors[index % directorColors.length],
                    imageUrl: director.image_url
                }));
                setDirectors(transformedDirectors);

                // Загрузка актеров
                const actorsRes = await axios.get("http://localhost:8000/actors");
                const transformedActors = actorsRes.data.map((actor: ServerActor, index: number) => {
                    const experienceMatch = actor.time_in_theatre.match(/\d+/);
                    const experience = experienceMatch ? parseInt(experienceMatch[0]) : 0;
                    const isFemale = actor.name.match(/[ая]$/i);
                    return {
                        id: actor.id,
                        name: actor.name,
                        role: isFemale ? "Актриса" : "Актер",
                        experience,
                        productions: actor.perfomances?.length || 0,
                        isDirector: false,
                        ...actorColors[index % actorColors.length],
                        imageUrl: actor.image_url
                    };
                });
                setActors(transformedActors);
            } catch (err) {
                setError("Ошибка загрузки данных команды");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="100vh" bg="black">
                <Spinner size="xl" color={primaryColor} />
            </Flex>
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
                        <Button mt={4} colorScheme="red" size="sm" onClick={() => window.location.reload()}>
                            Повторить попытку
                        </Button>
                    </Alert>
                </Box>
                <Footer />
            </Box>
        );
    }

    return (
        <Box minH="100vh" bg="black" display="flex" flexDirection="column" overflowY="hidden">
            <Navigation />

            <Box flex="1" py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }} position="relative">
                {/* Декоративный элемент */}
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
                    {/* Заголовок страницы */}
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        mb={16}
                        textAlign="center"
                    >
                        <Heading
                            as="h1"
                            fontSize={{ base: "2xl", md: "3xl" }}
                            color="white"
                            mb={4}
                            position="relative"
                            display="inline-block"
                            _after={{
                                content: '""',
                                position: "absolute",
                                bottom: "-10px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "80px",
                                height: "4px",
                                bg: primaryColor,
                                borderRadius: "full"
                            }}
                        >
                            Наша Команда
                        </Heading>
                        <Text fontSize="md" color="gray.400" maxW="2xl" mx="auto" mt={8}>
                            Профессионалы, создающие магию театра каждый день
                        </Text>
                    </MotionBox>

                    {/* Секция режиссеров */}
                    <MotionBox
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Heading
                            as="h2"
                            fontSize={{ base: "xl", md: "2xl" }}
                            color="white"
                            mb={8}
                            textAlign="center"
                            position="relative"
                            _after={{
                                content: '""',
                                position: "absolute",
                                bottom: "-10px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "60px",
                                height: "3px",
                                bg: primaryColor,
                                borderRadius: "full"
                            }}
                        >
                            Художественные руководители
                        </Heading>

                        <MotionGrid
                            templateColumns={{
                                base: "1fr",
                                md: directors.length === 1 ? "minmax(260px, 450px)" : "repeat(2, 1fr)"
                            }}
                            gap={8}
                            justifyContent="center" // Центрирование карточек
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.2 }
                                }
                            }}
                        >
                            {directors.map((director) => (
                                <MotionGridItem
                                    key={director.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                                    }}
                                >
                                    <MotionBox
                                        bg="linear-gradient(135deg, rgba(97, 0, 24, 0.31), rgba(245, 101, 101, 0.1))" // Градиентный фон
                                        borderRadius="xl"
                                        overflow="hidden"
                                        border="1px solid"
                                        borderColor="rgba(128, 0, 11, 0.73)" // Градиентная граница
                                        boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                                        whileHover={{
                                            scale: 1.03,
                                            boxShadow: `0 10px 20px rgba(245, 101, 101, 0.3)`,
                                            background: "linear-gradient(135deg, rgba(128, 0, 32, 0.4), rgba(245, 101, 101, 0.2))",
                                            transition: { duration: 0.3 }
                                        }}
                                        transition={{
                                            duration: 0.3
                                        }}
                                        maxWidth="450px" // Уменьшение ширины карточки
                                        h="100%"
                                        display="flex"
                                        flexDirection="column"
                                    >
                                        <Box position="relative">
                                            <Image
                                                src={director.imageUrl}
                                                alt={director.name}
                                                width="100%"
                                                height="auto"
                                                maxHeight="300px"
                                                objectFit="contain"
                                                transition="all 0.5s ease"
                                            />
                                            <Box
                                                position="absolute"
                                                bottom={0}
                                                left={0}
                                                right={0}
                                                h="40%"
                                                bgGradient="linear(to-t, rgba(0,0,0,0.9), transparent)"
                                            />
                                            <Box position="absolute" bottom={5} left={5} right={5}>
                                                <Heading as="h3" size="md" color="white">
                                                    {director.name}
                                                </Heading>
                                                <Text color="whiteAlpha.800" fontSize="sm">
                                                    {director.role}
                                                </Text>
                                            </Box>
                                        </Box>
                                        <Box p={8} flex="1">
                                            <Flex align="center" mb={4}>
                                                <CFaFilm mr={2} color={director.accentColor} />
                                                <Text color="gray.400" fontSize="sm">
                                                    {director.productions} {performanceDeclension(director.productions)}
                                                </Text>
                                            </Flex>
                                            <Button
                                                variant="outline"
                                                color={primaryColor}
                                                _hover={{ color: "#FC8181", borderColor: "#FC8181" }}
                                                size="sm"
                                                rightIcon={<ChevronRightIcon />}
                                                w="full"
                                                fontSize="sm"
                                                onClick={() => navigate(`/director/${director.id}`)}
                                            >
                                                Подробнее
                                            </Button>
                                        </Box>
                                    </MotionBox>
                                </MotionGridItem>
                            ))}
                        </MotionGrid>
                    </MotionBox>

                    {/* Секция актеров */}
                    <MotionBox
                        mt={16}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Heading
                            as="h2"
                            fontSize={{ base: "xl", md: "2xl" }}
                            color="white"
                            mb={8}
                            textAlign="center"
                            position="relative"
                            _after={{
                                content: '""',
                                position: "absolute",
                                bottom: "-10px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "60px",
                                height: "3px",
                                bg: primaryColor,
                                borderRadius: "full"
                            }}
                        >
                            Наши Актёры
                        </Heading>

                        <MotionGrid
                            templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                            gap={8}
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.1 }
                                }
                            }}
                        >
                            {actors.map((actor) => (
                                <MotionGridItem
                                    key={actor.id}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.8 },
                                        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
                                    }}
                                >
                                    <MotionBox
                                        bg="rgba(25, 25, 25, 0.8)"
                                        borderRadius="xl"
                                        overflow="hidden"
                                        border="1px solid"
                                        borderColor="gray.800"
                                        boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                                        whileHover={{
                                            scale: 1.03,
                                            boxShadow: `0 10px 20px rgba(245, 101, 101, 0.3)`,
                                            background: "linear-gradient(135deg, rgba(25, 25, 25, 0.8), rgba(128, 0, 32, 0.1))",
                                            transition: { duration: 0.3 }
                                        }}
                                        transition={{
                                            duration: 0.3
                                        }}
                                        h="100%"
                                        display="flex"
                                        flexDirection="column"
                                    >
                                        <Box position="relative">
                                            <Image
                                                src={actor.imageUrl}
                                                alt={actor.name}
                                                width="100%"
                                                height="auto"
                                                maxHeight="300px"
                                                objectFit="contain"
                                                transition="all 0.5s ease"
                                            />
                                            <Box
                                                position="absolute"
                                                bottom={0}
                                                left={0}
                                                right={0}
                                                h="40%"
                                                bgGradient="linear(to-t, rgba(0,0,0,0.9), transparent)"
                                            />
                                            <Box position="absolute" bottom={5} left={5} right={5}>
                                                <Heading as="h3" size="md" color="white">
                                                    {actor.name}
                                                </Heading>
                                                <Text color="whiteAlpha.800" fontSize="sm">
                                                    {actor.role}
                                                </Text>
                                            </Box>
                                        </Box>
                                        <Box p={8} flex="1">
                                            <Flex align="center" mb={4}>
                                                <CalendarIcon mr={2} color={actor.accentColor} />
                                                <Text color="gray.400" fontSize="sm">
                                                    В студии: {actor.experience} {yearDeclension(actor.experience)}
                                                </Text>
                                            </Flex>
                                            <Flex align="center" mb={4}>
                                                <CFaFilm mr={2} color={actor.accentColor} />
                                                <Text color="gray.400" fontSize="sm">
                                                    Сыграно: {actor.productions} {performanceDeclension(actor.productions)}
                                                </Text>
                                            </Flex>
                                            <Button
                                                variant="outline"
                                                color={primaryColor}
                                                _hover={{ color: "#FC8181", borderColor: "#FC8181" }}
                                                size="sm"
                                                rightIcon={<ChevronRightIcon />}
                                                w="full"
                                                fontSize="sm"
                                                onClick={() => navigate(`/actor/${actor.id}`)}
                                            >
                                                Подробнее
                                            </Button>
                                        </Box>
                                    </MotionBox>
                                </MotionGridItem>
                            ))}
                        </MotionGrid>
                    </MotionBox>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
};

export default TeamPage;