import React, { useState, useEffect } from "react";
import {
    Box,
    SimpleGrid,
    Text,
    Image,
    Button,
    Container,
    Heading,
    Skeleton,
    Flex,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

interface NewsItem {
    id: number;
    created_at: string;
    date_publish?: string;
    title: string;
    description: string;
    summary: string;
    is_published: boolean;
    image_url: string | null;
}

const NewsPage: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const primaryColor = "#800020";
    const darkBg = "#0a0a0a";
    const lightText = "#e0e0e0";
    const grayText = "#a0a0a0";

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await axios.get("http://localhost:8000/news");

                if (response.status !== 200) {
                    throw new Error(`Ошибка загрузки: ${response.status} ${response.statusText}`);
                }

                setNews(response.data);
            } catch (err: any) {
                console.error('Ошибка загрузки новостей:', err);
                setError(err.message || 'Неизвестная ошибка при загрузке новостей');
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, []);

    const handleNewsClick = (id: number) => {
        navigate(`/news/${id}`);
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'd MMMM yyyy', { locale: ru });
    };

    const publishedNews = news.filter(item => item.is_published);

    return (
        <Box bg={darkBg} minH="100vh" display="flex" flexDirection="column" overflowX="hidden">
            <Navigation />

            <Box flex="1" py={20} position="relative" px={{ base: 4, md: 8 }}>
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
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
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
                                bg: primaryColor,
                                borderRadius: "full"
                            }}
                        >
                            Последние новости
                        </Heading>
                        <Text fontSize="md" color={grayText} maxW="2xl" mx="auto" mt={8}>
                            Следите за актуальными событиями и обновлениями театральной студии
                        </Text>
                    </MotionBox>

                    {error ? (
                        <Box textAlign="center" py={10}>
                            <Alert status="error" variant="subtle" flexDirection="column" alignItems="center">
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="md" color={lightText}>
                                    Ошибка загрузки
                                </AlertTitle>
                                <AlertDescription maxWidth="sm" color={grayText} fontSize="sm">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        </Box>
                    ) : isLoading ? (
                        <Flex justify="center" align="center" minH="300px">
                            <Spinner size="xl" color={primaryColor} thickness="4px" />
                        </Flex>
                    ) : publishedNews.length === 0 ? (
                        <Box textAlign="center" py={20}>
                            <Image
                                src="/empty-state.svg"
                                alt="Новостей нет"
                                maxW="300px"
                                mx="auto"
                                mb={6}
                                opacity={0.7}
                            />
                            <Heading size="lg" mb={4} color={lightText}>Новостей пока нет</Heading>
                            <Text color={grayText}>Скоро здесь появятся свежие новости театра</Text>
                        </Box>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                            {publishedNews.map((item) => (
                                <MotionBox
                                    key={item.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                                    }}
                                    minW="0"
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <MotionBox
                                        as="div"
                                        bg="linear-gradient(135deg, rgba(10, 10, 10, 0.9), rgba(20, 20, 20, 0.3))"
                                        borderRadius="xl"
                                        overflow="hidden"
                                        border="1px solid"
                                        borderColor="rgba(64, 0, 16, 0.7)"
                                        boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                                        whileHover={{
                                            scale: 1.03,
                                            boxShadow: `0 10px 20px rgba(245, 101, 101, 0.3)`,
                                            background: "linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(128, 0, 32, 0.2))",
                                            transition: { duration: 0.3 }
                                        }}
                                        cursor="pointer"
                                        display="flex"
                                        flexDirection="column"
                                        h="100%"
                                        onClick={() => handleNewsClick(item.id)}
                                    >
                                        {item.image_url ? (
                                            <Image
                                                src={item.image_url}
                                                alt={item.title}
                                                height="200px"
                                                objectFit="cover"
                                                fallbackSrc="/placeholder-image.jpg"
                                                w="100%"
                                            />
                                        ) : (
                                            <Box
                                                bgGradient="linear(to-r, gray.700, #80002010)"
                                                h="200px"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                bg="rgba(128, 0, 32, 0.1)"
                                            >
                                                <Text color={grayText}>Изображение отсутствует</Text>
                                            </Box>
                                        )}

                                        <Box
                                            p={6}
                                            flex="1"
                                            display="flex"
                                            flexDirection="column"
                                            justifyContent="space-between"
                                        >
                                            <Box>
                                                <Text
                                                    color={lightText}
                                                    fontSize="sm"
                                                    mb={2}
                                                    fontWeight="medium"
                                                >
                                                    Дата публикации: {item.date_publish ? formatDate(item.date_publish) : 'неизвестно'}
                                                </Text>

                                                <Heading as="h3" size="md" color={lightText} mb={3} noOfLines={2}>
                                                    {item.title}
                                                </Heading>

                                                <Text
                                                    color={grayText}
                                                    flex={1}
                                                    noOfLines={3}
                                                    mb={4}
                                                >
                                                    {item.summary || item.description.slice(0, 150) + '...'}
                                                </Text>
                                            </Box>

                                            <MotionButton
                                                colorScheme="transparent"
                                                variant="outline"
                                                size="sm"
                                                alignSelf="flex-start"
                                                borderColor={primaryColor}
                                                color={lightText}
                                                _hover={{ bg: "rgba(128, 0, 32, 0.2)" }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Подробнее
                                            </MotionButton>
                                        </Box>
                                    </MotionBox>
                                </MotionBox>
                            ))}
                        </SimpleGrid>
                    )}
                </Container>
            </Box>

            <Footer />
        </Box>
    );
};

export default NewsPage;