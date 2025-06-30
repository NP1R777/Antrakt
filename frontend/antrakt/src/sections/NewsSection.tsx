import { Box, Heading, Grid, GridItem, Text, Button, Image, Flex, Tag } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);

const news = [
    {
        id: 1,
        title: "Открыт набор в детскую театральную студию",
        image: "/images/news1.jpg",
        excerpt: "Приглашаем детей от 7 до 14 лет на занятия по актёрскому мастерству. Начало занятий - 1 сентября.",
        date: "15 августа 2025",
        category: "Набор"
    },
    {
        id: 2,
        title: "Премьера сезона: 'Вишнёвый сад' в новой интерпретации",
        image: "/images/news2.jpg",
        excerpt: "После долгих репетиций мы готовы представить наш взгляд на классическую пьесу Чехова. Билеты уже в продаже!",
        date: "10 августа 2025",
        category: "Премьера"
    },
    {
        id: 3,
        title: "Мастер-класс по сценической речи от Олега Табакова",
        image: "/images/news3.jpg",
        excerpt: "Легендарный актёр проведет эксклюзивный мастер-класс для участников нашей студии 25 августа.",
        date: "5 августа 2025",
        category: "Мастер-класс"
    },
    {
        id: 4,
        title: "Наша студия получила грант на развитие",
        image: "/images/news4.jpg",
        excerpt: "Министерство культуры выделило грант в размере 500 000 рублей на постановку новых спектаклей.",
        date: "1 августа 2025",
        category: "Новости"
    },
    {
        id: 5,
        title: "Летний театральный интенсив для взрослых",
        image: "/images/news5.jpg",
        excerpt: "Специальная программа для тех, кто хочет раскрыть свой творческий потенциал за короткое время.",
        date: "28 июля 2025",
        category: "Интенсив"
    },
    {
        id: 6,
        title: "Фотовыставка 'Закулисье Антракта'",
        image: "/images/news6.jpg",
        excerpt: "Уникальные кадры из жизни театральной студии можно увидеть в городской галерее до конца сентября.",
        date: "20 июля 2025",
        category: "Выставка"
    }
];

export default function NewsSection() {
    return (
        <Box py={20} bg="black" position="relative" overflow="hidden" id="news">
            {/* Декоративный элемент */}
            <MotionBox
                position="absolute"
                bottom="-20%"
                left="-10%"
                w="500px"
                h="500px"
                bg="#C53030" // brand.700
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
                            bg: "#F56565", // brand.500
                            borderRadius: "full"
                        }}
                    >
                        Новости студии
                    </Heading>
                    <Text color="gray.400" maxW="2xl" mx="auto" mt={8}>
                        Следите за последними событиями, премьерами и мероприятиями нашей театральной студии
                    </Text>
                </MotionBox>

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
                            <NewsCard news={item} />
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
            </Box>
        </Box>
    );
}

function NewsCard({ news }: { news: any }) {
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
                borderColor: "#F56565", // brand.500
                boxShadow: "0 15px 30px rgba(128, 0, 32, 0.3)"
            }}
            transition={{ duration: 0.3 }}
            h="100%"
            display="flex"
            flexDirection="column"
        >
            <Box h="200px" overflow="hidden" position="relative">
                <Image
                    src={news.image}
                    alt={news.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    transition="transform 0.5s ease"
                    _hover={{ transform: "scale(1.05)" }}
                />
                <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    w="100%"
                    h="40%"
                    bgGradient="linear(to-t, rgba(0,0,0,0.9), transparent)"
                />
                <Tag
                    position="absolute"
                    bottom={4}
                    right={4}
                    bg="#E53E3E" // brand.600
                    color="white"
                    fontWeight="bold"
                    zIndex="1"
                >
                    {news.category}
                </Tag>
            </Box>

            <Box p={6} flex="1" display="flex" flexDirection="column">
                <Text color="gray.400" fontSize="sm" mb={2}>
                    {news.date}
                </Text>

                <Heading as="h3" fontSize="xl" color="white" mb={4} lineHeight="tall">
                    {news.title}
                </Heading>

                <Text color="gray.400" mb={6} flex="1">
                    {news.excerpt}
                </Text>

                <Flex justify="flex-end" mt="auto">
                    <Button
                        as={RouterLink}
                        to={`/news/${news.id}`}
                        variant="link"
                        color="#FC8181" // brand.300
                        rightIcon={<span>→</span>}
                        _hover={{
                            color: "#FEB2B2", // brand.100
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
