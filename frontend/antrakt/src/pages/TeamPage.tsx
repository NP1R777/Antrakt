import React, { useState, useEffect } from "react";
import axios from "axios";
import {
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
import PageFetchError from "../components/PageFetchError";
import { FaTheaterMasks, FaCrown, FaFilm } from "react-icons/fa";
import { ChevronRightIcon, CalendarIcon } from "@chakra-ui/icons";
import { yearDeclension, performanceDeclension } from "../utils/declension";
import { API_URL } from '../config'
import { getImageUrl } from '../utils/imageUrl';

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
    isActive: boolean;
    color: string;
    accentColor: string;
    imageUrl: string;
    teamSection?: 'artistic_director' | 'director';
}

interface ServerDirector {
    id: number;
    name: string;
    description: string;
    perfomances: string[] | null;
    years: number[] | null;
    team_name: string[] | null;
    image_url: string;
    team_section?: 'artistic_director' | 'director';
}

interface ServerActor {
    id: number;
    name: string;
    place_of_work: string;
    time_in_theatre: string;
    is_active: boolean;
    favorite_quote: string;
    author_quote: string;
    perfomances: string[] | null;
    role_in_perfomances: string[] | null;
    image_url: string;
    role_label: "Актёр" | "Актриса";
}

const TeamPage: React.FC = () => {
    const navigate = useNavigate();
    const [directors, setDirectors] = useState<TeamMember[]>([]);
    const [actors, setActors] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Цветовые схемы, унифицированные с Navigation и Footer
    const primaryColor = "#f2f2f2";
    const directorColors = [
        { color: primaryColor, accentColor: "#d9d9d9" },
        { color: "#cfcfcf", accentColor: "#e2e2e2" }
    ];
    const actorColors = [
        { color: primaryColor, accentColor: "#d9d9d9" },
        { color: "#cfcfcf", accentColor: "#e2e2e2" },
        { color: "#8a8a8a", accentColor: "#efefef" },
        { color: "#6f6f6f", accentColor: "#d9d9d9" }
    ];

    // Загрузка данных
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Загрузка режиссёров / худруков
                const directorsRes = await axios.get(`${API_URL}/directors`);
                const transformedDirectors = directorsRes.data.map((director: ServerDirector, index: number) => {
                    const section = director.team_section || 'artistic_director';
                    return {
                        id: director.id,
                        name: director.name,
                        role: section === 'director'
                            ? 'Режиссёр'
                            : 'Художественный руководитель',
                        experience: director.years?.length || 0,
                        productions: director.perfomances?.length || 0,
                        isDirector: true,
                        teamSection: section as 'artistic_director' | 'director',
                        ...directorColors[index % directorColors.length],
                        imageUrl: director.image_url
                    };
                });
                setDirectors(transformedDirectors);

                // Загрузка актеров
                const actorsRes = await axios.get(`${API_URL}/actors`);
                const transformedActors = actorsRes.data.map((actor: ServerActor, index: number) => {
                    const experienceMatch = actor.time_in_theatre.match(/\d+/);
                    const experience = experienceMatch ? parseInt(experienceMatch[0]) : 0;
                    return {
                        id: actor.id,
                        name: actor.name,
                        role: actor.role_label,
                        experience,
                        productions: actor.perfomances?.length || 0,
                        isDirector: false,
                        isActive: actor.is_active !== false,
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
                <Box py={20} px={4} bg="black">
                    <PageFetchError message={error} />
                </Box>
                <Footer />
            </Box>
        );
    }

    const activeActors = actors.filter((a) => a.isActive);
    const departedActors = actors.filter((a) => !a.isActive);
    const artisticDirectors = directors.filter(
        (d) => (d.teamSection || 'artistic_director') === 'artistic_director'
    );
    const stageDirectors = directors.filter((d) => d.teamSection === 'director');

    const renderDirectorCard = (director: TeamMember) => (
        <MotionGridItem
            key={director.id}
            minW="0"
            w="100%"
            maxW="450px"
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
        >
            <MotionBox
                bg="linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.12))"
                borderRadius="xl"
                overflow="hidden"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.15)"
                boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                whileHover={{
                    scale: 1.03,
                    boxShadow: `0 10px 20px rgba(255, 255, 255, 0.12)`,
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.12))",
                    transition: { duration: 0.3 }
                }}
                transition={{
                    duration: 0.3
                }}
                w="100%"
                h="100%"
                display="flex"
                flexDirection="column"
            >
                <Box position="relative">
                    <Image
                        src={getImageUrl(director.imageUrl)}
                        alt={director.name}
                        fallbackSrc={getImageUrl()}
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
                        _hover={{ color: "#e2e2e2", borderColor: "#e2e2e2" }}
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
    );

    const renderDirectorSection = (title: string, members: TeamMember[], isFirstVisible: boolean) => {
        if (members.length === 0) {
            return null;
        }

        return (
            <MotionBox
                mt={isFirstVisible ? 0 : 16}
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
                    {title}
                </Heading>

                <MotionGrid
                    templateColumns={{
                        base: "1fr",
                        md: members.length === 1
                            ? "minmax(260px, 450px)"
                            : "repeat(2, minmax(260px, 450px))"
                    }}
                    gap={8}
                    justifyContent="center"
                    justifyItems="center"
                    w="100%"
                    maxW="960px"
                    mx="auto"
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
                    {members.map(renderDirectorCard)}
                </MotionGrid>
            </MotionBox>
        );
    };

    const renderActorCard = (actor: TeamMember) => (
        <MotionGridItem
            key={actor.id}
            minW="0"
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
                    boxShadow: `0 10px 20px rgba(255, 255, 255, 0.12)`,
                    background: "linear-gradient(135deg, rgba(25, 25, 25, 0.8), rgba(255, 255, 255, 0.07))",
                    transition: { duration: 0.3 }
                }}
                transition={{ duration: 0.3 }}
                h="100%"
                display="flex"
                flexDirection="column"
            >
                <Box position="relative">
                    <Image
                        src={getImageUrl(actor.imageUrl)}
                        alt={actor.name}
                        fallbackSrc={getImageUrl()}
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
                        _hover={{ color: "#e2e2e2", borderColor: "#e2e2e2" }}
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
    );

    return (
        <Box minH="100vh" bg="black" display="flex" flexDirection="column" overflowX="hidden">
            <Navigation />

            <Box
                flex="1"
                py={{ base: 12, md: 20 }}
                px={{ base: 4, md: 8 }}
                position="relative"
                overflow="hidden"
            >
                {/* Декоративный элемент */}
                <MotionBox
                    position="absolute"
                    top="-10%"
                    right="-10%"
                    w="400px"
                    h="400px"
                    bg="linear-gradient(135deg, #2a2a2a, #151515)"
                    borderRadius="full"
                    filter="blur(80px)"
                    opacity={0.2}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
                    pointerEvents="none"
                />

                <Container
                    maxW="container.xl"
                    position="relative"
                    zIndex="1"
                    px={{ base: 0, md: 4 }}
                >
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

                    {renderDirectorSection(
                        'Художественные руководители',
                        artisticDirectors,
                        true
                    )}
                    {renderDirectorSection(
                        'Режиссёры',
                        stageDirectors,
                        artisticDirectors.length === 0
                    )}

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
                            {activeActors.map(renderActorCard)}
                        </MotionGrid>
                    </MotionBox>

                    {/* Секция выбывших актёров */}
                    {departedActors.length > 0 && (
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
                                Выбывшие актёры
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
                                {departedActors.map(renderActorCard)}
                            </MotionGrid>
                        </MotionBox>
                    )}
                </Container>
            </Box>

            <Footer />
        </Box>
    );
};

export default TeamPage;