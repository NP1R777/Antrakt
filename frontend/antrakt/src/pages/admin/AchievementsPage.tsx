import React, { useState, useEffect, useRef } from 'react';
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
    Spinner,
    Center,
    Tooltip,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
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
const MotionButton = motion(Button);

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
const secondaryColor = '#A00030';

const AchievementsPage: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();

    const toast = useToast();
    const cancelRef = useRef<HTMLButtonElement>(null);

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
        onFormOpen();
    };

    const handleEdit = (achievement: Achievement) => {
        setSelectedAchievement(achievement);
        onFormOpen();
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
        onFormClose();
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

    const renderAchievementCards = () => {
        if (loading) {
            return (
                <Flex justify="center" align="center" minH="200px">
                    <Spinner size="xl" color={primaryColor} />
                </Flex>
            );
        }

        if (achievements.length === 0) {
            return (
                <Text textAlign="center" fontSize="lg" color="#AAAAAA">
                    Достижения не найдены
                </Text>
            );
        }

        return (
            <Grid
                templateColumns={{
                    base: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                    xl: 'repeat(4, 1fr)'
                }}
                gap={6}
            >
                {achievements.map((achievement) => {
                    const IconComponent = getRandomIcon();
                    return (
                        <MotionGridItem
                            key={achievement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MotionCard
                                bg="#222222"
                                border="1px solid #333333"
                                borderRadius="lg"
                                overflow="hidden"
                                _hover={{
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                                    borderColor: primaryColor
                                }}
                                transition="all 0.3s ease"
                            >
                                <CardHeader bg="#333333" pb={2}>
                                    <Flex align="center" justify="space-between">
                                        <HStack spacing={2}>
                                            <IconComponent color={primaryColor} size={20} />
                                            <Text fontWeight="semibold" fontSize="md">
                                                Достижения #{achievement.id}
                                            </Text>
                                        </HStack>
                                        <Badge colorScheme="green" variant="subtle">
                                            {achievement.achievements.length} шт.
                                        </Badge>
                                    </Flex>
                                </CardHeader>

                                <CardBody p={4}>
                                    {achievement.image_url && (
                                        <Box mb={4} position="relative">
                                            <Image
                                                src={achievement.image_url}
                                                alt="Достижения"
                                                borderRadius="md"
                                                w="full"
                                                h="120px"
                                                objectFit="cover"
                                                fallback={
                                                    <Flex
                                                        bg="#444444"
                                                        h="120px"
                                                        align="center"
                                                        justify="center"
                                                        borderRadius="md"
                                                    >
                                                        <CFaImage color="#666666" size={40} />
                                                    </Flex>
                                                }
                                            />
                                        </Box>
                                    )}

                                    <VStack spacing={2} align="stretch">
                                        {achievement.achievements.slice(0, 3).map((item, index) => (
                                            <Text
                                                key={index}
                                                fontSize="sm"
                                                color="#CCCCCC"
                                                noOfLines={2}
                                                lineHeight="1.4"
                                            >
                                                • {item}
                                            </Text>
                                        ))}
                                        {achievement.achievements.length > 3 && (
                                            <Text fontSize="sm" color="#888888">
                                                +{achievement.achievements.length - 3} ещё
                                            </Text>
                                        )}
                                    </VStack>

                                    <Divider my={3} borderColor="#444444" />

                                    <HStack spacing={2} color="#888888" fontSize="xs">
                                        <CFaCalendar />
                                        <Text>{formatDate(achievement.created_at)}</Text>
                                    </HStack>
                                </CardBody>

                                <CardFooter bg="#333333" pt={2}>
                                    <HStack spacing={2} w="full" justify="center">
                                        <Tooltip label="Просмотр" placement="top">
                                            <IconButton
                                                aria-label="Просмотр"
                                                icon={<CFaEye />}
                                                size="sm"
                                                colorScheme="blue"
                                                variant="ghost"
                                                onClick={() => handleView(achievement)}
                                                _hover={{ bg: 'blue.500', color: 'white' }}
                                            />
                                        </Tooltip>
                                        <Tooltip label="Редактировать" placement="top">
                                            <IconButton
                                                aria-label="Редактировать"
                                                icon={<CFaEdit />}
                                                size="sm"
                                                colorScheme="yellow"
                                                variant="ghost"
                                                onClick={() => handleEdit(achievement)}
                                                _hover={{ bg: 'yellow.500', color: 'white' }}
                                            />
                                        </Tooltip>
                                        <Tooltip label="Удалить" placement="top">
                                            <IconButton
                                                aria-label="Удалить"
                                                icon={<CFaTrash />}
                                                size="sm"
                                                colorScheme="red"
                                                variant="ghost"
                                                onClick={() => handleDelete(achievement.id)}
                                                _hover={{ bg: 'red.500', color: 'white' }}
                                            />
                                        </Tooltip>
                                    </HStack>
                                </CardFooter>
                            </MotionCard>
                        </MotionGridItem>
                    );
                })}
            </Grid>
        );
    };

    return (
        <Container maxW="container.xl" py={8}>
            <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Заголовок страницы */}
                <Flex justify="space-between" align="center" mb={8}>
                    <VStack align="start" spacing={2}>
                        <Heading
                            size="lg"
                            color="white"
                            display="flex"
                            alignItems="center"
                            gap={3}
                        >
                            <CFaTrophy color={primaryColor} size={28} />
                            Управление достижениями
                        </Heading>
                        <Text color="#AAAAAA" fontSize="md">
                            Создавайте и управляйте достижениями театра
                        </Text>
                    </VStack>

                    <MotionButton
                        leftIcon={<CFaPlus />}
                        colorScheme="red"
                        bg={primaryColor}
                        _hover={{ bg: secondaryColor }}
                        onClick={handleCreate}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Добавить достижения
                    </MotionButton>
                </Flex>

                {/* Статистика */}
                <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6} mb={8}>
                    <MotionBox
                        bg="#222222"
                        p={6}
                        borderRadius="lg"
                        border="1px solid #333333"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Stat>
                            <StatLabel color="#AAAAAA" fontSize="sm">Всего достижений</StatLabel>
                            <StatNumber color="white" fontSize="2xl">
                                {achievements.length}
                            </StatNumber>
                            <StatHelpText color="#888888">
                                Записей в базе данных
                            </StatHelpText>
                        </Stat>
                    </MotionBox>

                    <MotionBox
                        bg="#222222"
                        p={6}
                        borderRadius="lg"
                        border="1px solid #333333"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Stat>
                            <StatLabel color="#AAAAAA" fontSize="sm">Всего наград</StatLabel>
                            <StatNumber color="white" fontSize="2xl">
                                {achievements.reduce((sum, achievement) => sum + achievement.achievements.length, 0)}
                            </StatNumber>
                            <StatHelpText color="#888888">
                                Индивидуальных достижений
                            </StatHelpText>
                        </Stat>
                    </MotionBox>

                    <MotionBox
                        bg="#222222"
                        p={6}
                        borderRadius="lg"
                        border="1px solid #333333"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <Stat>
                            <StatLabel color="#AAAAAA" fontSize="sm">С изображениями</StatLabel>
                            <StatNumber color="white" fontSize="2xl">
                                {achievements.filter(a => a.image_url).length}
                            </StatNumber>
                            <StatHelpText color="#888888">
                                Записей с медиа
                            </StatHelpText>
                        </Stat>
                    </MotionBox>
                </Grid>

                {/* Список достижений */}
                {renderAchievementCards()}
            </MotionBox>

            {/* Модальное окно формы */}
            <AchievementForm
                isOpen={isFormOpen}
                onClose={onFormClose}
                initialData={selectedAchievement}
                onSuccess={handleFormSuccess}
            />

            {/* Модальное окно просмотра */}
            {selectedAchievement && (
                <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl" isCentered>
                    <ModalOverlay bg="blackAlpha.700" />
                    <ModalContent bg="#222222" color="white">
                        <ModalHeader borderBottom="1px solid #333333">
                            <HStack spacing={3}>
                                <CFaTrophy color={primaryColor} />
                                <Text>Просмотр достижений #{selectedAchievement.id}</Text>
                            </HStack>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody py={6}>
                            <VStack spacing={6} align="stretch">
                                {selectedAchievement.image_url && (
                                    <Box>
                                        <Text fontWeight="semibold" mb={3}>Изображение</Text>
                                        <Image
                                            src={selectedAchievement.image_url}
                                            alt="Достижения"
                                            borderRadius="md"
                                            w="full"
                                            maxH="300px"
                                            objectFit="cover"
                                        />
                                    </Box>
                                )}

                                <Box>
                                    <Text fontWeight="semibold" mb={3}>
                                        Список достижений ({selectedAchievement.achievements.length})
                                    </Text>
                                    <VStack spacing={2} align="stretch">
                                        {selectedAchievement.achievements.map((achievement, index) => (
                                            <Box
                                                key={index}
                                                p={3}
                                                bg="#333333"
                                                borderRadius="md"
                                                border="1px solid #444444"
                                            >
                                                <Text color="#CCCCCC">
                                                    {index + 1}. {achievement}
                                                </Text>
                                            </Box>
                                        ))}
                                    </VStack>
                                </Box>

                                <HStack spacing={4} color="#888888" fontSize="sm">
                                    <HStack>
                                        <CFaCalendar />
                                        <Text>Создано: {formatDate(selectedAchievement.created_at)}</Text>
                                    </HStack>
                                    <HStack>
                                        <CFaCalendar />
                                        <Text>Обновлено: {formatDate(selectedAchievement.updated_at)}</Text>
                                    </HStack>
                                </HStack>
                            </VStack>
                        </ModalBody>
                        <ModalFooter borderTop="1px solid #333333">
                            <HStack spacing={3}>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        onViewClose();
                                        handleEdit(selectedAchievement);
                                    }}
                                    leftIcon={<CFaEdit />}
                                >
                                    Редактировать
                                </Button>
                                <Button onClick={onViewClose}>Закрыть</Button>
                            </HStack>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}

            {/* Диалог подтверждения удаления */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay bg="blackAlpha.700" />
                <AlertDialogContent bg="#222222" color="white">
                    <AlertDialogHeader borderBottom="1px solid #333333">
                        Удалить достижения
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        Вы уверены, что хотите удалить эти достижения? Это действие нельзя отменить.
                    </AlertDialogBody>
                    <AlertDialogFooter borderTop="1px solid #333333">
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
            </AlertDialog>
        </Container>
    );
};

export default AchievementsPage;