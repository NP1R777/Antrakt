import React, { useState } from 'react';
import {
    Button,
    VStack,
    FormControl,
    FormLabel,
    Flex,
    Input,
    Textarea,
    Select,
    Switch,
    Text,
    Grid,
    HStack,
    IconButton,
    Wrap,
    Tag,
    TagLabel,
    TagCloseButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Box,
    Image,
    Center
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPlus,
    FaTheaterMasks,
    FaUser,
    FaCalendar,
    FaClock,
    FaImage,
    FaTimes,
    FaSave,
    FaUsers,
    FaChild,
    FaTrash,
    FaLink
} from 'react-icons/fa';
import axios from 'axios';
import { chakra, useToast } from '@chakra-ui/react';
import ImageUpload from '../../../components/ImageUpload';

const MotionButton = motion(Button);
const MotionTag = motion(Tag);
const MotionBox = motion(Box);
const CFaPlus = chakra(FaPlus as any);
const CFaTheaterMasks = chakra(FaTheaterMasks as any);
const CFaUser = chakra(FaUser as any);
const CFaCalendar = chakra(FaCalendar as any);
const CFaClock = chakra(FaClock as any);
const CFaImage = chakra(FaImage as any);
const CFaTimes = chakra(FaTimes as any);
const CFaSave = chakra(FaSave as any);
const CFaUsers = chakra(FaUsers as any);
const CFaChild = chakra(FaChild as any);
const CFaTrash = chakra(FaTrash as any);
const CFaLink = chakra(FaLink as any);

const primaryColor = '#800020';
const accentColor = '#4ECDC4';

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
    performances_image: string;
    images_list: string[];
    ticket_url?: string; // Added field for ticket purchase link
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

const ageLimits = [
    '0+',
    '6+',
    '12+',
    '16+',
    '18+'
];

export const PerformanceForm: React.FC<{
    initialData?: Partial<Performance>;
    onSuccess: () => void;
    onCancel: () => void;
}> = ({ initialData, onSuccess, onCancel }) => {
    const [currentPerformance, setCurrentPerformance] = useState<Partial<Performance>>(initialData || {
        is_active: true,
        production_team: [],
        the_cast: [],
        afisha: true,
        deleted_at: null,
        performances_image: '',
        images_list: [],
        ticket_url: '' // Initialize ticket_url
    });
    const [listInputs, setListInputs] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGalleryUploading, setIsGalleryUploading] = useState(false);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentPerformance(prev => ({ ...prev, [name]: value }));
    };

    const handleListInputChange = (field: string, value: string) => {
        setListInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleAddToList = (field: keyof Performance) => {
        if (!listInputs[field]?.trim()) return;

        const currentList = Array.isArray(currentPerformance[field])
            ? [...(currentPerformance[field] as string[])]
            : [];

        const newItem = listInputs[field].trim();

        setCurrentPerformance(prev => ({
            ...prev,
            [field]: [...currentList, newItem]
        }));

        setListInputs(prev => ({ ...prev, [field]: '' }));
    };

    const handleRemoveFromList = (field: keyof Performance, index: number) => {
        const currentList = Array.isArray(currentPerformance[field])
            ? [...(currentPerformance[field] as string[])]
            : [];

        currentList.splice(index, 1);

        setCurrentPerformance(prev => ({
            ...prev,
            [field]: currentList
        }));
    };

    const handleImageUpload = (imageUrl: string, field: string) => {
        setCurrentPerformance(prev => ({
            ...prev,
            [field]: imageUrl
        }));
    };

    const handleImageRemove = (field: string) => {
        setCurrentPerformance(prev => ({
            ...prev,
            [field]: ''
        }));
    };

    const handleAddGalleryImage = (imageUrl: string) => {
        if (!imageUrl) return;

        setCurrentPerformance(prev => ({
            ...prev,
            images_list: [...(prev.images_list || []), imageUrl]
        }));
    };

    const handleRemoveGalleryImage = (index: number) => {
        if (!currentPerformance.images_list) return;

        const newImages = [...currentPerformance.images_list];
        newImages.splice(index, 1);

        setCurrentPerformance(prev => ({
            ...prev,
            images_list: newImages
        }));
    };

    const handleCreatePerformance = async () => {
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:8000/perfomances/', currentPerformance);
            toast({
                title: 'Успех!',
                description: 'Спектакль успешно добавлен',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            onSuccess();
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
            toast({
                title: 'Успех!',
                description: 'Спектакль успешно обновлён',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            onSuccess();
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

    const renderListField = (field: keyof Performance, label: string, icon: React.ReactElement) => (
        <FormControl>
            <FormLabel display="flex" alignItems="center" gap={2} mb={2}>
                {icon}
                <Text as="span" fontWeight="semibold">{label}</Text>
            </FormLabel>

            <HStack mb={2}>
                <Input
                    value={listInputs[field] || ''}
                    onChange={(e) => handleListInputChange(field, e.target.value)}
                    placeholder={`Добавить ${label.toLowerCase()}`}
                    focusBorderColor={accentColor}
                    bg="#333333"
                    borderColor="#444444"
                    _hover={{ borderColor: '#555555' }}
                />
                <IconButton
                    aria-label={`Добавить ${label.toLowerCase()}`}
                    icon={<CFaPlus />}
                    onClick={() => handleAddToList(field)}
                    bg={accentColor}
                    _hover={{ bg: '#5EDDD5' }}
                />
            </HStack>

            <Wrap spacing={2} minH="50px" mb={4}>
                <AnimatePresence>
                    {Array.isArray(currentPerformance[field]) && (currentPerformance[field] as string[]).map((item, index) => (
                        <MotionTag
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            size="md"
                            variant="solid"
                            bg="#444444"
                            borderRadius="full"
                            px={3}
                            py={1}
                        >
                            <TagLabel>{item}</TagLabel>
                            <TagCloseButton onClick={() => handleRemoveFromList(field, index)} />
                        </MotionTag>
                    ))}
                </AnimatePresence>
            </Wrap>
        </FormControl>
    );

    return (
        <>
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
                            <Text as="span" fontWeight="semibold">Автор спектакля</Text>
                        </FormLabel>
                        <Input
                            name="author"
                            placeholder="Автор пьесы"
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
                            <Text as="span" fontWeight="semibold">Продолжительность (HH:MM:SS)</Text>
                        </FormLabel>
                        <Input
                            name="duration"
                            type="time"
                            step="1"
                            placeholder="Продолжительность (HH:MM:SS)"
                            value={currentPerformance.duration || ''}
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
                        <Input
                            name="genre"
                            placeholder="Введите жанр"
                            value={currentPerformance.genre || ''}
                            onChange={handleInputChange}
                            list="genres"
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        />
                        <datalist id="genres">
                            {genres.map(genre => (
                                <option key={genre} value={genre} />
                            ))}
                        </datalist>
                    </FormControl>

                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaChild color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Возрастное ограничение</Text>
                        </FormLabel>
                        <Select
                            name="age_limit"
                            value={currentPerformance.age_limit || ''}
                            onChange={handleInputChange}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        >
                            <option value="" style={{ backgroundColor: '#333333', color: 'white' }}>Выберите ограничение</option>
                            {ageLimits.map(limit => (
                                <option key={limit} value={limit} style={{ backgroundColor: '#333333', color: 'white' }}>{limit}</option>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="afisha" mb="0" fontWeight="semibold">
                            Статус спектакля
                        </FormLabel>
                        <Switch
                            id="afisha"
                            isChecked={currentPerformance.afisha}
                            onChange={(e) => setCurrentPerformance(prev => ({
                                ...prev,
                                afisha: e.target.checked
                            }))}
                            colorScheme="green"
                        />
                        <Text ml={3} color={currentPerformance.afisha ? "green.300" : "purple.300"}>
                            {currentPerformance.afisha ? "В афише" : "В спектаклях"}
                        </Text>
                    </FormControl>

                    {/* Conditional ticket_url field */}
                    {currentPerformance.afisha && (
                        <FormControl>
                            <FormLabel display="flex" alignItems="center" gap={2}>
                                <CFaLink color={primaryColor} />
                                <Text as="span" fontWeight="semibold">Ссылка на покупку билетов</Text>
                            </FormLabel>
                            <Input
                                name="ticket_url"
                                placeholder="URL для покупки билетов"
                                value={currentPerformance.ticket_url || ''}
                                onChange={handleInputChange}
                                focusBorderColor={primaryColor}
                                bg="#333333"
                                borderColor="#444444"
                                _hover={{ borderColor: '#555555' }}
                            />
                        </FormControl>
                    )}

                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaImage color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Фото спектакля</Text>
                        </FormLabel>
                        <ImageUpload
                            currentImageUrl={currentPerformance.performances_image}
                            onImageUpload={(imageUrl) => handleImageUpload(imageUrl, 'performances_image')}
                            onImageRemove={() => handleImageRemove('performances_image')}
                            contentType="perfomances"
                            maxSize={10}
                            disabled={isSubmitting}
                        />
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
                            onImageUpload={(imageUrl) => handleImageUpload(imageUrl, 'image_url')}
                            onImageRemove={() => handleImageRemove('image_url')}
                            contentType="perfomances"
                            maxSize={10}
                            disabled={isSubmitting}
                        />
                    </FormControl>

                    {renderListField('production_team', 'Постановочная команда', <CFaUsers color={accentColor} />)}
                    {renderListField('the_cast', 'Актёрский состав', <CFaUser color={accentColor} />)}

                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaImage color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Фотогалерея спектакля</Text>
                        </FormLabel>

                        <Box
                            border="1px dashed"
                            borderColor="gray.600"
                            borderRadius="md"
                            p={4}
                            mb={4}
                            bg="rgba(30, 30, 30, 0.5)"
                        >
                            {currentPerformance.images_list?.length ? (
                                <Wrap spacing={3} mb={4}>
                                    <AnimatePresence>
                                        {currentPerformance.images_list.map((url, index) => (
                                            <MotionBox
                                                key={index}
                                                position="relative"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Image
                                                    src={url}
                                                    boxSize="100px"
                                                    objectFit="cover"
                                                    borderRadius="md"
                                                    border="1px solid"
                                                    borderColor="gray.600"
                                                />
                                                <IconButton
                                                    aria-label="Удалить фото"
                                                    icon={<CFaTrash />}
                                                    size="xs"
                                                    position="absolute"
                                                    top="-8px"
                                                    right="-8px"
                                                    borderRadius="full"
                                                    bg="red.500"
                                                    color="white"
                                                    _hover={{ bg: 'red.600' }}
                                                    onClick={() => handleRemoveGalleryImage(index)}
                                                />
                                            </MotionBox>
                                        ))}
                                    </AnimatePresence>
                                </Wrap>
                            ) : (
                                <Center minH="100px" color="gray.500" fontSize="sm">
                                    Нет загруженных фотографий
                                </Center>
                            )}

                            <Button
                                leftIcon={<CFaPlus />}
                                colorScheme="teal"
                                variant="outline"
                                onClick={onOpen}
                                isLoading={isGalleryUploading}
                                w="full"
                            >
                                Добавить фотографию
                            </Button>
                        </Box>
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

            <Flex justify="flex-end" mt={6}>
                <Button
                    variant="outline"
                    mr={3}
                    onClick={onCancel}
                    leftIcon={<CFaTimes />}
                    bg="#B00040"
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
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent bg="gray.800" color="white">
                    <ModalHeader>Добавить фотографию в галерею</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ImageUpload
                            currentImageUrl={null}
                            onImageUpload={(imageUrl) => {
                                handleAddGalleryImage(imageUrl);
                                onClose();
                            }}
                            onImageRemove={() => { }}
                            contentType="perfomances"
                            maxSize={10}
                            disabled={isSubmitting}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={onClose}>
                            Отмена
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};