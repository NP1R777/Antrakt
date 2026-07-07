import React, { useState, useEffect } from 'react';
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
    FaTrash
} from 'react-icons/fa';
import axios from 'axios';
import { chakra, useToast } from '@chakra-ui/react';
import ImageUpload from '../../../components/ImageUpload';
import RequiredFieldsHint from '../../../components/admin/RequiredFieldsHint';

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

const primaryColor = '#800020';
const accentColor = '#4ECDC4';

interface PerformanceShow {
    id?: number;
    show_datetime: string; // ISO / datetime-local
    ticket_url?: string | null;
}

interface CastMember {
    id?: number;
    actor: number; // id актёра
    actor_name?: string;
    role: string;
}

interface ActorOption {
    id: number;
    name: string;
}

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
    shows: PerformanceShow[];
    cast: CastMember[];
    afisha: boolean;
    deleted_at?: string | null;
    performances_image: string;
    images_list: string[]; // Добавлено поле для галереи
    ticket_url?: string | null; // Ссылка на покупку билетов
    director?: number | null; // Режиссёр спектакля
    // Данные для карточки на странице режиссёра (используются при авто-добавлении):
    production_title?: string; // Название постановки (если пусто — название спектакля)
    production_collective?: string; // Коллектив постановки
    production_year?: number | null; // Год постановки
}

// Коллективы постановки: два предустановленных варианта (можно ввести свой).
const COLLECTIVE_OPTIONS = [
    'Труппа норильского народного театра',
    'Образцовый коллектив театральная студия «ДА»'
];

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
    // datetime-local требует формат "YYYY-MM-DDTHH:MM". Бэкенд отдаёт время
    // в таймзоне театра (Asia/Krasnoyarsk), поэтому просто берём первые 16
    // символов — это и есть местное время показа.
    const toLocalInput = (value?: string | null) =>
        value ? value.slice(0, 16) : '';

    const normalizeInitial = (data?: Partial<Performance>): Partial<Performance> => {
        const base: Partial<Performance> = {
            is_active: true,
            production_team: [],
            shows: [],
            cast: [],
            afisha: true,
            deleted_at: null,
            performances_image: '',
            images_list: [],
            production_collective: COLLECTIVE_OPTIONS[0] // по умолчанию — труппа Норильского театра
        };
        if (!data) return base;
        return {
            ...base,
            ...data,
            production_team: data.production_team || [],
            images_list: data.images_list || [],
            shows: (data.shows || []).map(s => ({
                ...s,
                show_datetime: toLocalInput(s.show_datetime)
            })),
            cast: (data.cast || []).map(c => ({
                id: c.id,
                actor: c.actor,
                actor_name: c.actor_name,
                role: c.role
            }))
        };
    };

    const [currentPerformance, setCurrentPerformance] = useState<Partial<Performance>>(
        normalizeInitial(initialData)
    );
    const [listInputs, setListInputs] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGalleryUploading, setIsGalleryUploading] = useState(false);
    const [actorOptions, setActorOptions] = useState<ActorOption[]>([]);
    const [directorOptions, setDirectorOptions] = useState<ActorOption[]>([]);
    const [newShow, setNewShow] = useState<{ show_datetime: string; ticket_url: string }>({
        show_datetime: '',
        ticket_url: ''
    });
    const [newCast, setNewCast] = useState<{ actor: string; role: string }>({
        actor: '',
        role: ''
    });
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        // active=1 — только действующие актёры (выбывшие в списке состава не нужны).
        axios.get('http://localhost:8000/actors/?active=1')
            .then(res => setActorOptions(
                (res.data || []).map((a: any) => ({ id: a.id, name: a.name }))
            ))
            .catch(err => console.error('Не удалось загрузить актёров:', err));
        axios.get('http://localhost:8000/directors/')
            .then(res => setDirectorOptions(
                (res.data || []).map((d: any) => ({ id: d.id, name: d.name }))
            ))
            .catch(err => console.error('Не удалось загрузить режиссёров:', err));
    }, []);

    const actorNameById = (id: number) =>
        actorOptions.find(a => a.id === id)?.name || `Актёр #${id}`;

    const handleAddShow = () => {
        if (!newShow.show_datetime) return;
        setCurrentPerformance(prev => ({
            ...prev,
            shows: [...(prev.shows || []), {
                show_datetime: newShow.show_datetime,
                ticket_url: newShow.ticket_url.trim() || null
            }]
        }));
        setNewShow({ show_datetime: '', ticket_url: '' });
    };

    const handleRemoveShow = (index: number) => {
        setCurrentPerformance(prev => {
            const shows = [...(prev.shows || [])];
            shows.splice(index, 1);
            return { ...prev, shows };
        });
    };

    const handleAddCast = () => {
        if (!newCast.actor || !newCast.role.trim()) return;
        const actorId = parseInt(newCast.actor, 10);
        setCurrentPerformance(prev => ({
            ...prev,
            cast: [...(prev.cast || []), {
                actor: actorId,
                actor_name: actorNameById(actorId),
                role: newCast.role.trim()
            }]
        }));
        setNewCast({ actor: '', role: '' });
    };

    const handleRemoveCast = (index: number) => {
        setCurrentPerformance(prev => {
            const cast = [...(prev.cast || [])];
            cast.splice(index, 1);
            return { ...prev, cast };
        });
    };

    const formatShowLabel = (value: string) => {
        if (!value) return '';
        const [datePart, timePart] = value.split('T');
        if (!datePart) return value;
        const [y, m, d] = datePart.split('-');
        return `${d}.${m}.${y}${timePart ? ' ' + timePart.slice(0, 5) : ''}`;
    };

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

    // Добавление изображения в галерею
    const handleAddGalleryImage = (imageUrl: string) => {
        if (!imageUrl) return;

        setCurrentPerformance(prev => ({
            ...prev,
            images_list: [...(prev.images_list || []), imageUrl]
        }));
    };

    // Удаление изображения из галереи
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
            <RequiredFieldsHint required={['Название спектакля', 'Автор', 'Жанр', 'Возрастное ограничение', 'Описание']} />
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
                            <CFaUser color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Режиссёр</Text>
                        </FormLabel>
                        <Select
                            placeholder="Выберите режиссёра"
                            value={currentPerformance.director ?? ''}
                            onChange={(e) => setCurrentPerformance(prev => ({
                                ...prev,
                                director: e.target.value ? parseInt(e.target.value, 10) : null
                            }))}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        >
                            {directorOptions.map(d => (
                                <option key={d.id} value={d.id} style={{ backgroundColor: '#333333', color: 'white' }}>
                                    {d.name}
                                </option>
                            ))}
                        </Select>
                        <Text mt={1} fontSize="sm" color="#AAAAAA">
                            Имя режиссёра видно уже в «Афише». После завершения показов спектакль добавится на его страницу.
                        </Text>
                    </FormControl>

                    {currentPerformance.director ? (
                        <Box
                            border="1px solid"
                            borderColor="#444444"
                            borderRadius="md"
                            p={4}
                            bg="rgba(30, 30, 30, 0.5)"
                        >
                            <Text fontWeight="semibold" mb={3} color="#e0e0e0">
                                Данные для страницы режиссёра
                            </Text>

                            <FormControl mb={3}>
                                <FormLabel fontSize="sm">Название постановки</FormLabel>
                                <Input
                                    name="production_title"
                                    placeholder="Если пусто — берётся название спектакля"
                                    value={currentPerformance.production_title || ''}
                                    onChange={handleInputChange}
                                    focusBorderColor={primaryColor}
                                    bg="#333333"
                                    borderColor="#444444"
                                    _hover={{ borderColor: '#555555' }}
                                />
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel fontSize="sm">Коллектив постановки</FormLabel>
                                <Input
                                    name="production_collective"
                                    list="collectiveOptions"
                                    placeholder="Труппа норильского народного театра"
                                    value={currentPerformance.production_collective || ''}
                                    onChange={handleInputChange}
                                    focusBorderColor={primaryColor}
                                    bg="#333333"
                                    borderColor="#444444"
                                    _hover={{ borderColor: '#555555' }}
                                />
                                <datalist id="collectiveOptions">
                                    {COLLECTIVE_OPTIONS.map(c => (
                                        <option key={c} value={c} />
                                    ))}
                                </datalist>
                                <Text mt={1} fontSize="xs" color="#AAAAAA">
                                    Если пусто — «Труппа норильского народного театра».
                                </Text>
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="sm">Год постановки</FormLabel>
                                <Input
                                    name="production_year"
                                    type="number"
                                    placeholder="Если пусто — год премьеры / показа"
                                    value={currentPerformance.production_year ?? ''}
                                    onChange={(e) => setCurrentPerformance(prev => ({
                                        ...prev,
                                        production_year: e.target.value ? parseInt(e.target.value, 10) : null
                                    }))}
                                    focusBorderColor={primaryColor}
                                    bg="#333333"
                                    borderColor="#444444"
                                    _hover={{ borderColor: '#555555' }}
                                />
                            </FormControl>
                        </Box>
                    ) : null}

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
                            {currentPerformance.afisha ? "В 'Афиша'" : "В 'Спектакли'"}
                        </Text>
                    </FormControl>

                    {currentPerformance.afisha && (
                        <FormControl>
                            <FormLabel display="flex" alignItems="center" gap={2}>
                                <CFaImage color={primaryColor} />
                                <Text as="span" fontWeight="semibold">Ссылка на покупку билетов</Text>
                            </FormLabel>
                            <Input
                                name="ticket_url"
                                type="url"
                                placeholder="https://example.com/your-ticket-link"
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

                    {/* Показы спектакля (несколько дат и времён) */}
                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2} mb={2}>
                            <CFaCalendar color={accentColor} />
                            <Text as="span" fontWeight="semibold">Показы (дата и время)</Text>
                        </FormLabel>
                        <HStack mb={2} align="flex-end">
                            <Input
                                type="datetime-local"
                                value={newShow.show_datetime}
                                onChange={(e) => setNewShow(prev => ({ ...prev, show_datetime: e.target.value }))}
                                focusBorderColor={accentColor}
                                bg="#333333"
                                borderColor="#444444"
                                _hover={{ borderColor: '#555555' }}
                            />
                            <Input
                                placeholder="Ссылка на билеты (необязательно)"
                                value={newShow.ticket_url}
                                onChange={(e) => setNewShow(prev => ({ ...prev, ticket_url: e.target.value }))}
                                focusBorderColor={accentColor}
                                bg="#333333"
                                borderColor="#444444"
                                _hover={{ borderColor: '#555555' }}
                            />
                            <IconButton
                                aria-label="Добавить показ"
                                icon={<CFaPlus />}
                                onClick={handleAddShow}
                                bg={accentColor}
                                _hover={{ bg: '#5EDDD5' }}
                            />
                        </HStack>
                        <Wrap spacing={2} minH="50px" mb={4}>
                            <AnimatePresence>
                                {(currentPerformance.shows || []).map((show, index) => (
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
                                        <TagLabel>{formatShowLabel(show.show_datetime)}</TagLabel>
                                        <TagCloseButton onClick={() => handleRemoveShow(index)} />
                                    </MotionTag>
                                ))}
                            </AnimatePresence>
                        </Wrap>
                    </FormControl>

                    {/* Состав: актёр + роль (скрыт от пользователей, пока спектакль в "Афише") */}
                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2} mb={2}>
                            <CFaUser color={accentColor} />
                            <Text as="span" fontWeight="semibold">Актёрский состав (актёр и роль)</Text>
                        </FormLabel>
                        <HStack mb={2} align="flex-end">
                            <Select
                                placeholder="Выберите актёра"
                                value={newCast.actor}
                                onChange={(e) => setNewCast(prev => ({ ...prev, actor: e.target.value }))}
                                focusBorderColor={accentColor}
                                bg="#333333"
                                borderColor="#444444"
                                _hover={{ borderColor: '#555555' }}
                            >
                                {actorOptions.map(a => (
                                    <option key={a.id} value={a.id} style={{ backgroundColor: '#333333', color: 'white' }}>
                                        {a.name}
                                    </option>
                                ))}
                            </Select>
                            <Input
                                placeholder="Роль"
                                value={newCast.role}
                                onChange={(e) => setNewCast(prev => ({ ...prev, role: e.target.value }))}
                                focusBorderColor={accentColor}
                                bg="#333333"
                                borderColor="#444444"
                                _hover={{ borderColor: '#555555' }}
                            />
                            <IconButton
                                aria-label="Добавить актёра в состав"
                                icon={<CFaPlus />}
                                onClick={handleAddCast}
                                bg={accentColor}
                                _hover={{ bg: '#5EDDD5' }}
                            />
                        </HStack>
                        <Wrap spacing={2} minH="50px" mb={4}>
                            <AnimatePresence>
                                {(currentPerformance.cast || []).map((member, index) => (
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
                                        <TagLabel>
                                            {member.actor_name || actorNameById(member.actor)} — {member.role}
                                        </TagLabel>
                                        <TagCloseButton onClick={() => handleRemoveCast(index)} />
                                    </MotionTag>
                                ))}
                            </AnimatePresence>
                        </Wrap>
                    </FormControl>

                    {/* Секция фотогалереи */}
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

            {/* Модальное окно для загрузки фотографий в галерею */}
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