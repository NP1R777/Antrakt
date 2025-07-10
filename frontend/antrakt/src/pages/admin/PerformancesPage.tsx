import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Grid, GridItem, Heading, Flex, Button, VStack, HStack, Badge, Container, chakra, Input, Textarea, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useToast, Spinner, Text, FormControl, FormLabel, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select, IconButton, Tooltip, Image, Switch
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaTheaterMasks, FaCalendar, FaClock, FaUser, FaImage, FaHistory
} from 'react-icons/fa';
import axios from 'axios';
import ImageUpload from '../../components/ImageUpload';

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);
const MotionButton = motion(Button);

const primaryColor = '#800020';
const secondaryColor = '#A00030';
const accentColor = '#4ECDC4';

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
const CFaHistory = chakra(FaHistory as any);

const genres = [
    'Драма', 'Комедия', 'Трагедия', 'Мюзикл', 'Опера', 'Балет', 'Детский спектакль', 'Современная драма', 'Классика', 'Экспериментальный'
];

interface Performance {
    id: number;
    title: string;
    author: string;
    genre: string;
    age_limit: string;
    duration: string; // формат HH:MM
    premiere_date: string;
    production_team: string[];
    the_cast: string[];
    description: string;
    afisha: boolean;
    image_url: string;
    deleted_at?: string | null;
}

const defaultPerformance: Partial<Performance> = {
    afisha: false,
    production_team: [],
    the_cast: [],
};

const PerformancesPage: React.FC = () => {
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [currentPerformance, setCurrentPerformance] = useState<Partial<Performance>>(defaultPerformance);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [restoringId, setRestoringId] = useState<number | null>(null);
    const [listInputs, setListInputs] = useState<{ [key: string]: string }>({});
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
            toast({ title: 'Ошибка', description: 'Не удалось загрузить спектакли', status: 'error', duration: 3000, isClosable: true });
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setCurrentPerformance(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleListInputChange = (field: string, value: string) => {
        setListInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleAddToList = (field: keyof Performance) => {
        if (!listInputs[field]?.trim()) return;
        const currentList = Array.isArray(currentPerformance[field]) ? [...(currentPerformance[field] as string[])] : [];
        setCurrentPerformance(prev => ({ ...prev, [field]: [...currentList, listInputs[field].trim()] }));
        setListInputs(prev => ({ ...prev, [field]: '' }));
    };

    const handleRemoveFromList = (field: keyof Performance, index: number) => {
        const currentList = Array.isArray(currentPerformance[field]) ? [...(currentPerformance[field] as string[])] : [];
        currentList.splice(index, 1);
        setCurrentPerformance(prev => ({ ...prev, [field]: currentList }));
    };

    const handleImageUpload = (imageUrl: string) => {
        setCurrentPerformance(prev => ({ ...prev, image_url: imageUrl }));
    };

    const handleImageRemove = () => {
        setCurrentPerformance(prev => ({ ...prev, image_url: '' }));
    };

    const handleCreatePerformance = async () => {
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:8000/perfomances/', currentPerformance);
            toast({ title: 'Успешно', description: 'Спектакль создан', status: 'success', duration: 3000, isClosable: true });
            resetForm();
            fetchPerformances();
        } catch (error) {
            toast({ title: 'Ошибка', description: 'Не удалось создать спектакль', status: 'error', duration: 3000, isClosable: true });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdatePerformance = async () => {
        if (!currentPerformance.id) return;
        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:8000/perfomances/${currentPerformance.id}/`, currentPerformance);
            toast({ title: 'Успешно', description: 'Спектакль обновлен', status: 'success', duration: 3000, isClosable: true });
            resetForm();
            fetchPerformances();
        } catch (error) {
            toast({ title: 'Ошибка', description: 'Не удалось обновить спектакль', status: 'error', duration: 3000, isClosable: true });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSoftDeletePerformance = async (id: number) => {
        try {
            await axios.put(`http://localhost:8000/perfomances/${id}/`, { deleted_at: new Date().toISOString() });
            toast({ title: 'Спектакль удалён', status: 'info', duration: 3000, isClosable: true });
            fetchPerformances();
        } catch (error) {
            toast({ title: 'Ошибка', description: 'Не удалось удалить спектакль', status: 'error', duration: 3000, isClosable: true });
        }
    };

    const handleRestorePerformance = async (id: number) => {
        setRestoringId(id);
        try {
            await axios.put(`http://localhost:8000/perfomances/${id}/`, { deleted_at: null });
            toast({ title: 'Спектакль восстановлен', status: 'success', duration: 3000, isClosable: true });
            fetchPerformances();
        } catch (error) {
            toast({ title: 'Ошибка', description: 'Не удалось восстановить спектакль', status: 'error', duration: 3000, isClosable: true });
        } finally {
            setRestoringId(null);
        }
    };

    const resetForm = () => {
        setCurrentPerformance(defaultPerformance);
        onFormClose();
    };

    const openEditForm = (performance: Performance) => {
        setCurrentPerformance(performance);
        onFormOpen();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const formatDuration = (duration: string) => {
        if (!duration) return '';
        const [hours, minutes] = duration.split(':');
        return `${hours}ч ${minutes}мин`;
    };

    const renderListField = (field: keyof Performance, label: string, icon: React.ReactElement) => (
        <FormControl>
            <FormLabel display="flex" alignItems="center" gap={2}>
                {icon}
                <Text as="span" fontWeight="semibold">{label}</Text>
            </FormLabel>
            <HStack>
                <Input
                    value={listInputs[field] || ''}
                    onChange={e => handleListInputChange(field, e.target.value)}
                    placeholder={`Добавить ${label.toLowerCase()}`}
                    focusBorderColor={accentColor}
                    bg="#333333"
                    borderColor="#444444"
                    _hover={{ borderColor: '#555555' }}
                />
                <Tooltip label={`Добавить ${label.toLowerCase()}`} hasArrow>
                    <IconButton
                        aria-label={`Добавить ${label.toLowerCase()}`}
                        icon={<CFaPlus />}
                        onClick={() => handleAddToList(field)}
                        bg={accentColor}
                        _hover={{ bg: '#5EDDD5' }}
                    />
                </Tooltip>
            </HStack>
            <HStack spacing={2} mt={2} flexWrap="wrap">
                {(Array.isArray(currentPerformance[field]) ? currentPerformance[field] : []).map((item, idx) => (
                    <Badge key={idx} colorScheme="teal" px={2} py={1} borderRadius="md">
                        {item}
                        <IconButton
                            aria-label="Удалить"
                            icon={<CFaTimes />}
                            size="xs"
                            ml={2}
                            onClick={() => handleRemoveFromList(field, idx)}
                            variant="ghost"
                            colorScheme="red"
                        />
                    </Badge>
                ))}
            </HStack>
        </FormControl>
    );

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
                    <Text mt={4} color="#666" fontSize="lg">Спектакли не найдены</Text>
                </Box>
            );
        }
        return (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(auto-fill, minmax(400px, 1fr))' }} gap={6}>
                {performances.map(performance => {
                    const isDeleted = !!performance.deleted_at;
                    return (
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
                                style={{
                                    filter: isDeleted ? 'grayscale(0.7) brightness(0.7)' : undefined,
                                    opacity: isDeleted ? 0.7 : 1,
                                    pointerEvents: restoringId === performance.id ? 'none' : undefined,
                                    transition: 'filter 0.3s, opacity 0.3s',
                                }}
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
                                    <HStack justify="space-between" align="start">
                                        <Heading size="md" fontFamily="Playfair Display" noOfLines={2} flex={1}>
                                            {performance.title}
                                        </Heading>
                                        <Badge colorScheme={performance.afisha ? 'purple' : 'blue'} variant="subtle">
                                            {performance.afisha ? 'Афиша' : 'Репертуар'}
                                        </Badge>
                                    </HStack>
                                    <Text fontSize="sm" color="#AAAAAA">
                                        Автор: {performance.author}
                                    </Text>
                                    <Text fontSize="sm" color="#AAAAAA">
                                        Жанр: {performance.genre} | Возраст: {performance.age_limit}
                                    </Text>
                                    <Text fontSize="sm" color="#AAAAAA">
                                        Длительность: {formatDuration(performance.duration)}
                                    </Text>
                                    <Text fontSize="sm" color="#AAAAAA">
                                        Премьера: {formatDate(performance.premiere_date)}
                                    </Text>
                                    <Text noOfLines={3} fontSize="sm" color="#CCCCCC">
                                        {performance.description}
                                    </Text>
                                    <HStack spacing={2} flexWrap="wrap">
                                        {(performance.production_team || []).map((item, idx) => (
                                            <Badge key={idx} colorScheme="teal" variant="subtle">{item}</Badge>
                                        ))}
                                    </HStack>
                                    <HStack spacing={2} flexWrap="wrap">
                                        {(performance.the_cast || []).map((item, idx) => (
                                            <Badge key={idx} colorScheme="orange" variant="subtle">{item}</Badge>
                                        ))}
                                    </HStack>
                                    <Flex justify="flex-end" gap={2} mt={2}>
                                        <Tooltip label="Редактировать" hasArrow>
                                            <IconButton
                                                size="sm"
                                                icon={<CFaEdit />}
                                                colorScheme="blue"
                                                variant="ghost"
                                                onClick={() => openEditForm(performance)}
                                                isDisabled={isDeleted}
                                            />
                                        </Tooltip>
                                        {isDeleted ? (
                                            <Tooltip label="Восстановить" hasArrow>
                                                <IconButton
                                                    size="sm"
                                                    icon={<FaHistory />}
                                                    colorScheme="yellow"
                                                    variant="ghost"
                                                    isLoading={restoringId === performance.id}
                                                    onClick={() => handleRestorePerformance(performance.id)}
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Tooltip label="Удалить" hasArrow>
                                                <IconButton
                                                    size="sm"
                                                    icon={<CFaTrash />}
                                                    colorScheme="red"
                                                    variant="ghost"
                                                    onClick={() => handleSoftDeletePerformance(performance.id)}
                                                />
                                            </Tooltip>
                                        )}
                                    </Flex>
                                </VStack>
                            </MotionBox>
                        </MotionGridItem>
                    );
                })}
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
                        <Text color="#AAAAAA">CRUD операции для управления спектаклями</Text>
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
            <Modal isOpen={isFormOpen} onClose={resetForm} size="4xl" scrollBehavior="inside" isCentered>
                <ModalOverlay bg="blackAlpha.700" />
                <ModalContent bg="#222222" color="white">
                    <ModalHeader borderBottom="1px solid #333333" fontFamily="Playfair Display">
                        {currentPerformance.id ? 'Редактировать спектакль' : 'Добавить новый спектакль'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6} overflowY="auto">
                        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
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
                                        <Text as="span" fontWeight="semibold">Автор</Text>
                                    </FormLabel>
                                    <Input
                                        name="author"
                                        placeholder="Автор спектакля"
                                        value={currentPerformance.author || ''}
                                        onChange={handleInputChange}
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                    />
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
                                <FormControl>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <CFaTheaterMasks color={primaryColor} />
                                        <Text as="span" fontWeight="semibold">Возрастное ограничение</Text>
                                    </FormLabel>
                                    <Input
                                        name="age_limit"
                                        placeholder="12+"
                                        value={currentPerformance.age_limit || ''}
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
                                        <Text as="span" fontWeight="semibold">Длительность (чч:мм)</Text>
                                    </FormLabel>
                                    <Input
                                        name="duration"
                                        type="time"
                                        value={currentPerformance.duration || ''}
                                        onChange={handleInputChange}
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                    />
                                </FormControl>
                                <FormControl display="flex" alignItems="center">
                                    <FormLabel htmlFor="afisha" mb="0" fontWeight="semibold">
                                        Афиша
                                    </FormLabel>
                                    <Switch
                                        id="afisha"
                                        name="afisha"
                                        isChecked={!!currentPerformance.afisha}
                                        onChange={handleInputChange}
                                        colorScheme="purple"
                                    />
                                </FormControl>
                            </VStack>
                            <VStack spacing={4} align="stretch">
                                {renderListField('production_team', 'Постановочная команда', <CFaUser color={accentColor} />)}
                                {renderListField('the_cast', 'Актёрский состав', <CFaUser color={accentColor} />)}
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
            <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent bg="#222222" color="white">
                        <AlertDialogHeader fontFamily="Playfair Display">Удалить спектакль</AlertDialogHeader>
                        <AlertDialogBody>Вы уверены, что хотите удалить этот спектакль? Это действие нельзя отменить.</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose}>Отмена</Button>
                            <Button colorScheme="red" onClick={() => { handleSoftDeletePerformance(deleteId!); onDeleteClose(); setDeleteId(null); }} ml={3}>Удалить</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default PerformancesPage;