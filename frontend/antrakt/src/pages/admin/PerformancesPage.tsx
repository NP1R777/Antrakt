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
    Input,
    Textarea,
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
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select,
    IconButton,
    Tooltip,
    Image
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPlus,
    FaTrash,
    FaEdit,
    FaSave,
    FaTimes,
    FaTheaterMasks,
    FaCalendar,
    FaClock,
    FaUser,
    FaImage
} from 'react-icons/fa';
import axios from 'axios';
import ImageUpload from '../../components/ImageUpload';

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);
const MotionButton = motion(Button);

const primaryColor = '#800020';
const secondaryColor = '#A00030';
const accentColor = '#4ECDC4';

// Обернем иконки в chakra для корректной работы
const CFaPlus = chakra(FaPlus as any);
const CFaTrash = chakra(FaTrash as any);
const CFaEdit = chakra(FaEdit as any);
const CFaSave = chakra(FaSave as any);
const CFaTimes = chakra(FaTimes as any);
const CFaTheaterMasks = chakra(FaTheaterMasks as any);
const CFaCalendar = chakra(FaCalendar as any);
const CFaClock = chakra(FaClock as any);
const CFaUser = chakra(FaUser as any);
const CFaImage = chakra(FaImage as any);

interface Performance {
    id: number;
    title: string;
    description: string;
    duration: number;
    genre: string;
    director: string;
    premiere_date: string;
    image_url: string;
    is_active: boolean;
}

const genres = [
    'Драма',
    'Комедия',
    'Трагедия',
    'Мюзикл',
    'Опера',
    'Балет',
    'Детский спектакль',
    'Современная драма',
    'Классика',
    'Экспериментальный'
];

const PerformancesPage: React.FC = () => {
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [currentPerformance, setCurrentPerformance] = useState<Partial<Performance>>({
        is_active: true
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const toast = useToast();

    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        fetchPerformances();
    }, []);

    const fetchPerformances = async () => {
        try {
            const response = await axios.get('http://localhost:8000/perfomances/');
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentPerformance(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (imageUrl: string) => {
        setCurrentPerformance(prev => ({
            ...prev,
            image_url: imageUrl
        }));
    };

    const handleImageRemove = () => {
        setCurrentPerformance(prev => ({
            ...prev,
            image_url: ''
        }));
    };

    const handleCreatePerformance = async () => {
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:8000/perfomances/', currentPerformance);
            toast({
                title: 'Успешно',
                description: 'Спектакль создан',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            resetForm();
            fetchPerformances();
        } catch (error) {
            console.error('Ошибка при создании спектакля:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось создать спектакль',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdatePerformance = async () => {
        if (!currentPerformance.id) return;

        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:8000/perfomances/${currentPerformance.id}/`, currentPerformance);
            toast({
                title: 'Успешно',
                description: 'Спектакль обновлен',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            resetForm();
            fetchPerformances();
        } catch (error) {
            console.error('Ошибка при обновлении спектакля:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось обновить спектакль',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePerformance = async () => {
        if (!deleteId) return;

        try {
            await axios.delete(`http://localhost:8000/perfomances/${deleteId}/`);
            toast({
                title: 'Успешно',
                description: 'Спектакль удален',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            fetchPerformances();
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

    const resetForm = () => {
        setCurrentPerformance({ is_active: true });
        onFormClose();
    };

    const openEditForm = (performance: Performance) => {
        setCurrentPerformance(performance);
        onFormOpen();
    };

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}ч ${mins}мин`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const renderPerformanceCards = () => {
        if (isLoading) {
            return (
                <Flex justify="center" align="center" minH="400px">
                    <Spinner size="xl" color={primaryColor} />
                </Flex>
            );
        }

        if (performances.length === 0) {
            return (
                <Box textAlign="center" py={20}>
                    <CFaTheaterMasks size="4em" color="#666" />
                    <Text mt={4} color="#666" fontSize="lg">
                        Спектакли не найдены
                    </Text>
                </Box>
            );
        }

        return (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(auto-fill, minmax(350px, 1fr))' }} gap={6}>
                {performances.map((performance) => (
                    <MotionGridItem
                        key={performance.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <MotionBox
                            bg="rgba(255,255,255,0.05)"
                            p={4}
                            borderRadius="xl"
                            border="1px solid"
                            borderColor="rgba(255,255,255,0.1)"
                            backdropFilter="blur(10px)"
                            position="relative"
                            overflow="hidden"
                            whileHover={{ borderColor: secondaryColor, boxShadow: `0 0 20px ${secondaryColor}50` }}
                            transition={{ duration: 0.3 }}
                        >
                            {performance.image_url && (
                                <Image
                                    src={performance.image_url}
                                    alt={performance.title}
                                    w="100%"
                                    h="200px"
                                    objectFit="cover"
                                    borderRadius="md"
                                    mb={4}
                                />
                            )}

                            <VStack align="stretch" spacing={3}>
                                <Heading size="md" fontFamily="Playfair Display" noOfLines={2}>
                                    {performance.title}
                                </Heading>

                                <Text noOfLines={3} fontSize="sm" color="#CCCCCC">
                                    {performance.description}
                                </Text>

                                <HStack spacing={2} flexWrap="wrap">
                                    <Badge colorScheme="blue" variant="subtle">
                                        {performance.genre}
                                    </Badge>
                                    <Badge colorScheme="green" variant="subtle">
                                        {formatDuration(performance.duration)}
                                    </Badge>
                                    {performance.is_active ? (
                                        <Badge colorScheme="green">Активный</Badge>
                                    ) : (
                                        <Badge colorScheme="gray">Неактивный</Badge>
                                    )}
                                </HStack>

                                <Text fontSize="sm" color="#AAAAAA">
                                    <CFaUser style={{ display: 'inline', marginRight: '4px' }} />
                                    Режиссёр: {performance.director}
                                </Text>

                                <Text fontSize="sm" color="#AAAAAA">
                                    <CFaCalendar style={{ display: 'inline', marginRight: '4px' }} />
                                    Премьера: {formatDate(performance.premiere_date)}
                                </Text>

                                <Flex justify="flex-end" gap={2} mt={2}>
                                    <Tooltip label="Редактировать" hasArrow>
                                        <IconButton
                                            size="sm"
                                            icon={<CFaEdit />}
                                            colorScheme="blue"
                                            variant="ghost"
                                            onClick={() => openEditForm(performance)}
                                            aria-label="Редактировать спектакль"
                                        />
                                    </Tooltip>

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
                            Управление спектаклями
                        </Heading>
                        <Text color="#AAAAAA">
                            CRUD операции для управления спектаклями
                        </Text>
                    </VStack>

                    <MotionButton
                        leftIcon={<CFaPlus />}
                        bg={primaryColor}
                        _hover={{ bg: '#900030' }}
                        onClick={onFormOpen}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Добавить спектакль
                    </MotionButton>
                </Flex>

                {renderPerformanceCards()}
            </Container>

            {/* Модальное окно для создания/редактирования */}
            <Modal isOpen={isFormOpen} onClose={resetForm} size="4xl" scrollBehavior="inside">
                <ModalOverlay bg="blackAlpha.700" />
                <ModalContent bg="#222222" color="white">
                    <ModalHeader borderBottom="1px solid #333333" fontFamily="Playfair Display">
                        {currentPerformance.id ? 'Редактировать спектакль' : 'Добавить новый спектакль'}
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody py={6}>
                        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                            {/* Левая колонка */}
                            <VStack spacing={4} align="stretch">
                                <FormControl>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <CFaTheaterMasks color={primaryColor} />
                                        <Text as="span" fontWeight="semibold">Название спектакля</Text>
                                    </FormLabel>
                                    <Input
                                        name="title"
                                        placeholder="Название спектакля"
                                        value={currentPerformance.title || ''}
                                        onChange={handleInputChange}
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <CFaUser color={primaryColor} />
                                        <Text as="span" fontWeight="semibold">Режиссёр</Text>
                                    </FormLabel>
                                    <Input
                                        name="director"
                                        placeholder="Имя режиссёра"
                                        value={currentPerformance.director || ''}
                                        onChange={handleInputChange}
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <CFaCalendar color={primaryColor} />
                                        <Text as="span" fontWeight="semibold">Дата премьеры</Text>
                                    </FormLabel>
                                    <Input
                                        name="premiere_date"
                                        type="date"
                                        value={currentPerformance.premiere_date || ''}
                                        onChange={handleInputChange}
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <CFaClock color={primaryColor} />
                                        <Text as="span" fontWeight="semibold">Продолжительность (минуты)</Text>
                                    </FormLabel>
                                    <NumberInput
                                        min={0}
                                        value={currentPerformance.duration || 0}
                                        onChange={(valueString) => setCurrentPerformance(prev => ({
                                            ...prev,
                                            duration: parseInt(valueString) || 0
                                        }))}
                                    >
                                        <NumberInputField
                                            placeholder="Продолжительность"
                                            bg="#333333"
                                            borderColor="#444444"
                                            _hover={{ borderColor: '#555555' }}
                                        />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper color="white" />
                                            <NumberDecrementStepper color="white" />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>

                                <FormControl>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <CFaTheaterMasks color={primaryColor} />
                                        <Text as="span" fontWeight="semibold">Жанр</Text>
                                    </FormLabel>
                                    <Select
                                        name="genre"
                                        value={currentPerformance.genre || ''}
                                        onChange={handleInputChange}
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                    >
                                        <option value="">Выберите жанр</option>
                                        {genres.map(genre => (
                                            <option key={genre} value={genre}>{genre}</option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </VStack>

                            {/* Правая колонка */}
                            <VStack spacing={4} align="stretch">
                                <FormControl>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <CFaImage color={primaryColor} />
                                        <Text as="span" fontWeight="semibold">Постер спектакля</Text>
                                    </FormLabel>
                                    <ImageUpload
                                        currentImageUrl={currentPerformance.image_url}
                                        onImageUpload={handleImageUpload}
                                        onImageRemove={handleImageRemove}
                                        contentType="perfomances"
                                        maxSize={10}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontWeight="semibold">Описание спектакля</FormLabel>
                                    <Textarea
                                        name="description"
                                        placeholder="Описание спектакля"
                                        value={currentPerformance.description || ''}
                                        onChange={handleInputChange}
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                        rows={8}
                                    />
                                </FormControl>
                            </VStack>
                        </Grid>
                    </ModalBody>

                    <ModalFooter borderTop="1px solid #333333">
                        <HStack spacing={3}>
                            <Button
                                leftIcon={<CFaTimes />}
                                variant="outline"
                                onClick={resetForm}
                                disabled={isSubmitting}
                            >
                                Отмена
                            </Button>
                            <Button
                                leftIcon={currentPerformance.id ? <CFaSave /> : <CFaPlus />}
                                bg={primaryColor}
                                _hover={{ bg: '#900030' }}
                                onClick={currentPerformance.id ? handleUpdatePerformance : handleCreatePerformance}
                                isLoading={isSubmitting}
                                loadingText={currentPerformance.id ? 'Обновление...' : 'Создание...'}
                            >
                                {currentPerformance.id ? 'Обновить' : 'Создать'}
                            </Button>
                        </HStack>
                    </ModalFooter>
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
                        <AlertDialogHeader fontFamily="Playfair Display">
                            Удалить спектакль
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Вы уверены, что хотите удалить этот спектакль? Это действие нельзя отменить.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose}>
                                Отмена
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDeletePerformance}
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