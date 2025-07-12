import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Grid,
    GridItem,
    Heading,
    Flex,
    Button,
    VStack,
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
    Image
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    FaTrophy,
    FaPlus,
    FaTrash,
    FaEdit,
    FaUndo
} from 'react-icons/fa';
import axios from 'axios';
import { AchievementForm } from './forms/AchievementForm';

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);
const MotionButton = motion(Button);

const primaryColor = '#800020';
const secondaryColor = '#A00030';

const CFaTrophy = chakra(FaTrophy as any);
const CFaPlus = chakra(FaPlus as any);
const CFaTrash = chakra(FaTrash as any);
const CFaEdit = chakra(FaEdit as any);
const CFaUndo = chakra(FaUndo as any);

interface Achievement {
    id: number;
    achievement: string;
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
            const response = await axios.get('http://localhost:8000/achievements-admin/');
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
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setCurrentAchievement(null);
        onFormOpen();
    };

    const handleEdit = (achievement: Achievement) => {
        setCurrentAchievement(achievement);
        onFormOpen();
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const handleSoftDelete = async (id: number) => {
        if (!id) return;

        try {
            await axios.put(`http://localhost:8000/achievement${id}/`, {
                deleted_at: new Date().toISOString()
            });
            toast({
                title: 'Успешно',
                description: 'Достижение удалено',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            setAchievements(prev =>
                prev.map(a =>
                    a.id === id
                        ? { ...a, deleted_at: new Date().toISOString() }
                        : a
                )
            );
        } catch (error) {
            console.error('Ошибка при удалении достижения:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось удалить достижение',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            onDeleteClose();
            setDeleteId(null);
        }
    };

    const handleRestore = async (id: number) => {
        if (!id) return;

        try {
            await axios.put(`http://localhost:8000/achievement${id}/`, {
                deleted_at: null
            });
            toast({
                title: 'Успешно',
                description: 'Достижение восстановлено',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            setAchievements(prev =>
                prev.map(a =>
                    a.id === id
                        ? { ...a, deleted_at: null }
                        : a
                )
            );
        } catch (error) {
            console.error('Ошибка при восстановлении достижения:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось восстановить достижение',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleFormSuccess = () => {
        onFormClose();
        fetchAchievements();
    };

    const renderAchievementCards = () => {
        if (isLoading) {
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
                {achievements.map((achievement) => (
                    <MotionGridItem
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
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
                            minH="300px"
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

                            <Flex direction="column" h="100%">
                                <Box flex="1">
                                    <Box
                                        position="relative"
                                        h="150px"
                                        mb={4}
                                        borderRadius="md"
                                        overflow="hidden"
                                    >
                                        {achievement.image_url ? (
                                            <Image
                                                src={achievement.image_url}
                                                alt="Достижение"
                                                w="full"
                                                h="full"
                                                objectFit="cover"
                                                opacity={achievement.deleted_at ? 0.6 : 1}
                                            />
                                        ) : (
                                            <Flex
                                                bg="#333"
                                                h="full"
                                                align="center"
                                                justify="center"
                                                opacity={achievement.deleted_at ? 0.6 : 1}
                                            >
                                                <CFaTrophy size={50} color="#666" />
                                            </Flex>
                                        )}
                                    </Box>

                                    <VStack align="start" spacing={2}>
                                        <Heading
                                            size="md"
                                            color={achievement.deleted_at ? "#999" : "white"}
                                            opacity={achievement.deleted_at ? 0.6 : 1}
                                        >
                                            Достижение #{achievement.id}
                                        </Heading>

                                        <Text
                                            fontSize="sm"
                                            color={achievement.deleted_at ? "#999" : "#CCCCCC"}
                                            noOfLines={4}
                                            opacity={achievement.deleted_at ? 0.6 : 1}
                                        >
                                            {achievement.achievement}
                                        </Text>
                                    </VStack>
                                </Box>

                                <Flex justify="flex-end" mt={4} gap={2}>
                                    <Tooltip label="Редактировать" hasArrow>
                                        <MotionButton
                                            size="sm"
                                            iconSpacing={0}
                                            bg="transparent"
                                            color="#3182CE"
                                            onClick={() => handleEdit(achievement)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            isDisabled={!!achievement.deleted_at}
                                        >
                                            <CFaEdit />
                                        </MotionButton>
                                    </Tooltip>

                                    {achievement.deleted_at ? (
                                        <Tooltip label="Восстановить" hasArrow>
                                            <MotionButton
                                                size="sm"
                                                iconSpacing={0}
                                                bg="transparent"
                                                color="#48BB78"
                                                onClick={() => handleRestore(achievement.id)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <CFaUndo />
                                            </MotionButton>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip label="Удалить" hasArrow>
                                            <MotionButton
                                                size="sm"
                                                iconSpacing={0}
                                                bg="transparent"
                                                color="#E53E3E"
                                                onClick={() => handleDelete(achievement.id)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <CFaTrash />
                                            </MotionButton>
                                        </Tooltip>
                                    )}
                                </Flex>
                            </Flex>
                        </MotionBox>
                    </MotionGridItem>
                ))}
            </Grid>
        );
    };

    return (
        <Box minH="100vh" bg="black" color="white" py={8} overflow="hidden" position="relative" zIndex={0}>
            <Container maxW="container.xl" px={{ base: 4, md: 6 }} overflow="hidden" position="relative" zIndex={1}>
                <Flex justify="space-between" align="center" mb={8} flexWrap="wrap">
                    <VStack align="start" spacing={2} mb={{ base: 4, md: 0 }} maxW="100%">
                        <Heading fontSize="3xl" fontFamily="Playfair Display" textShadow={`0 0 15px ${primaryColor}50`}>
                            Управление достижениями
                        </Heading>
                        <Text color="#AAAAAA">
                            Создавайте и управляйте достижениями театра
                        </Text>
                    </VStack>

                    <MotionButton
                        leftIcon={<CFaPlus />}
                        bg={primaryColor}
                        _hover={{ bg: '#900030' }}
                        onClick={handleCreate}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        mb={{ base: 4, md: 0 }}
                    >
                        Добавить достижение
                    </MotionButton>
                </Flex>

                {renderAchievementCards()}
            </Container>

            <Modal isOpen={isFormOpen} onClose={onFormClose} size="2xl" isCentered>
                <ModalOverlay bg="blackAlpha.700" />
                <ModalContent bg="#222222" color="white">
                    <ModalHeader borderBottom="1px solid #333333" fontFamily="Playfair Display">
                        {currentAchievement ? 'Редактировать достижение' : 'Добавить новое достижение'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        <AchievementForm
                            initialData={currentAchievement || undefined}
                            onSuccess={handleFormSuccess}
                            onCancel={onFormClose}
                        />
                    </ModalBody>
                    <ModalFooter borderTop="1px solid #333333" />
                </ModalContent>
            </Modal>

            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="#222222" color="white">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold" fontFamily="Playfair Display">
                            Удаление достижения
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Вы уверены, что хотите удалить это достижение?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button
                                ref={cancelRef}
                                onClick={onDeleteClose}
                                borderColor="#555555"
                                _hover={{ bg: '#333333' }}
                            >
                                Отмена
                            </Button>
                            <Button
                                bg="#E53E3E"
                                _hover={{ bg: '#F56565' }}
                                onClick={() => deleteId && handleSoftDelete(deleteId)}
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