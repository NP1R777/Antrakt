import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Container
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { ChevronRightIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);
const MotionText = motion(Text);
const MotionImage = motion(Image);
const MotionHeading = motion(Heading);

interface ArchiveProject {
    id: number;
    title: string;
    author: string;
    premiere_date: string | null;
    performances_image: string | null;
    afisha: boolean;
    age_limit: string;
}

const ArchivePage: React.FC = () => {
    const [projects, setProjects] = useState<ArchiveProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8000/archive"); // Предполагаемый endpoint для архива
                const pastProjects = response.data.filter((proj: ArchiveProject) => proj.afisha === false);
                setProjects(pastProjects);
            } catch (err) {
                setError("Ошибка загрузки данных архива");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

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

    return (
        <Box bg="black" minH="100vh" display="flex" flexDirection="column" overflowX="hidden">
            <Navigation />
            <Box flex="1" py={20} position="relative" px={{ base: 4, md: 8 }}>
                {/* Декоративные элементы из NewsPage.tsx */}
                <MotionBox
                    position="absolute"
                    top="-10%"
                    left="-10%"
                    w="400px"
                    h="400px"
                    bg="linear-gradient(135deg, #800020, #40001010)"
                    borderRadius="full"
                    filter="blur(80px)"
                    opacity={0.2}
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                />

                <MotionBox
                    position="absolute"
                    bottom="-10%"
                    right="-10%"
                    w="300px"
                    h="300px"
                    bg="linear-gradient(135deg, #800020, #40001010)"
                    borderRadius="full"
                    filter="blur(80px)"
                    opacity={0.15}
                    animate={{ scale: [1, 1.05, 1], rotate: [0, -5, 0] }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                />

                <Container
                    maxW="container.xl"
                    position="relative"
                    zIndex="1"
                    px={{ base: 0, md: 4 }}
                >
                    <MotionBox
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 1,
                            ease: "easeOut"
                        }}
                        mb={12}
                        textAlign="center"
                        px={{ base: 4, md: 0 }}
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
                                bg: "#800020",
                                borderRadius: "full"
                            }}
                        >
                            Архив проектов
                        </Heading>
                        <MotionText
                            fontSize="md"
                            color="gray.400"
                            maxW="2xl"
                            mx="auto"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                opacity: { duration: 0.8, delay: 0.2, ease: "easeOut" },
                                y: { duration: 0.8, delay: 0.2, ease: "easeOut" },
                            }}
                        >
                            Погрузитесь в историю наших постановок и творческих свершений
                        </MotionText>
                    </MotionBox>

                    {projects.length > 0 ? (
                        <MotionGrid
                            templateColumns={{
                                base: "1fr",
                                md: "repeat(2, minmax(0, 1fr))",
                                lg: "repeat(3, minmax(0, 1fr))"
                            }}
                            gap={{ base: 6, md: 8 }}
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
                                }
                            }}
                            width="100%"
                        >
                            {projects.map((project) => (
                                <MotionGridItem
                                    key={project.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 50, scale: 0.9 },
                                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, type: "spring", stiffness: 100 } }
                                    }}
                                    minW="0"
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(245, 101, 101, 0.4)" }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <MotionBox
                                        as="div"
                                        bg="linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(64, 0, 16, 0.3))"
                                        borderRadius="xl"
                                        overflow="hidden"
                                        border="1px solid"
                                        borderColor="rgba(64, 0, 16, 0.7)"
                                        boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                                        display="flex"
                                        flexDirection="column"
                                        h="100%"
                                        cursor="pointer"
                                        onClick={() => navigate(`/archive/${project.id}`)}
                                    >
                                        <MotionImage
                                            src={project.performances_image || "/placeholder-image.jpg"}
                                            alt={project.title}
                                            height="250px"
                                            objectFit="cover"
                                            fallbackSrc="/placeholder-image.jpg"
                                            w="100%"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{
                                                duration: 0.8,
                                                delay: 0.2,
                                                ease: "easeOut"
                                            }}
                                        />
                                        <Box
                                            p={6}
                                            flex="1"
                                            display="flex"
                                            flexDirection="column"
                                            justifyContent="space-between"
                                        >
                                            <Box>
                                                <MotionHeading
                                                    as="h3"
                                                    size="md"
                                                    color="white"
                                                    mb={2}
                                                    noOfLines={1}
                                                    initial={{ y: 5, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: 0.2,
                                                        ease: "easeOut"
                                                    }}
                                                >
                                                    {project.title}
                                                </MotionHeading>
                                                <MotionText
                                                    color="gray.400"
                                                    fontSize="sm"
                                                    mb={2}
                                                    noOfLines={1}
                                                    initial={{ y: 5, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: 0.3,
                                                        ease: "easeOut"
                                                    }}
                                                >
                                                    Автор: {project.author || "Неизвестен"}
                                                </MotionText>
                                                <MotionText
                                                    color="gray.400"
                                                    fontSize="sm"
                                                    noOfLines={1}
                                                    initial={{ y: 5, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: 0.4,
                                                        ease: "easeOut"
                                                    }}
                                                >
                                                    Премьера: {project.premiere_date ? new Date(project.premiere_date).toLocaleDateString() : "Дата неизвестна"}
                                                </MotionText>
                                                <MotionText
                                                    color="gray.400"
                                                    fontSize="sm"
                                                    noOfLines={1}
                                                    initial={{ y: 5, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: 0.5,
                                                        ease: "easeOut"
                                                    }}
                                                >
                                                    Возрастное ограничение: {project.age_limit}
                                                </MotionText>
                                            </Box>
                                            <MotionBox
                                                whileHover={{ scale: 1.1, color: "#F56565" }}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: "easeOut"
                                                }}
                                                mt={4}
                                            >
                                                <ChevronRightIcon boxSize={6} color="white" />
                                            </MotionBox>
                                        </Box>
                                    </MotionBox>
                                </MotionGridItem>
                            ))}
                        </MotionGrid>
                    ) : (
                        <MotionText
                            color="gray.400"
                            textAlign="center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                ease: "easeOut"
                            }}
                        >
                            Нет данных об архивных проектах
                        </MotionText>
                    )}
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default ArchivePage;