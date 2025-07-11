import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    GridItem,
    Heading,
    Text,
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Button,
    VStack,
    HStack,
    Badge,
    Container,
    chakra,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure
} from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    FaTheaterMasks,
    FaUsers,
    FaNewspaper,
    FaTrophy,
    FaEye,
    FaPlus,
    FaChartLine,
    FaCalendar
} from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Импорт компонентов форм
import { ActorForm } from './forms/ActorForm';
import { PerformanceForm } from './forms/PerformancesForm';
import { NewsForm } from './forms/NewsForm';
import { DirectorForm } from './forms/DirectorForm';

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);

// Wrap each react-icon in chakra() with a cast to any
const CFaTheaterMasks = chakra(FaTheaterMasks as any);
const CFaUsers = chakra(FaUsers as any);
const CFaNewspaper = chakra(FaNewspaper as any);
const CFaTrophy = chakra(FaTrophy as any);
const CFaEye = chakra(FaEye as any);
const CFaPlus = chakra(FaPlus as any);
const CFaChartLine = chakra(FaChartLine as any);
const CFaCalendar = chakra(FaCalendar as any);

interface DashboardStats {
    performances: number;
    actors: number;
    directors: number;
    news: number;
    achievements: number;
    users: number;
}

interface RecentItem {
    id: number;
    title: string;
    date: string;
    type: 'performance' | 'news' | 'achievement' | 'actor' | 'director';
}

const primaryColor = '#800020';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats>({ performances: 0, actors: 0, directors: 0, news: 0, achievements: 0, users: 0 });
    const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Состояния для управления модальными окнами
    const [activeForm, setActiveForm] = useState<'actor' | 'performance' | 'news' | 'director' | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { scrollY } = useScroll();
    const headerY = useTransform(scrollY, [0, 200], [0, -50]);

    useEffect(() => { fetchDashboardData() }, []);

    const fetchDashboardData = async () => {
        try {
            const [perfRes, actRes, dirRes, newsRes, achRes, usrRes] = await Promise.all([
                axios.get('http://localhost:8000/perfomances/'),
                axios.get('http://localhost:8000/actors/'),
                axios.get('http://localhost:8000/directors/'),
                axios.get('http://localhost:8000/news/'),
                axios.get('http://localhost:8000/achievements/'),
                axios.get('http://localhost:8000/users/'),
            ]);

            setStats({
                performances: perfRes.data.length,
                actors: actRes.data.length,
                directors: dirRes.data.length,
                news: newsRes.data.length,
                achievements: achRes.data.length,
                users: usrRes.data.length,
            });

            // Собираем последние обновления из всех категорий
            const recent = [
                ...newsRes.data.slice(-3).map((i: any) => ({
                    id: i.id,
                    title: i.title,
                    date: i.created_at || new Date().toISOString(),
                    type: 'news' as const
                })),
                ...perfRes.data.slice(-2).map((i: any) => ({
                    id: i.id,
                    title: i.title,
                    date: i.created_at || new Date().toISOString(),
                    type: 'performance' as const
                })),
                ...actRes.data.slice(-2).map((i: any) => ({
                    id: i.id,
                    title: i.name,
                    date: i.created_at || new Date().toISOString(),
                    type: 'actor' as const
                })),
                ...achRes.data.slice(-2).map((i: any) => ({
                    id: i.id,
                    title: i.title,
                    date: i.created_at || new Date().toISOString(),
                    type: 'achievement' as const
                })),
                ...dirRes.data.slice(-1).map((i: any) => ({
                    id: i.id,
                    title: i.name,
                    date: i.created_at || new Date().toISOString(),
                    type: 'director' as const
                })),
            ]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 3);

            setRecentItems(recent);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Спектакли', value: stats.performances, icon: CFaTheaterMasks, color: primaryColor, helpText: 'Активных постановок' },
        { label: 'Актёры', value: stats.actors, icon: CFaUsers, color: '#FF6B35', helpText: 'В труппе театра' },
        { label: 'Новости', value: stats.news, icon: CFaNewspaper, color: '#4ECDC4', helpText: 'Опубликованных статей' },
        { label: 'Достижения', value: stats.achievements, icon: CFaTrophy, color: '#FFD700', helpText: 'Наград и призов' },
        { label: 'Режиссёры', value: stats.directors, icon: CFaEye, color: '#9B59B6', helpText: 'Творческих руководителей' },
        { label: 'Пользователи', value: stats.users, icon: CFaUsers, color: '#E74C3C', helpText: 'Зарегистрированных' },
    ];

    const quickActions = [
        {
            label: 'Добавить спектакль',
            icon: CFaTheaterMasks,
            color: primaryColor,
            action: () => {
                setActiveForm('performance');
                onOpen();
            }
        },
        {
            label: 'Новая новость',
            icon: CFaNewspaper,
            color: '#4ECDC4',
            action: () => {
                setActiveForm('news');
                onOpen();
            }
        },
        {
            label: 'Добавить актёра',
            icon: CFaUsers,
            color: '#FF6B35',
            action: () => {
                setActiveForm('actor');
                onOpen();
            }
        },
        {
            label: 'Добавить режиссёра',
            icon: CFaEye,
            color: '#9B59B6',
            action: () => {
                setActiveForm('director');
                onOpen();
            }
        },
        {
            label: 'Новое достижение',
            icon: CFaTrophy,
            color: '#FFD700',
            action: () => console.log('Добавить достижение')
        },
    ];

    const handleFormSuccess = () => {
        onClose();
        fetchDashboardData();
    };

    const renderForm = () => {
        switch (activeForm) {
            case 'actor':
                return <ActorForm onSuccess={handleFormSuccess} onCancel={onClose} />;
            case 'performance':
                return <PerformanceForm onSuccess={handleFormSuccess} onCancel={onClose} />;
            case 'news':
                return <NewsForm onSuccess={handleFormSuccess} onCancel={onClose} />;
            case 'director':
                return <DirectorForm onSuccess={handleFormSuccess} onCancel={onClose} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <Box minH="100vh" bg="black" display="flex" alignItems="center" justifyContent="center">
                <MotionBox animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                    <CFaTheaterMasks w={12} h={12} color={primaryColor} />
                </MotionBox>
            </Box>
        );
    }

    return (
        <Box minH="100vh" bg="black" color="white" position="relative">
            {/* Background effect */}
            <MotionBox
                position="absolute" top="20%" right="10%"
                w="300px" h="300px"
                bg={`radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`}
                borderRadius="full"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                pointerEvents="none"
            />

            <Container maxW="container.xl" py={8}>
                {/* Header */}
                <MotionBox style={{ y: headerY }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} mb={8}>
                    <VStack spacing={4} align="start">
                        <HStack spacing={4}>
                            <CFaChartLine w={8} h={8} color={primaryColor} />
                            <Heading as="h1" fontSize="4xl" fontFamily="Playfair Display" textShadow={`0 0 20px ${primaryColor}50`}>
                                Панель управления
                            </Heading>
                        </HStack>
                        <Text fontSize="lg" color="gray.300">
                            Добро пожаловать в админ-панель театральной студии "Антракт"
                        </Text>
                    </VStack>
                </MotionBox>

                {/* Stats cards */}
                <MotionGrid templateColumns={{ base: '1fr', md: 'repeat(2,1fr)', lg: 'repeat(3,1fr)' }} gap={6} mb={8} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                    {statCards.map((card, i) => (
                        <MotionGridItem key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }} whileHover={{ y: -5 }}>
                            <MotionBox
                                bg="rgba(255,255,255,0.05)" p={6} borderRadius="xl" border="1px solid" borderColor="rgba(255,255,255,0.1)"
                                backdropFilter="blur(10px)" position="relative" overflow="hidden"
                                whileHover={{ borderColor: card.color, boxShadow: `0 0 30px ${card.color}30` }} transition={{ duration: 0.3 }}
                            >
                                <Box position="absolute" top={0} left={0} right={0} bottom={0} bg={`linear-gradient(135deg, ${card.color}10 0%, transparent 50%)`} opacity={0.5} />
                                <Flex justify="space-between" align="start" position="relative">
                                    <Stat>
                                        <StatLabel color="gray.300" fontSize="sm">{card.label}</StatLabel>
                                        <StatNumber fontSize="3xl" fontWeight="bold" color={card.color}>{card.value}</StatNumber>
                                        <StatHelpText color="gray.400" fontSize="xs">{card.helpText}</StatHelpText>
                                    </Stat>
                                    <card.icon w={8} h={8} color={card.color} opacity={0.8} />
                                </Flex>
                            </MotionBox>
                        </MotionGridItem>
                    ))}
                </MotionGrid>

                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
                    {/* Quick actions */}
                    <MotionGridItem initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
                        <Box bg="rgba(255,255,255,0.05)" p={6} borderRadius="xl" border="1px solid" borderColor="rgba(255,255,255,0.1)" h="full">
                            <Heading as="h3" size="lg" mb={6} color={primaryColor} fontFamily="Playfair Display">Быстрые действия</Heading>
                            <VStack spacing={4} align="stretch">
                                {quickActions.map((action, idx) => (
                                    <MotionBox key={action.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }} whileHover={{ x: 5 }}>
                                        <Button
                                            leftIcon={<action.icon />}
                                            variant="ghost" justifyContent="flex-start" w="full" color="white"
                                            _hover={{ bg: `${action.color}20`, color: action.color, transform: 'translateX(5px)' }}
                                            transition="all 0.3s"
                                            onClick={action.action}
                                        >
                                            {action.label}
                                        </Button>
                                    </MotionBox>
                                ))}
                            </VStack>
                        </Box>
                    </MotionGridItem>

                    {/* Recent items */}
                    <MotionGridItem initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
                        <Box bg="rgba(255,255,255,0.05)" p={6} borderRadius="xl" border="1px solid" borderColor="rgba(255,255,255,0.1)" h="full">
                            <Heading as="h3" size="lg" mb={6} color={primaryColor} fontFamily="Playfair Display">Последние обновления</Heading>
                            <VStack spacing={4} align="stretch">
                                {recentItems.map((item, idx) => (
                                    <MotionBox key={`${item.type}-${item.id}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }} whileHover={{ scale: 1.02 }}>
                                        <Flex justify="space-between" align="center" p={3} borderRadius="md" bg="rgba(255,255,255,0.05)" _hover={{ bg: "rgba(255,255,255,0.1)" }} transition="all 0.3s">
                                            <VStack align="start" spacing={1} flex={1}>
                                                <Text fontSize="sm" fontWeight="medium" noOfLines={1}>{item.title}</Text>
                                                <Text fontSize="xs" color="gray.400">{new Date(item.date).toLocaleDateString()}</Text>
                                            </VStack>
                                            <Badge colorScheme={
                                                item.type === 'performance' ? 'red' :
                                                    item.type === 'news' ? 'blue' :
                                                        item.type === 'achievement' ? 'yellow' :
                                                            item.type === 'actor' ? 'green' : 'purple'
                                            } size="sm">
                                                {item.type === 'performance' ? 'Спектакль' :
                                                    item.type === 'news' ? 'Новость' :
                                                        item.type === 'achievement' ? 'Достижение' :
                                                            item.type === 'actor' ? 'Актёр' : 'Режиссёр'}
                                            </Badge>
                                        </Flex>
                                    </MotionBox>
                                ))}
                            </VStack>
                        </Box>
                    </MotionGridItem>
                </Grid>
            </Container>

            {/* Модальное окно для форм */}
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay bg="blackAlpha.700" />
                <ModalContent bg="#222222" color="white">
                    <ModalHeader borderBottom="1px solid #333333" fontFamily="Playfair Display">
                        {activeForm === 'actor' && 'Добавить актёра'}
                        {activeForm === 'performance' && 'Добавить спектакль'}
                        {activeForm === 'news' && 'Добавить новость'}
                        {activeForm === 'director' && 'Добавить режиссёра'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        {renderForm()}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Dashboard;