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
    AlertDescription
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { ChevronRightIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);

interface Performance {
    id: number;
    title: string;
    author: string;
    premiere_date: string | null;
    perfomances_image: string | null;
    afisha: boolean;
}

const PerformancesPage: React.FC = () => {
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPerformances = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8000/perfomances");
                const pastPerformances = response.data.filter((perf: Performance) => perf.afisha === true);
                setPerformances(pastPerformances);
            } catch (err) {
                setError("Ошибка загрузки данных спектаклей");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformances();
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
            <Box flex="1" py={20} px={{ base: 4, md: 8 }} position="relative">
                {/* Декоративный элемент */}
                <MotionBox
                    position="absolute"
                    top="-10%"
                    right="-10%"
                    w="400px"
                    h="400px"
                    bg="linear-gradient(135deg, #800020, #400010)"
                    borderRadius="full"
                    filter="blur(80px)"
                    opacity={0.2}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
                />

                <Box maxW="container.xl" mx="auto" position="relative" zIndex="1" overflowX="hidden">
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        mb={12}
                        textAlign="center"
                    >
                        <Heading as="h1" fontSize={{ base: "2xl", md: "3xl" }} color="white" mb={4}>
                            Прошедшие спектакли
                        </Heading>
                        <Text fontSize="md" color="gray.400" maxW="2xl" mx="auto">
                            Архив наших постановок, наполненных эмоциями и искусством
                        </Text>
                    </MotionBox>

                    {performances.length > 0 ? (
                        <MotionGrid
                            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                            gap={8}
                            maxWidth="100%"
                            overflowX="hidden"
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
                            {performances.map((performance) => (
                                <MotionGridItem
                                    key={performance.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                                    }}
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
                                        onClick={() => navigate(`/performance/${performance.id}`)}
                                        cursor="pointer"
                                        maxWidth="100%"
                                    >
                                        <Image
                                            src={performance.perfomances_image || "/placeholder-image.jpg"}
                                            alt={performance.title}
                                            height="200px"
                                            objectFit="cover"
                                            fallbackSrc="/placeholder-image.jpg"
                                            w="100%"
                                        />
                                        <Box p={6}>
                                            <Heading as="h3" size="md" color="white" mb={2}>
                                                {performance.title}
                                            </Heading>
                                            <Text color="gray.400" fontSize="sm" mb={2}>
                                                Автор: {performance.author || "Неизвестен"}
                                            </Text>
                                            <Text color="gray.400" fontSize="sm">
                                                Премьера: {performance.premiere_date ? new Date(performance.premiere_date).toLocaleDateString() : "Дата неизвестна"}
                                            </Text>
                                        </Box>
                                    </MotionBox>
                                </MotionGridItem>
                            ))}
                        </MotionGrid>
                    ) : (
                        <Text color="gray.400" textAlign="center">
                            Нет данных о прошедших спектаклях
                        </Text>
                    )}
                </Box>
            </Box>
            <Footer />
        </Box>
    );
};

export default PerformancesPage;