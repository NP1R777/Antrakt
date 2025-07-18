import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Heading,
    Text,
    Image,
    Flex,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Container,
    Grid,
    GridItem
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);

interface ArchiveProject {
    id: number;
    title: string;
    author: string;
    premiere_date: string | null;
    archive_image: string | null;
    afisha: boolean;
    age_limit: string;
}

const ArchivePage: React.FC = () => {
    const [projects, setProjects] = useState<ArchiveProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const primaryColor = "#800020";
    const darkBg = "#0a0a0a";
    const lightText = "#ffffff";
    const grayText = "#a0a0a0";

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8000/archive");
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
        <Box bg={darkBg} minH="100vh" display="flex" flexDirection="column" overflowX="hidden">
            <Navigation />

            <Box flex="1" py={20} position="relative" px={{ base: 4, md: 8 }}>
                {/* Декоративные элементы */}
                <MotionBox
                    position="absolute"
                    top="-10%"
                    left="-10%"
                    w="400px"
                    h="400px"
                    bg="linear-gradient(135deg, #800020, #400010)"
                    borderRadius="full"
                    filter="blur(80px)"
                    opacity={0.2}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
                />

                <MotionBox
                    position="absolute"
                    bottom="-10%"
                    right="-10%"
                    w="300px"
                    h="300px"
                    bg="linear-gradient(135deg, #800020, #400010)"
                    borderRadius="full"
                    filter="blur(80px)"
                    opacity={0.15}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                />

                <Container
                    maxW="container.xl"
                    position="relative"
                    zIndex="1"
                    px={{ base: 0, md: 4 }}
                >
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        mb={12}
                        textAlign="center"
                        px={{ base: 4, md: 0 }}
                    >
                        <Heading
                            as="h1"
                            fontSize={{ base: "2xl", md: "3xl" }}
                            color={lightText}
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
                            Архив проектов
                        </Heading>
                        <Text fontSize="md" color={grayText} maxW="2xl" mx="auto">
                            История наших творческих свершений и постановок
                        </Text>
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
                                    transition: { staggerChildren: 0.2 }
                                }
                            }}
                            width="100%"
                        >
                            {projects.map((project) => (
                                <MotionGridItem
                                    key={project.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                                    }}
                                    minW="0"
                                >
                                    <MotionBox
                                        as="div"
                                        bg="linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(64, 0, 16, 0.3))"
                                        borderRadius="xl"
                                        overflow="hidden"
                                        border="1px solid"
                                        borderColor="rgba(64, 0, 16, 0.7)"
                                        boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                                        whileHover={{
                                            scale: 1.05,
                                            boxShadow: "0 10px 25px rgba(245, 101, 101, 0.4)",
                                            transition: { duration: 0.3 }
                                        }}
                                        cursor="pointer"
                                        display="flex"
                                        flexDirection="column"
                                        h="100%"
                                        onClick={() => navigate(`/archive/${project.id}`)}
                                    >
                                        <Image
                                            src={project.archive_image || "/placeholder-image.jpg"}
                                            alt={project.title}
                                            height="300px"
                                            objectFit="cover"
                                            fallbackSrc="/placeholder-image.jpg"
                                            w="100%"
                                        />

                                        <Box
                                            p={6}
                                            flex="1"
                                            display="flex"
                                            flexDirection="column"
                                            justifyContent="space-between"
                                        >
                                            <Box>
                                                <Text
                                                    color={primaryColor}
                                                    fontSize="sm"
                                                    mb={2}
                                                    fontWeight="medium"
                                                >
                                                    {project.premiere_date ?
                                                        new Date(project.premiere_date).toLocaleDateString() :
                                                        "Дата неизвестна"}
                                                </Text>

                                                <Heading as="h3" size="md" color={lightText} mb={3} noOfLines={1}>
                                                    {project.title}
                                                </Heading>

                                                <Text
                                                    color={grayText}
                                                    fontSize="sm"
                                                    noOfLines={1}
                                                >
                                                    Возрастное ограничение: {project.age_limit}
                                                </Text>
                                            </Box>
                                        </Box>
                                    </MotionBox>
                                </MotionGridItem>
                            ))}
                        </MotionGrid>
                    ) : (
                        <Text color="gray.400" textAlign="center">
                            Нет данных об архивных проектах
                        </Text>
                    )}
                </Container>
            </Box>

            <Footer />
        </Box>
    );
};

export default ArchivePage;