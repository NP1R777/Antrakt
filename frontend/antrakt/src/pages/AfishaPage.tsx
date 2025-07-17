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

interface Performance {
    id: number;
    title: string;
    genre: string;
    age_limit: string;
    the_cast: string[];
    description: string;
    afisha: boolean;
    image_url: string | null;
}

const AfishaPage: React.FC = () => {
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPerformances = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8000/afisha");
                const afishaPerformances = response.data.filter((perf: Performance) => perf.afisha === true);
                setPerformances(afishaPerformances);
            } catch (err) {
                setError("Ошибка загрузки данных афиши");
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
                    <Spinner size="xl" color="#800020" />
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
                {/* Декоративный элемент */}
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
                            Афиша
                        </Heading>
                        <Text fontSize="md" color="gray.400" maxW="2xl" mx="auto">
                            Актуальные постановки, ждущие вашего внимания
                        </Text>
                    </MotionBox>

                    {performances.length > 0 ? (
                        <MotionGrid
                            templateColumns={{
                                base: "1fr",
                                md: "repeat(3, minmax(0, 1fr))",
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
                            {performances.map((performance) => (
                                <MotionGridItem
                                    key={performance.id}
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
                                            boxShadow: "0 10px 25px rgba(128, 0, 32, 0.4)",
                                            transition: { duration: 0.3 }
                                        }}
                                        onClick={() => navigate(`/afisha/${performance.id}`)}
                                        cursor="pointer"
                                        display="flex"
                                        flexDirection="column"
                                        h="100%"
                                    >
                                        <Box position="relative" h="400px">
                                            <Image
                                                src={performance.image_url || "/placeholder-image.jpg"}
                                                alt={performance.title}
                                                h="100%"
                                                w="100%"
                                                objectFit="contain"
                                                fallbackSrc="/placeholder-image.jpg"
                                            />
                                            <Box
                                                position="absolute"
                                                bottom="0"
                                                left="0"
                                                right="0"
                                                bgGradient="linear(to-t, rgba(0, 0, 0, 0.8), transparent)"
                                                p={4}
                                                color="white"
                                                fontWeight="bold"
                                                fontSize="lg"
                                                textAlign="center"
                                            >
                                                {performance.title} ({performance.age_limit})
                                            </Box>
                                        </Box>
                                    </MotionBox>
                                </MotionGridItem>
                            ))}
                        </MotionGrid>
                    ) : (
                        <Text color="gray.400" textAlign="center">
                            Нет данных об афише
                        </Text>
                    )}
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default AfishaPage;