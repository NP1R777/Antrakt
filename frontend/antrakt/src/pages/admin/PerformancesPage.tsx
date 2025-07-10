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
    FaImage,
    FaUndo
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
const CFaUndo = chakra(FaUndo as any);

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
    deleted_at?: string | null;
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
            const response = await axios.post('http://localhost:8000/perfomances/', currentPerformance);
            setPerformances([...performances, response.data]);
            toast({
                title: 'Успех!',
                description: 'Спектакль успешно добавлен',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            resetForm();
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
            await axios.put(`http://localhost:8000/perfomance${currentPerformance.id}/`, currentPerformance);
            setPerformances(performances.map(performance =>
                performance.id === currentPerformance.id ? { ...performance, ...currentPerformance } as Performance : performance
            ));
            toast({
                title: 'Успех!',
                description: 'Спектакль успешно обновлён',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            resetForm();
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

    const handleDeletePerformance = async (id: number) => {
        if (!id) return;

        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:8000/perfomance${id}/`, {
                deleted_at: new Date().toISOString()
            });
            toast({
                title: 'Успех!',
                description: 'Спектакль удалён',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });

            // Обновляем локальное состояние
            setPerformances(prevPerformances =>
                prevPerformances.map(performance =>
                    performance.id === id
                        ? { ...performance, deleted_at: new Date().toISOString() }
                        : performance
                )
            );
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
            setIsSubmitting(false);
            onDeleteClose();
            setDeleteId(null);
        }
    };

    const handleRestorePerformance = async (id: number) => {
        if (!id) return;

        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:8000/perfomance${id}/`, {
                deleted_at: null
            });
            toast({
                title: 'Успех!',
                description: 'Спектакль восстановлен',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });

            // Обновляем локальное состояние
            setPerformances(prevPerformances =>
                prevPerformances.map(performance =>
                    performance.id === id
                        ? { ...performance, deleted_at: null }
                        : performance
                )
            );
        } catch (error) {
            console.error('Ошибка при восстановлении спектакля:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось восстановить спектакль',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
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
                                    opacity={performance.deleted_at ? 0.6 : 1}
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
                                    <Heading
                                        size="md"
                                        fontFamily="Playfair Display"
                                        noOfLines={1}
                                        color={performance.deleted_at ? "#999" : "white"}
                                    >
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
                                        opacity={performance.deleted_at ? 0.6 : 1}
                                    >
                                        {performance.director}
                                    </Badge>
                                </Box>
                            </Flex>

                            <Text
                                noOfLines={3}
                                fontSize="sm"
                                color={performance.deleted_at ? "#999" : "#CCCCCC"}
                                mb={4}
                                fontStyle="italic"
                                opacity={performance.deleted_at ? 0.6 : 1}
                            >
                                {performance.description}
                            </Text>

                            <Flex justify="flex-end" gap={2}>
                                <Tooltip label="Редактировать" hasArrow>
                                    <MotionButton
                                        size="sm"
                                        iconSpacing={0}
                                        bg="transparent"
                                        color="#3182CE"
                                        onClick={() => openEditForm(performance)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        isDisabled={!!performance.deleted_at}
                                    >
                                        <CFaEdit />
                                    </MotionButton>
                                </Tooltip>

                                {performance.deleted_at ? (
                                    <Tooltip label="Восстановить" hasArrow>
                                        <MotionButton
                                            size="sm"
                                            iconSpacing={0}
                                            bg="transparent"
                                            color="#48BB78"
                                            onClick={() => handleRestorePerformance(performance.id)}
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
                                            onClick={() => confirmDelete(performance.id)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <CFaTrash />
                                        </MotionButton>
                                    </Tooltip>
                                )}
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
                    <VStack align="start" spacing={2} mb={{ base: 4, md: 0 }} maxW="100%">
                        <Heading fontSize="3xl" fontFamily="Playfair Display" textShadow={`0 0 15px ${primaryColor}50`}>
                            Управление спектаклями
                        </Heading>
                        <Text color="#AAAAAA">
                            Здесь вы можете управлять данными спектаклей театральной студии "Антракт"
                        </Text>
                    </VStack>

                    <MotionButton
                        leftIcon={<CFaPlus />}
                        bg={primaryColor}
                        _hover={{ bg: '#900030' }}
                        onClick={onFormOpen}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        mb={{ base: 4, md: 0 }}
                    >
                        Добавить спектакль
                    </MotionButton>
                </Flex>

                {renderPerformanceCards()}
            </Container>

            {/* Модальное окно для создания/редактирования */}
            <Modal isOpen={isFormOpen} onClose={resetForm} size="4xl" scrollBehavior="inside" isCentered>
                <ModalOverlay bg="blackAlpha.700" />
                <ModalContent bg="#222222" color="white">
                    <ModalHeader borderBottom="1px solid #333333" fontFamily="Playfair Display">
                        {currentPerformance.id ? 'Редактировать спектакль' : 'Добавить новый спектакль'}
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody py={6} overflowY="auto">
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
                        <Button
                            variant="outline"
                            mr={3}
                            onClick={resetForm}
                            leftIcon={<CFaTimes />}
                            bg='#B00040'
                            borderColor="#B00040"
                            _hover={{ bg: 'red' }}
                        >
                            Отмена
                        </Button>

                        <MotionButton
                            bg="#3182CE"
                            _hover={{ bg: '#4299E1' }}
                            isLoading={isSubmitting}
                            onClick={currentPerformance.id ? handleUpdatePerformance : handleCreatePerformance}
                            leftIcon={<CFaSave />}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {currentPerformance.id ? 'Обновить' : 'Создать'}
                        </MotionButton>
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
                                onClick={() => handleDeletePerformance(deleteId!)}
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