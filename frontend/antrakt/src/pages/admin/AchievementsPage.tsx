import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    GridItem,
    Heading,
    Text,
    Flex,
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
    useDisclosure,
    useToast,
    IconButton,
    Image,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Divider,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useColorModeValue,
    Skeleton,
    SkeletonText,
    Center
} from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    FaTrophy,
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaImage,
    FaCalendar,
    FaMedal,
    FaStar,
    FaAward
} from 'react-icons/fa';
import axios from 'axios';
import { AchievementForm } from './forms/AchievementForm';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);

// Wrap each react-icon in chakra() with a cast to any
const CFaTrophy = chakra(FaTrophy as any);
const CFaPlus = chakra(FaPlus as any);
const CFaEdit = chakra(FaEdit as any);
const CFaTrash = chakra(FaTrash as any);
const CFaEye = chakra(FaEye as any);
const CFaImage = chakra(FaImage as any);
const CFaCalendar = chakra(FaCalendar as any);
const CFaMedal = chakra(FaMedal as any);
const CFaStar = chakra(FaStar as any);
const CFaAward = chakra(FaAward as any);

interface Achievement {
    id: number;
    achievements: string[];
    image_url: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

const primaryColor = '#800020';

const AchievementsPage: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { 
        isOpen: isDeleteOpen, 
        onOpen: onDeleteOpen, 
        onClose: onDeleteClose 
    } = useDisclosure();
    const { 
        isOpen: isViewOpen, 
        onOpen: onViewOpen, 
        onClose: onViewClose 
    } = useDisclosure();
    
    const toast = useToast();
    const cancelRef = React.useRef<HTMLButtonElement>(null);

    const { scrollY } = useScroll();
    const headerY = useTransform(scrollY, [0, 200], [0, -50]);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await axios.get('http://localhost:8000/achievements/');
            setAchievements(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке достижений:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить достижения',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedAchievement(null);
        onOpen();
    };

    const handleEdit = (achievement: Achievement) => {
        setSelectedAchievement(achievement);
        onOpen();
    };

    const handleView = (achievement: Achievement) => {
        setSelectedAchievement(achievement);
        onViewOpen();
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            await axios.delete(`http://localhost:8000/achievements/${deleteId}/`);
            toast({
                title: 'Успешно',
                description: 'Достижения удалены',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            fetchAchievements();
        } catch (error) {
            console.error('Ошибка при удалении достижений:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось удалить достижения',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsDeleting(false);
            onDeleteClose();
            setDeleteId(null);
        }
    };

    const handleFormSuccess = () => {
        onClose();
        onViewClose();
        fetchAchievements();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRandomIcon = () => {
        const icons = [CFaTrophy, CFaMedal, CFaStar, CFaAward];
        return icons[Math.floor(Math.random() * icons.length)];
    };

    const totalAchievements = achievements.reduce((total, achievement) => 
        total + achievement.achievements.length, 0
    );

    const achievementsWithImages = achievements.filter(a => a.image_url).length;

    if (loading) {
        return (
            <Box p={8}>
                <Grid templateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={6}>
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} bg="#2A2A2A" borderColor="#444444">
                            <CardHeader>
                                <Skeleton height="20px" width="60%" />
                            </CardHeader>
                            <CardBody>
                                <Skeleton height="100px" mb={4} />
                                <SkeletonText noOfLines={3} spacing={2} />
                            </CardBody>
                        </Card>
                    ))}
                </Grid>
            </Box>
        );
    }

    return (
        <Box p={8}>
            {/* Заголовок и статистика */}
            <MotionBox
                style={{ y: headerY }}
                mb={8}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Flex justify="space-between" align="center" mb={6}>
                    <VStack align="start" spacing={2}>
                        <Heading size="lg" display="flex" alignItems="center" gap={3}>
                            <CFaTrophy color={primaryColor} />
                            Управление достижениями
                        </Heading>
                        <Text color="#AAAAAA">
                            Создавайте и управляйте достижениями театральной студии
                        </Text>
                    </VStack>
                    <Button
                        leftIcon={<CFaPlus />}
                        onClick={handleCreate}
                        bg={primaryColor}
                        color="white"
                        _hover={{ bg: '#600018' }}
                        _active={{ bg: '#400012' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Добавить достижения
                    </Button>
                </Flex>

                {/* Статистика */}
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={8}>
                    <Stat
                        p={4}
                        bg="#2A2A2A"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="#444444"
                    >
                        <StatLabel display="flex" alignItems="center" gap={2}>
                            <CFaTrophy color={primaryColor} />
                            Всего записей
                        </StatLabel>
                        <StatNumber color="white">{achievements.length}</StatNumber>
                        <StatHelpText color="#AAAAAA">Записей достижений</StatHelpText>
                    </Stat>

                    <Stat
                        p={4}
                        bg="#2A2A2A"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="#444444"
                    >
                        <StatLabel display="flex" alignItems="center" gap={2}>
                            <CFaMedal color="#FFD700" />
                            Всего достижений
                        </StatLabel>
                        <StatNumber color="white">{totalAchievements}</StatNumber>
                        <StatHelpText color="#AAAAAA">Отдельных достижений</StatHelpText>
                    </Stat>

                    <Stat
                        p={4}
                        bg="#2A2A2A"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="#444444"
                    >
                        <StatLabel display="flex" alignItems="center" gap={2}>
                            <CFaImage color="#4ECDC4" />
                            С фотографиями
                        </StatLabel>
                        <StatNumber color="white">{achievementsWithImages}</StatNumber>
                        <StatHelpText color="#AAAAAA">Записей с изображениями</StatHelpText>
                    </Stat>
                </Grid>
            </MotionBox>

            {/* Список достижений */}
            {achievements.length === 0 ? (
                <Center py={20}>
                    <VStack spacing={6}>
                        <CFaTrophy size={64} color="#666666" />
                        <Text fontSize="xl" color="#666666">
                            Достижения не найдены
                        </Text>
                        <Text color="#888888">
                            Создайте первое достижение, чтобы начать
                        </Text>
                        <Button
                            leftIcon={<CFaPlus />}
                            onClick={handleCreate}
                            bg={primaryColor}
                            color="white"
                            _hover={{ bg: '#600018' }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Добавить достижения
                        </Button>
                    </VStack>
                </Center>
            ) : (
                <MotionGrid
                    templateColumns="repeat(auto-fill, minmax(400px, 1fr))"
                    gap={6}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    {achievements.map((achievement, index) => {
                        const IconComponent = getRandomIcon();
                        return (
                            <MotionGridItem
                                key={achievement.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <MotionCard
                                    bg="#2A2A2A"
                                    borderColor="#444444"
                                    borderWidth="1px"
                                    overflow="hidden"
                                    whileHover={{ 
                                        y: -5,
                                        boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Изображение */}
                                    {achievement.image_url && (
                                        <Box position="relative" h="200px" overflow="hidden">
                                            <Image
                                                src={achievement.image_url}
                                                alt="Достижения"
                                                w="100%"
                                                h="100%"
                                                objectFit="cover"
                                                fallback={
                                                    <Center h="100%" bg="#333333">
                                                        <CFaImage size={48} color="#666666" />
                                                    </Center>
                                                }
                                            />
                                            <Box
                                                position="absolute"
                                                top={2}
                                                right={2}
                                                bg="rgba(0,0,0,0.7)"
                                                borderRadius="full"
                                                p={2}
                                            >
                                                <CFaImage color="white" />
                                            </Box>
                                        </Box>
                                    )}

                                    <CardHeader pb={2}>
                                        <Flex justify="space-between" align="center">
                                            <HStack spacing={3}>
                                                <IconComponent color={primaryColor} size={20} />
                                                <Text fontWeight="semibold" fontSize="lg">
                                                    Достижения #{achievement.id}
                                                </Text>
                                            </HStack>
                                            <Badge colorScheme="green" variant="subtle">
                                                {achievement.achievements.length} достижений
                                            </Badge>
                                        </Flex>
                                    </CardHeader>

                                    <CardBody pt={0}>
                                        <VStack spacing={3} align="stretch">
                                            {/* Первые 3 достижения */}
                                            {achievement.achievements.slice(0, 3).map((item, idx) => (
                                                <Box
                                                    key={idx}
                                                    p={3}
                                                    bg="#333333"
                                                    borderRadius="md"
                                                    borderLeft="3px solid"
                                                    borderLeftColor={primaryColor}
                                                >
                                                    <Text fontSize="sm" noOfLines={2}>
                                                        {item}
                                                    </Text>
                                                </Box>
                                            ))}
                                            
                                            {achievement.achievements.length > 3 && (
                                                <Text color="#AAAAAA" fontSize="sm" textAlign="center">
                                                    +{achievement.achievements.length - 3} ещё
                                                </Text>
                                            )}
                                        </VStack>

                                        <Divider my={4} borderColor="#444444" />

                                        <HStack spacing={2} color="#AAAAAA" fontSize="sm">
                                            <CFaCalendar />
                                            <Text>
                                                Создано: {formatDate(achievement.created_at)}
                                            </Text>
                                        </HStack>
                                    </CardBody>

                                    <CardFooter pt={0}>
                                        <HStack spacing={2} w="100%">
                                            <Button
                                                leftIcon={<CFaEye />}
                                                onClick={() => handleView(achievement)}
                                                variant="outline"
                                                size="sm"
                                                flex={1}
                                                borderColor="#444444"
                                                color="#AAAAAA"
                                                _hover={{ borderColor: primaryColor, color: 'white' }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Просмотр
                                            </Button>
                                            <Button
                                                leftIcon={<CFaEdit />}
                                                onClick={() => handleEdit(achievement)}
                                                variant="outline"
                                                size="sm"
                                                flex={1}
                                                borderColor="#444444"
                                                color="#AAAAAA"
                                                _hover={{ borderColor: '#4ECDC4', color: 'white' }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Редактировать
                                            </Button>
                                            <IconButton
                                                icon={<CFaTrash />}
                                                onClick={() => handleDelete(achievement.id)}
                                                colorScheme="red"
                                                variant="outline"
                                                size="sm"
                                                aria-label="Удалить"
                                                borderColor="#444444"
                                                _hover={{ borderColor: 'red.500' }}
                                            />
                                        </HStack>
                                    </CardFooter>
                                </MotionCard>
                            </MotionGridItem>
                        );
                    })}
                </MotionGrid>
            )}

            {/* Модальное окно формы */}
            <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
                <ModalOverlay bg="rgba(0,0,0,0.8)" />
                <ModalContent bg="#1A1A1A" borderColor="#444444">
                    <ModalHeader display="flex" alignItems="center" gap={3}>
                        <CFaTrophy color={primaryColor} />
                        {selectedAchievement ? 'Редактировать достижения' : 'Создать достижения'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <AchievementForm
                            initialData={selectedAchievement || undefined}
                            onSuccess={handleFormSuccess}
                            onCancel={onClose}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Модальное окно просмотра */}
            <Modal isOpen={isViewOpen} onClose={onViewClose} size="4xl">
                <ModalOverlay bg="rgba(0,0,0,0.8)" />
                <ModalContent bg="#1A1A1A" borderColor="#444444">
                    <ModalHeader display="flex" alignItems="center" gap={3}>
                        <CFaEye color={primaryColor} />
                        Просмотр достижений
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {selectedAchievement && (
                            <VStack spacing={6} align="stretch">
                                {selectedAchievement.image_url && (
                                    <Box>
                                        <Text fontWeight="semibold" mb={3}>Фотография</Text>
                                        <Image
                                            src={selectedAchievement.image_url}
                                            alt="Достижения"
                                            borderRadius="lg"
                                            w="100%"
                                            maxH="300px"
                                            objectFit="cover"
                                        />
                                    </Box>
                                )}

                                <Box>
                                    <Text fontWeight="semibold" mb={3}>
                                        Список достижений ({selectedAchievement.achievements.length})
                                    </Text>
                                    <VStack spacing={3} align="stretch">
                                        {selectedAchievement.achievements.map((achievement, index) => (
                                            <Box
                                                key={index}
                                                p={4}
                                                bg="#2A2A2A"
                                                borderRadius="lg"
                                                border="1px solid"
                                                borderColor="#444444"
                                            >
                                                <HStack spacing={3}>
                                                    <Badge
                                                        colorScheme="purple"
                                                        variant="subtle"
                                                        px={2}
                                                        py={1}
                                                        borderRadius="full"
                                                    >
                                                        {index + 1}
                                                    </Badge>
                                                    <Text>{achievement}</Text>
                                                </HStack>
                                            </Box>
                                        ))}
                                    </VStack>
                                </Box>

                                <Divider borderColor="#444444" />

                                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                    <Box>
                                        <Text color="#AAAAAA" fontSize="sm">Дата создания</Text>
                                        <Text>{formatDate(selectedAchievement.created_at)}</Text>
                                    </Box>
                                    <Box>
                                        <Text color="#AAAAAA" fontSize="sm">Последнее обновление</Text>
                                        <Text>{formatDate(selectedAchievement.updated_at)}</Text>
                                    </Box>
                                </Grid>
                            </VStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Диалог подтверждения удаления */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="#1A1A1A" borderColor="#444444">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Удалить достижения
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Вы уверены, что хотите удалить эти достижения? Это действие нельзя отменить.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose} variant="outline">
                                Отмена
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={confirmDelete}
                                ml={3}
                                isLoading={isDeleting}
                                loadingText="Удаление..."
                            >
                                Удалить
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default AchievementsPage;