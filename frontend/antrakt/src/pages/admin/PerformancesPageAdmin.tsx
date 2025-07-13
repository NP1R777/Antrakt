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
    IconButton,
    Tooltip,
    Image
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    FaPlus,
    FaTrash,
    FaEdit,
    FaUndo
} from 'react-icons/fa';
import axios from 'axios';
import { PerformanceForm } from './forms/PerformancesForm';

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);
const MotionButton = motion(Button);

const primaryColor = '#800020';
const secondaryColor = '#A00030';

const CFaPlus = chakra(FaPlus as any);
const CFaTrash = chakra(FaTrash as any);
const CFaEdit = chakra(FaEdit as any);
const CFaUndo = chakra(FaUndo as any);

interface Performance {
    id: number;
    title: string;
    author: string;
    description: string;
    duration: string;
    genre: string;
    premiere_date: string;
    image_url: string;
    is_active: boolean;
    age_limit: string;
    production_team: string[];
    the_cast: string[];
    afisha: boolean;
    deleted_at?: string | null;
}

const PerformancesPage: React.FC = () => {
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [currentPerformance, setCurrentPerformance] = useState<Performance | null>(null);
    const toast = useToast();

    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        fetchPerformances();
    }, []);

    const fetchPerformances = async () => {
        try {
            const response = await axios.get('http://localhost:8000/perfomances-admin/');
            setPerformances(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Ошибка при загрузке спектаклей:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить спектакли',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    };

    const handleSoftDelete = async () => {
        if (!deleteId) return;

        try {
            await axios.put(`http://localhost:8000/perfomance${deleteId}/`, {
                deleted_at: new Date().toISOString()
            });
            setPerformances(performances.map(performance =>
                performance.id === deleteId ? { ...performance, deleted_at: new Date().toISOString() } : performance
            ));
            toast({
                title: 'Успех!',
                description: 'Спектакль удалён',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Ошибка при удалении спектакля:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось удалить спектакль',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            onDeleteClose();
            setDeleteId(null);
        }
    };

    const handleRestorePerformance = async (id: number) => {
        try {
            await axios.put(`http://localhost:8000/perfomance${id}/`, {
                deleted_at: null
            });
            setPerformances(performances.map(performance =>
                performance.id === id ? { ...performance, deleted_at: null } : performance
            ));
            toast({
                title: 'Успех!',
                description: 'Спектакль успешно восстановлен',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Ошибка при восстановлении спектакля:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось восстановить спектакль',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const openEditForm = (performance: Performance) => {
        setCurrentPerformance(performance);
        onFormOpen();
    };

    const openCreateForm = () => {
        setCurrentPerformance(null);
        onFormOpen();
    };

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const formatDuration = (timeString: string) => {
        if (!timeString) return '0ч 0мин';
        const [hours, minutes] = timeString.split(':').map(Number);
        return `${hours}ч ${minutes}мин`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const renderPerformanceCards = () => {
        if (isLoading) {
            return (
                <Flex justify="center" align="center" minH="200px">
                    <Spinner size="xl" color={primaryColor} />
                </Flex>
            );
        }

        if (performances.length === 0) {
            return (
                <Text textAlign="center" fontSize="lg" color="#AAAAAA">
                    Спектакли не найдены
                </Text>
            );
        }

        return (
            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap={6}
                w="100%"
                maxW="100%"
                overflow="hidden"
            >
                {performances.map(performance => (
                    <MotionGridItem
                        key={performance.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        w="100%"
                        position="relative"
                        zIndex={1}
                    >
                        <MotionBox
                            bg={performance.deleted_at ? "rgba(50,50,50,0.5)" : "rgba(255,255,255,0.05)"}
                            p={4}
                            borderRadius="xl"
                            border="1px solid"
                            borderColor={performance.deleted_at ? "#555" : "rgba(255,255,255,0.1)"}
                            backdropFilter="blur(10px)"
                            position="relative"
                            overflow="hidden"
                            whileHover={{
                                borderColor: performance.deleted_at ? "#666" : secondaryColor,
                                boxShadow: performance.deleted_at ? "none" : `0 0 20px ${secondaryColor}50`
                            }}
                            transition={{ duration: 0.3 }}
                            w="100%"
                            maxW="450px"
                            minW="300px"
                            mx="auto"
                            minH="250px"
                            opacity={performance.deleted_at ? 0.7 : 1}
                        >
                            {performance.deleted_at && (
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

                            <Flex align="center" mb={4}>
                                <Box
                                    boxSize="90px"
                                    borderRadius="full"
                                    overflow="hidden"
                                    border={`2px solid ${primaryColor}`}
                                    flexShrink={0}
                                    bg="#222"
                                >
                                    <Image
                                        src={performance.image_url}
                                        alt={performance.title}
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                        objectPosition="top center"
                                    />
                                </Box>
                                <Box ml={4} maxW="calc(100% - 80px)">
                                    <Heading size="md" fontFamily="Playfair Display" noOfLines={1}>
                                        {performance.title}
                                    </Heading>
                                    <Badge
                                        bg={secondaryColor}
                                        color="white"
                                        mt={1}
                                        px={3}
                                        py={1.5}
                                        fontSize="xs"
                                        borderRadius="md"
                                        whiteSpace="normal"
                                        wordBreak="break-word"
                                        maxW="100%"
                                        textShadow="0 1px 2px rgba(0, 0, 0, 0.3)"
                                        _hover={{ bg: '#B00040' }}
                                        noOfLines={2}
                                    >
                                        {performance.production_team[0]} • {performance.age_limit}
                                    </Badge>
                                </Box>
                            </Flex>

                            <Text
                                noOfLines={3}
                                fontSize="sm"
                                color="#CCCCCC"
                                mb={4}
                            >
                                {performance.description}
                            </Text>

                            <Flex justify="space-between" align="center" mt={4}>
                                <Badge colorScheme={performance.afisha ? "green" : "purple"}>
                                    {performance.afisha ? "В афише" : "В архиве"}
                                </Badge>

                                <Flex justify="flex-end" gap={2}>
                                    <Tooltip label="Редактировать" hasArrow>
                                        <IconButton
                                            size="sm"
                                            icon={<CFaEdit />}
                                            colorScheme="blue"
                                            variant="ghost"
                                            onClick={() => openEditForm(performance)}
                                            aria-label="Редактировать спектакль"
                                            isDisabled={!!performance.deleted_at}
                                        />
                                    </Tooltip>

                                    {performance.deleted_at ? (
                                        <Tooltip label="Восстановить" hasArrow>
                                            <IconButton
                                                size="sm"
                                                icon={<CFaUndo />}
                                                colorScheme="green"
                                                variant="ghost"
                                                onClick={() => handleRestorePerformance(performance.id)}
                                                aria-label="Восстановить спектакль"
                                            />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip label="Удалить" hasArrow>
                                            <IconButton
                                                size="sm"
                                                icon={<CFaTrash />}
                                                colorScheme="red"
                                                variant="ghost"
                                                onClick={() => confirmDelete(performance.id)}
                                                aria-label="Удалить спектакль"
                                            />
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
            <Container maxW="container.lg" px={{ base: 4, md: 6 }} overflow="hidden" position="relative" zIndex={1}>
                <Flex justify="space-between" align="center" mb={8} flexWrap="wrap">
                    <VStack align="start" spacing={2} mb={{ base: 4, md: 0 }}>
                        <Heading fontSize="3xl" fontFamily="Playfair Display" textShadow={`0 0 15px ${primaryColor}50`}>
                            Управление спектаклями
                        </Heading>
                        <Text color="#AAAAAA">
                            Здесь вы можете управлять спектаклями театральной студии "Антракт"
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
                        Добавить спектакль
                    </MotionButton>
                </Flex>

                {renderPerformanceCards()}
            </Container>

            {/* Модальное окно для создания/редактирования */}
            <Modal isOpen={isFormOpen} onClose={onFormClose} size="4xl" scrollBehavior="inside" isCentered>
                <ModalOverlay bg="blackAlpha.700" />
                <ModalContent bg="#222222" color="white">
                    <ModalHeader borderBottom="1px solid #333333" fontFamily="Playfair Display">
                        {currentPerformance ? 'Редактировать спектакль' : 'Добавить новый спектакль'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6} overflowY="auto">
                        <PerformanceForm
                            initialData={currentPerformance || undefined}
                            onSuccess={() => {
                                fetchPerformances();
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
                        <AlertDialogHeader fontSize="lg" fontWeight="bold" fontFamily="Playfair Display">
                            Удаление спектакля
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Вы уверены, что хотите удалить этот спектакль?
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
                                onClick={handleSoftDelete}
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

export default PerformancesPage;