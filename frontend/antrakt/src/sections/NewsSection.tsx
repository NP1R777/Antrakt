import { Box, Heading, Grid, GridItem, Text, Button, Image, Flex, Tag, Spinner, Center, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);

// Интерфейс для новостей
interface NewsItem {
    id: number;
    title: string;
    image_url: string;
    summary: string;
    date_publish: string;
    description: string;
}

export default function NewsSection() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get<NewsItem[]>("http://localhost:8000/news");
                setNews(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error("Ошибка при загрузке новостей:", err);
                setError("Не удалось загрузить новости");
                setIsLoading(false);

                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить данные новостей",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchNews();
    }, []);

    // Функция для форматирования даты
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        return date.toLocaleDateString('ru-RU', options);
    };

    return (
        <Box py={20} bg="black" position="relative" overflow="hidden" id="news">
            {/* Декоративный элемент */}
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

            <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} position="relative" zIndex="1">
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
                            bg: "#F56565",
                            borderRadius: "full"
                        }}
                    >
                        Новости студии
                    </Heading>
                    <Text color="gray.400" maxW="2xl" mx="auto" mt={8}>
                        Следите за последними событиями, премьерами и мероприятиями нашей театральной студии
                    </Text>
                </MotionBox>

                {/* Состояния загрузки и ошибок */}
                {isLoading ? (
                    <Center py={20}>
                        <Spinner size="xl" color="#F56565" thickness="4px" />
                    </Center>
                ) : error ? (
                    <Center py={10}>
                        <Text color="red.400" fontSize="xl">
                            {error}
                        </Text>
                    </Center>
                ) : news.length === 0 ? (
                    <Center py={10}>
                        <Text color="gray.400" fontSize="xl">
                            Нет доступных новостей
                        </Text>
                    </Center>
                ) : (
                    <>
                        {/* Сетка новостей */}
                        <Grid
                            templateColumns={{
                                base: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)"
                            }}
                            gap={8}
                        >
                            {news.map((item) => (
                                <MotionGridItem
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <NewsCard news={item} formatDate={formatDate} />
                                </MotionGridItem>
                            ))}
                        </Grid>

                        {/* Кнопка "Все новости" */}
                        <Flex justify="center" mt={12}>
                            <Button
                                as={RouterLink}
                                to="/news"
                                variant="theater"
                                size="lg"
                                px={10}
                                py={6}
                                fontSize="lg"
                                rightIcon={<span>→</span>}
                                _hover={{
                                    transform: "translateX(5px)",
                                    boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)"
                                }}
                                transition="all 0.3s"
                            >
                                Все новости
                            </Button>
                        </Flex>
                    </>
                )}
            </Box>
        </Box>
    );
}

function NewsCard({ news, formatDate }: { news: NewsItem; formatDate: (date: string) => string }) {
    return (
        <MotionBox
            bg="rgba(25, 25, 25, 0.8)"
            borderRadius="xl"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.800"
            boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
            whileHover={{
                y: -8,
                borderColor: "#F56565",
                boxShadow: "0 15px 30px rgba(128, 0, 32, 0.3)"
            }}
            transition={{ duration: 0.3 }}
            h="100%"
            display="flex"
            flexDirection="column"
        >
            <Box h="200px" overflow="hidden" position="relative">
                {news.image_url ? (
                    <Image
                        src={news.image_url}
                        alt={news.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        transition="transform 0.5s ease"
                        _hover={{ transform: "scale(1.05)" }}
                        fallback={
                            <Center h="100%" bg="gray.700">
                                <Text color="gray.400">Изображение отсутствует</Text>
                            </Center>
                        }
                    />
                ) : (
                    <Center h="100%" bg="gray.700">
                        <Text color="gray.400">Изображение отсутствует</Text>
                    </Center>
                )}
                <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    w="100%"
                    h="40%"
                    bgGradient="linear(to-t, rgba(0,0,0,0.9), transparent)"
                />
            </Box>

            <Box p={6} flex="1" display="flex" flexDirection="column">
                <Text color="gray.400" fontSize="sm" mb={2}>
                    {formatDate(news.date_publish)}
                </Text>

                <Heading as="h3" fontSize="xl" color="white" mb={4} lineHeight="tall">
                    {news.title}
                </Heading>

                <Text color="gray.400" mb={6} flex="1">
                    {news.description.substring(0, 100) + '...'}
                </Text>

                <Flex justify="flex-end" mt="auto">
                    <Button
                        as={RouterLink}
                        to={`/news/${news.id}`}
                        variant="link"
                        color="#FC8181"
                        rightIcon={<span>→</span>}
                        _hover={{
                            color: "#FEB2B2",
                            textDecoration: "underline"
                        }}
                        transition="all 0.2s"
                    >
                        Читать далее
                    </Button>
                </Flex>
            </Box>
        </MotionBox>
    );
}