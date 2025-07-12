import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Grid,
    GridItem,
    Heading,
    Flex,
    Button,
    VStack,
    HStack,
    Badge,
    Container,
    chakra,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useToast,
    Spinner,
    Text,
    Tooltip,
    Image,
    IconButton
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    FaPlus,
    FaTrash,
    FaEdit,
    FaTrophy,
    FaEye,
    FaUndo
} from 'react-icons/fa';
import axios from 'axios';
import { AchievementForm } from './forms/AchievementForm';

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);
const MotionButton = motion(Button);

const primaryColor = '#800020';
const secondaryColor = '#A00030';

const CFaPlus = chakra(FaPlus as any);
const CFaTrash = chakra(FaTrash as any);
const CFaEdit = chakra(FaEdit as any);
const CFaTrophy = chakra(FaTrophy as any);
const CFaEye = chakra(FaEye as any);
const CFaUndo = chakra(FaUndo as any);

interface Achievement {
    id: number;
    achievements: string[];
    image_url: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

const AchievementsPage: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
    const toast = useToast();

    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await axios.get('http://localhost:8000/achievements/');
            setAchievements(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Ошибка при загрузке достижений:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить достижения',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    };

    const handleDeleteAchievement = async () => {
        if (!deleteId) return;

        try {
            await axios.put(`http://localhost:8000/achievements/${deleteId}/`, {
                deleted_at: new Date().toISOString()
            });
            toast({
                title: 'Успешно',
                description: 'Достижения удалены',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            setAchievements(prevAchievements =>
                prevAchievements.map(item =>
                    item.id === deleteId
                        ? { ...item, deleted_at: new Date().toISOString() }
                        : item
                )
            );
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
            onDeleteClose();
            setDeleteId(null);
        }
    };

    const handleRestoreAchievement = async (id: number) => {
        if (!id) return;

        try {
            await axios.put(`http://localhost:8000/achievements/${id}/`, {
                deleted_at: null
            });
            toast({
                title: 'Успешно',
                description: 'Достижения восстановлены',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            setAchievements(prevAchievements =>
                prevAchievements.map(item =>
                    item.id === id
                        ? { ...item, deleted_at: null }
                        : item
                )
            );
        } catch (error) {
            console.error('Ошибка при восстановлении достижений:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось восстановить достижения',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const openEditForm = (achievement: Achievement) => {
        setCurrentAchievement(achievement);
        onFormOpen();
    };

    const openCreateForm = () => {
        setCurrentAchievement(null);
        onFormOpen();
    };

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const renderAchievementCards = () => {
        if (isLoading) {
            return (
                <Flex justify="center" align="center" minH="400px">
                    <Spinner size="xl" color={primaryColor} />
                </Flex>
            );
        }

        if (achievements.length === 0) {
            return (
                <Box textAlign="center" py={20}>
                    <CFaTrophy size="4em" color="#666" />
                    <Text mt={4} color="#666" fontSize="lg">
                        Достижения не найдены
                    </Text>
                </Box>
            );
        }

        return (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(auto-fill, minmax(400px, 1fr))' }} gap={6}>
                {achievements.map((achievement) => (
                    <MotionGridItem
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <MotionBox
                            bg={achievement.deleted_at ? "rgba(50,50,50,0.5)" : "rgba(255,255,255,0.05)"}
                            p={4}
                            borderRadius="xl"
                            border="1px solid"
                            borderColor={achievement.deleted_at ? "#555" : "rgba(255,255,255,0.1)"}
                            backdropFilter="blur(10px)"
                            position="relative"
                            overflow="hidden"
                            whileHover={{
                                borderColor: achievement.deleted_at ? "#666" : secondaryColor,
                                boxShadow: achievement.deleted_at ? "none" : `0 0 20px ${secondaryColor}50`
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {achievement.deleted_at && (
                                <Badge
                                    position="absolute"
                                    top={2}
                                    right={2}
                                    colorScheme="red"
                                    zIndex={1}
                                >
                                    Удалено
                                </Badge>
                            )}

                            {achievement.image_url && (
                                <Image
                                    src={achievement.image_url}
                                    alt="Достижения"
                                    w="100%"
                                    h="200px"
                                    objectFit="cover"
                                    borderRadius="md"
                                    mb={4}
                                    opacity={achievement.deleted_at ? 0.6 : 1}
                                />
                            )}

                            <VStack align="stretch" spacing={3}>
                                <HStack justify="space-between" align="start">
                                    <Heading
                                        size="md"
                                        fontFamily="Playfair Display"
                                        noOfLines={2}
                                        flex={1}
                                        color={achievement.deleted_at ? "#999" : "white"}
                                    >
                                        Достижения #{achievement.id}
                                    </Heading>
                                    <Badge colorScheme="green" variant="subtle">
                                        {achievement.achievements.length} достижений
                                    </Badge>
                                </HStack>

                                <VStack spacing={2} align="stretch">
                                    {achievement.achievements.slice(0, 3).map((item, idx) => (
                                        <Text
                                            key={idx}
                                            fontSize="sm"
                                            color={achievement.deleted_at ? "#999" : "#CCCCCC"}
                                            noOfLines={2}
                                            pl={2}
                                            borderLeft="2px solid"
                                            borderLeftColor={primaryColor}
                                        >
                                            {truncateText(item, 80)}
                                        </Text>
                                    ))}
                                    
                                    {achievement.achievements.length > 3 && (
                                        <Text color="#AAAAAA" fontSize="sm" textAlign="center">
                                            +{achievement.achievements.length - 3} ещё
                                        </Text>
                                    )}
                                </VStack>

                                <Text
                                    fontSize="xs"
                                    color={achievement.deleted_at ? "#999" : "#AAAAAA"}
                                >
                                    Создано: {formatDate(achievement.created_at)}
                                </Text>

                                <Flex justify="flex-end" gap={2} mt={2}>
                                    <Tooltip label="Редактировать" hasArrow>
                                        <IconButton
                                            size="sm"
                                            icon={<CFaEdit />}
                                            colorScheme="blue"
                                            variant="ghost"
                                            onClick={() => openEditForm(achievement)}
                                            aria-label='Редактировать достижения'
                                            isDisabled={!!achievement.deleted_at}
                                        />
                                    </Tooltip>

                                    {achievement.deleted_at ? (
                                        <Tooltip label="Восстановить" hasArrow>
                                            <IconButton
                                                size="sm"
                                                icon={<CFaUndo />}
                                                colorScheme="green"
                                                variant="ghost"
                                                onClick={() => handleRestoreAchievement(achievement.id)}
                                                aria-label='Восстановить достижения'
                                            />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip label="Удалить" hasArrow>
                                            <IconButton
                                                size="sm"
                                                icon={<CFaTrash />}
                                                colorScheme="red"
                                                variant="ghost"
                                                onClick={() => confirmDelete(achievement.id)}
                                                aria-label='Удалить достижения'
                                            />
                                        </Tooltip>
                                    )}
                                </Flex>
                            </VStack>
                        </MotionBox>
                    </MotionGridItem>
                ))}
            </Grid>
        );
    };

    return (
        <Box minH="100vh" bg="black" color="white" py={8}>
            <Container maxW="container.lg" px={{ base: 4, md: 6 }}>
                <Flex justify="space-between" align="center" mb={8} flexWrap="wrap">
                    <VStack align="start" spacing={2} mb={{ base: 4, md: 0 }}>
                        <Heading fontSize="3xl" fontFamily="Playfair Display">
                            Управление достижениями
                        </Heading>
                        <Text color="#AAAAAA">
                            Здесь вы можете управлять достижениями театральной студии "Антракт"
                        </Text>
                    </VStack>

                    <MotionButton
                        leftIcon={<CFaPlus />}
                        bg={primaryColor}
                        _hover={{ bg: '#900030' }}
                        onClick={openCreateForm}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Добавить достижения
                    </MotionButton>
                </Flex>

                {renderAchievementCards()}
            </Container>

            {/* Модальное окно для создания/редактирования */}
            <Modal isOpen={isFormOpen} onClose={onFormClose} size="4xl" scrollBehavior="inside">
                <ModalOverlay bg="blackAlpha.700" />
                <ModalContent bg="#222222" color="white">
                    <ModalHeader borderBottom="1px solid #333333" fontFamily="Playfair Display">
                        {currentAchievement ? 'Редактировать достижения' : 'Добавить новые достижения'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        <AchievementForm
                            initialData={currentAchievement || undefined}
                            onSuccess={() => {
                                fetchAchievements();
                                onFormClose();
                            }}
                            onCancel={onFormClose}
                        />
                    </ModalBody>
                    <ModalFooter borderTop="1px solid #333333" />
                </ModalContent>
            </Modal>

            {/* Диалог подтверждения удаления */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="#222222" color="white">
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
                                onClick={handleDeleteAchievement}
                                ml={3}
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