import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, Image, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../config'
import { getImageUrl } from '../utils/imageUrl';
import PageFetchError from '../components/PageFetchError';

const MotionBox = motion(Box);

interface BirthdayData {
    active: boolean;
    actor_id?: number;
    actor_name?: string;
    actor_image?: string;
    greeting?: string;
    birth_date?: string;
}

const BirthdaySection: React.FC = () => {
    const [data, setData] = useState<BirthdayData | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = () => {
            setError('');
            axios.get(`${API_URL}/birthday-today/`)
                .then(res => setData(res.data))
                .catch(() => setError('Не удалось загрузить информацию об именинниках'));
        };
        load();

        // Автоматически перепроверяем на следующей полуночи: секция
        // появляется в 00:00 в день рождения и исчезает в 00:00 следующего дня.
        const now = new Date();
        const nextMidnight = new Date(
            now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5
        );
        const timer = setTimeout(load, nextMidnight.getTime() - now.getTime());
        return () => clearTimeout(timer);
    }, []);

    if (error) {
        return (
            <Box as="section" bg="#0a0a0a" py={{ base: 12, md: 16 }} px={4}>
                <PageFetchError message={error} />
            </Box>
        );
    }

    if (!data?.active) return null;

    return (
        <Box as="section" bg="#0a0a0a" py={{ base: 12, md: 16 }} position="relative" overflow="hidden">
            {/* Мягкое белое свечение фона */}
            <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w={{ base: '320px', md: '640px' }}
                h={{ base: '320px', md: '640px' }}
                bg="radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 70%)"
                filter="blur(30px)"
                pointerEvents="none"
            />
            <Container maxW="container.md" position="relative">
                <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <VStack spacing={6} textAlign="center">
                        <Text
                            textTransform="uppercase"
                            letterSpacing="0.3em"
                            fontSize="sm"
                            color="#a0a0a0"
                        >
                            Сегодня день рождения
                        </Text>

                        <MotionBox
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Image
                                src={getImageUrl(data.actor_image)}
                                alt={data.actor_name}
                                fallbackSrc={getImageUrl()}
                                boxSize={{ base: '150px', md: '190px' }}
                                objectFit="cover"
                                borderRadius="full"
                                border="3px solid #ffffff"
                                boxShadow="0 0 40px rgba(255,255,255,0.28)"
                                objectPosition={"top center"}
                            />
                        </MotionBox>

                        <Heading
                            as="h2"
                            fontSize={{ base: '3xl', md: '5xl' }}
                            color="#ffffff"
                            textShadow="0 0 18px rgba(255,255,255,0.35)"
                        >
                            {data.actor_name}
                        </Heading>

                        <Text
                            fontSize={{ base: 'md', md: 'xl' }}
                            color="#d9d9d9"
                            maxW="2xl"
                            lineHeight="tall"
                        >
                            {data.greeting}
                        </Text>
                    </VStack>
                </MotionBox>
            </Container>
        </Box>
    );
};

export default BirthdaySection;
