import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { API_URL } from '../config';

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);

const ChakraFaQuoteLeft = chakra(FaQuoteLeft as any);
const ChakraFaStar = chakra(FaStar as any);

interface SiteReview {
    id: number;
    author_name: string;
    role?: string;
    avatar_url?: string;
    rating: number;
    text: string;
    review_date?: string | null;
}

const formatDate = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
};

export default function Testimonials() {
    const [reviews, setReviews] = useState<SiteReview[]>([]);

    useEffect(() => {
        axios.get(`${API_URL}/site-reviews/`)
            .then(res => setReviews(res.data || []))
            .catch(() => setReviews([]));
    }, []);

    // Пока отзывов нет — секцию не показываем.
    if (!reviews.length) return null;

    return (
        <Box py={{ base: 12, md: 20 }} bg="black" position="relative" overflow="hidden" id="testimonials">
            {/* Размытый фоновой круг */}
            <MotionBox
                position="absolute"
                top="10%"
                right="-5%"
                w="400px"
                h="400px"
                bg="#9a9a9a"
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
                    {reviews.map((t) => (
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

function TestimonialCard({ testimonial }: { testimonial: SiteReview }) {
    const rating = testimonial.rating || 5;
    return (
        <MotionBox
            bg="rgba(30, 30, 30, 0.8)"
            borderRadius="xl"
            p={6}
            border="1px solid"
            borderColor="gray.800"
            boxShadow="0 10px 30px rgba(255, 255, 255, 0.07)"
            position="relative"
            whileHover={{
                y: -5,
                borderColor: "#d9d9d9",
                boxShadow: "0 15px 40px rgba(255, 255, 255, 0.18)"
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
                color="#d9d9d9"
                opacity={0.2}
                fontSize="4xl"
            />

            {/* Рейтинг */}
            <Flex mb={4}>
                {[...Array(5)].map((_, i) => (
                    <ChakraFaStar
                        key={i}
                        color={i < rating ? "#d9d9d9" : "gray.700"}
                        mr={1}
                        fontSize="lg"
                    />
                ))}
            </Flex>

            {/* Аватар и текст */}
            <Flex flex="1" mb={6}>
                <Avatar
                    src={testimonial.avatar_url || undefined}
                    name={testimonial.author_name}
                    size="lg"
                    mr={4}
                    border="2px solid"
                    borderColor="#d9d9d9"
                />
                <Text color="gray.300" fontStyle="italic" flex="1">
                    "{testimonial.text}"
                </Text>
            </Flex>

            {/* Автор */}
            <Box borderTop="1px solid" borderColor="gray.800" pt={4}>
                <Text color="white" fontWeight="bold" fontSize="lg">
                    {testimonial.author_name}
                </Text>
                {testimonial.role && (
                    <Text color="gray.400" fontSize="sm" mt={2}>
                        {testimonial.role}
                    </Text>
                )}
                {testimonial.review_date && (
                    <Text color="gray.600" fontSize="xs" mt={2}>
                        {formatDate(testimonial.review_date)}
                    </Text>
                )}
            </Box>
        </MotionBox>
    );
}
