import { Box, Heading, Grid, GridItem, Text, Button, Image, Flex, Spinner, Center, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);

// Интерфейс для данных спектакля
interface Performance {
    id: number;
    title: string;
    image_url: string;
    description: string;
    genre: string;
    age_limit: string;
    duration: string;
}

export default function Performances() {
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    useEffect(() => {
        const fetchPerformances = async () => {
            try {
                const response = await axios.get<Performance[]>("http://localhost:8000/afisha");
                setPerformances(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error("Ошибка при загрузке спектаклей:", err);
                setError("Не удалось загрузить данные спектаклей");
                setIsLoading(false);

                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить данные спектаклей",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchPerformances();
    }, []);

    return (
        <Box
            py={20}
            bg="black"
            position="relative"
            overflow="hidden"
            id="performances"
            minH="80vh"
        >
            {/* Декоративный элемент */}
            <MotionBox
                position="absolute"
                top="-50%"
                right="-10%"
                w="600px"
                h="600px"
                bg="brand.700"
                borderRadius="full"
                filter="blur(100px)"
                opacity={0.2}
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            <Box
                maxW="container.xl"
                mx="auto"
                px={{ base: 4, md: 8 }}
                position="relative"
                zIndex="1"
            >
                {/* Заголовок секции */}
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    mb={16}
                    textAlign="center"
                >
                    <Heading
                        as="h2"
                        fontSize={{ base: "3xl", md: "4xl" }}
                        color="white"
                        mb={4}
                    >
                        Текущие спектакли
                    </Heading>
                    <Text color="gray.400" maxW="2xl" mx="auto">
                        В нашем репертуаре только лучшие постановки классических и современных пьес
                    </Text>
                </MotionBox>

                {/* Состояния загрузки и ошибок */}
                {isLoading ? (
                    <Center py={20}>
                        <Spinner size="xl" color="brand.500" thickness="4px" />
                    </Center>
                ) : error ? (
                    <Center py={10}>
                        <Text color="red.400" fontSize="xl">
                            {error}
                        </Text>
                    </Center>
                ) : performances.length === 0 ? (
                    <Center py={10}>
                        <Text color="gray.400" fontSize="xl">
                            Нет доступных спектаклей
                        </Text>
                    </Center>
                ) : (
                    // Сетка карточек
                    <Grid
                        templateColumns={{
                            base: "repeat(1, 1fr)",
                            md: "repeat(2, 1fr)",
                            lg: "repeat(3, 1fr)"
                        }}
                        gap={10}
                    >
                        {performances.map((performance) => (
                            <MotionGridItem
                                key={performance.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5 }}
                            >
                                <PerformanceCard performance={performance} />
                            </MotionGridItem>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
}

function PerformanceCard({ performance }: { performance: Performance }) {
    return (
        <MotionBox
            bg="rgba(30, 30, 30, 0.8)"
            borderRadius="xl"
            overflow="hidden"
            border="1px solid"
            borderColor="brand.800"
            boxShadow="0 10px 30px rgba(128, 0, 32, 0.1)"
            whileHover={{
                y: -10,
                boxShadow: "0 15px 40px rgba(128, 0, 32, 0.3)"
            }}
            transition={{ duration: 0.3 }}
        >
            {/* Изображение спектакля */}
            <Box
                h="300px"
                overflow="hidden"
                position="relative"
            >
                <Image
                    src={performance.image_url || "/images/placeholder.jpg"}
                    alt={performance.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    transition="transform 0.5s ease"
                    _groupHover={{ transform: "scale(1.05)" }}
                    fallback={
                        <Center h="100%" bg="gray.700">
                            <Text color="gray.400">Изображение отсутствует</Text>
                        </Center>
                    }
                />

                {/* Наложение */}
                <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    w="100%"
                    h="50%"
                    bgGradient="linear(to-t, rgba(0,0,0,0.8), transparent)"
                />
            </Box>

            {/* Контент карточки */}
            <Box p={6}>
                <Heading
                    as="h3"
                    fontSize="xl"
                    color="white"
                    mb={3}
                >
                    {performance.title}
                </Heading>

                <Text color="brand.300" mb={2} fontSize="sm">
                    Жанр: {performance.genre}
                </Text>

                <Text color="brand.300" mb={4} fontSize="sm">
                    Возрастное ограничение: {performance.age_limit}
                </Text>

                <Flex justify="space-between" align="center">
                    <Text color="gray.500" fontSize="sm">
                        {performance.duration}
                    </Text>

                    <Button
                        as={RouterLink}
                        to={`/performance/${performance.id}`}
                        variant="theater"
                        size="md"
                        rightIcon={<span>→</span>}
                        _hover={{
                            transform: "translateX(5px)",
                            bg: "brand.700"
                        }}
                        transition="all 0.2s"
                    >
                        Подробнее
                    </Button>
                </Flex>
            </Box>
        </MotionBox>
    );
}