import React from "react";
import {
    Box,
    Heading,
    Grid,
    GridItem,
    Text,
    Flex,
    Avatar,
    chakra
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);

// Оборачиваем react‑icons в chakra, приводя к any, чтобы избежать TypeScript-ошибок
const ChakraFaQuoteLeft = chakra(FaQuoteLeft as any);
const ChakraFaStar = chakra(FaStar as any);

const testimonials = [
    {
        id: 1,
        name: "Мария Иванова",
        role: "Зритель",
        avatar: "/images/avatar1.jpg",
        text: "Посетили спектакль 'Вишнёвый сад' с дочерью. Были потрясены игрой актеров и глубиной проработки персонажей. Обязательно придем еще!",
        performance: "Вишнёвый сад",
        rating: 5,
        date: "15 июня 2025"
    },
    {
        id: 2,
        name: "Алексей Петров",
        role: "Студент театрального",
        avatar: "/images/avatar2.jpg",
        text: "Учусь актерскому мастерству в этой студии уже полгода. Преподаватели - профессионалы высшего уровня. Особенно рекомендую курс сценической речи!",
        performance: "Актерские курсы",
        rating: 5,
        date: "12 июня 2025"
    },
    {
        id: 3,
        name: "Ольга Сидорова",
        role: "Театральный критик",
        avatar: "/images/avatar3.jpg",
        text: "Спектакль 'Гамлет' в постановке студии 'Антракт' - это свежий взгляд на классику. Современные решения не нарушили дух оригинала, а лишь усилили его.",
        performance: "Гамлет",
        rating: 4,
        date: "10 июня 2025"
    },
    {
        id: 4,
        name: "Дмитрий Козлов",
        role: "Родитель",
        avatar: "/images/avatar4.jpg",
        text: "Мой сын занимается в детской группе студии. Заметны огромные изменения в его уверенности и коммуникативных навыках. Спасибо педагогам!",
        performance: "Детская группа",
        rating: 5,
        date: "8 июня 2025"
    },
    {
        id: 5,
        name: "Екатерина Волкова",
        role: "Актриса",
        avatar: "/images/avatar5.jpg",
        text: "Как профессионал, могу сказать - уровень постановок здесь не уступает многим профессиональным театрам. Особенно впечатлили декорации и свет.",
        performance: "Чайка",
        rating: 5,
        date: "5 июня 2025"
    },
    {
        id: 6,
        name: "Артем Федоров",
        role: "Режиссер",
        avatar: "/images/avatar6.jpg",
        text: "Работал со студией над совместным проектом. Поразила дисциплина и преданность делу всех участников. Настоящие профессионалы!",
        performance: "Ревизор",
        rating: 5,
        date: "1 июня 2025"
    }
];

export default function Testimonials() {
    return (
        <Box py={{ base: 12, md: 20 }} bg="black" position="relative" overflow="hidden" id="testimonials">
            {/* Размытый фоновой круг */}
            <MotionBox
                position="absolute"
                top="10%"
                right="-5%"
                w="400px"
                h="400px"
                bg="#C53030"
                borderRadius="full"
                filter="blur(70px)"
                opacity={0.15}
                animate={{ scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
            />

            <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} position="relative" zIndex="1">
                {/* Заголовок */}
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    mb={16}
                    textAlign="center"
                >
                    <Heading as="h2" fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }} color="white" mb={4}>
                        Что говорят о нас
                    </Heading>
                    <Text color="gray.400" maxW="2xl" mx="auto">
                        Отзывы зрителей, студентов и профессионалов о нашей работе
                    </Text>
                </MotionBox>

                {/* Сетка отзывов */}
                <Grid
                    templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)"
                    }}
                    gap={8}
                >
                    {testimonials.map((t) => (
                        <MotionGridItem
                            key={t.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5 }}
                        >
                            <TestimonialCard testimonial={t} />
                        </MotionGridItem>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
    return (
        <MotionBox
            bg="rgba(30, 30, 30, 0.8)"
            borderRadius="xl"
            p={6}
            border="1px solid"
            borderColor="gray.800"
            boxShadow="0 10px 30px rgba(128, 0, 32, 0.1)"
            position="relative"
            whileHover={{
                y: -5,
                borderColor: "#F56565",
                boxShadow: "0 15px 40px rgba(128, 0, 32, 0.3)"
            }}
            transition={{ duration: 0.3 }}
            h="100%"
            display="flex"
            flexDirection="column"
        >
            {/* Цитата */}
            <ChakraFaQuoteLeft
                position="absolute"
                top={6}
                right={6}
                color="#F56565"
                opacity={0.2}
                fontSize="4xl"
            />

            {/* Рейтинг */}
            <Flex mb={4}>
                {[...Array(5)].map((_, i) => (
                    <ChakraFaStar
                        key={i}
                        color={i < testimonial.rating ? "#F56565" : "gray.700"}
                        mr={1}
                        fontSize="lg"
                    />
                ))}
            </Flex>

            {/* Аватар и текст */}
            <Flex flex="1" mb={6}>
                <Avatar
                    src={testimonial.avatar}
                    name={testimonial.name}
                    size="lg"
                    mr={4}
                    border="2px solid"
                    borderColor="#F56565"
                />
                <Text color="gray.300" fontStyle="italic" flex="1">
                    "{testimonial.text}"
                </Text>
            </Flex>

            {/* Автор */}
            <Box borderTop="1px solid" borderColor="gray.800" pt={4}>
                <Text color="white" fontWeight="bold" fontSize="lg">
                    {testimonial.name}
                </Text>
                <Flex justify="space-between" mt={2}>
                    <Text color="gray.400" fontSize="sm">
                        {testimonial.role}
                    </Text>
                    <Text color="#FC8181" fontSize="sm" fontWeight="500">
                        {testimonial.performance}
                    </Text>
                </Flex>
                <Text color="gray.600" fontSize="xs" mt={2}>
                    {testimonial.date}
                </Text>
            </Box>
        </MotionBox>
    );
}
