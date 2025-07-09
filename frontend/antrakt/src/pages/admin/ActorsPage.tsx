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
    Avatar,
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
    Tag,
    TagLabel,
    TagCloseButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormControl,
    FormLabel,
    Wrap,
    IconButton,
    Tooltip
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUserPlus,
    FaTrash,
    FaEdit,
    FaSave,
    FaTimes,
    FaPlus,
    FaTheaterMasks,
    FaBook,
    FaFilm,
    FaMusic,
    FaQuoteRight,
    FaUser,
    FaHistory
} from 'react-icons/fa';
import axios from 'axios';

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);
const MotionButton = motion(Button);
const MotionTag = motion(Tag);

const primaryColor = '#800020';
const secondaryColor = '#A00030';
const accentColor = '#4ECDC4';

// Обернем иконки в chakra для корректной работы
const CFaUserPlus = chakra(FaUserPlus as any);
const CFaTrash = chakra(FaTrash as any);
const CFaEdit = chakra(FaEdit as any);
const CFaSave = chakra(FaSave as any);
const CFaTimes = chakra(FaTimes as any);
const CFaPlus = chakra(FaPlus as any);
const CFaTheaterMasks = chakra(FaTheaterMasks as any);
const CFaBook = chakra(FaBook as any);
const CFaFilm = chakra(FaFilm as any);
const CFaMusic = chakra(FaMusic as any);
const CFaQuoteRight = chakra(FaQuoteRight as any);
const CFaUser = chakra(FaUser as any);
const CFaHistory = chakra(FaHistory as any);

interface Actor {
    id: number;
    name: string;
    place_of_work: string;
    time_in_theatre: number;
    favorite_writer: string[];
    favorite_character: string[];
    favorite_painter: string[];
    favorite_film: string[];
    favorite_piece: string[];
    favorite_quote: string;
    author_quote: string;
    favorite_song: string[];
    author_song: string[];
    perfomances: string[];
    role_in_perfomances: string[];
    image_url: string;
}

const quoteAuthors = [
    "К.С. Станиславский",
    "М.А. Чехов",
    "В.Э. Мейерхольд",
    "Е.Б. Вахтангов",
    "А.П. Чехов",
    "Б. Брехт",
    "В.И. Немирович-Данченко",
    "А. Арто",
    "П. Брук",
    "Е. Гротовский"
];

const ActorsPage: React.FC = () => {
    const [actors, setActors] = useState<Actor[]>([]);
    const [currentActor, setCurrentActor] = useState<Partial<Actor>>({
        favorite_writer: [],
        favorite_character: [],
        favorite_painter: [],
        favorite_film: [],
        favorite_piece: [],
        favorite_song: [],
        author_song: [],
        perfomances: [],
        role_in_perfomances: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [listInputs, setListInputs] = useState<Record<string, string>>({});
    const toast = useToast();

    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        fetchActors();
    }, []);

    const fetchActors = async () => {
        try {
            const response = await axios.get('http://localhost:8000/actors/');
            setActors(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Ошибка при загрузке актёров:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить актёров',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentActor(prev => ({ ...prev, [name]: value }));
    };

    const handleListInputChange = (field: string, value: string) => {
        setListInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleAddToList = (field: keyof Actor) => {
        if (!listInputs[field]?.trim()) return;

        const currentList = Array.isArray(currentActor[field])
            ? [...(currentActor[field] as string[])]
            : [];

        const newItem = listInputs[field].trim();

        setCurrentActor(prev => ({
            ...prev,
            [field]: [...currentList, newItem]
        }));

        setListInputs(prev => ({ ...prev, [field]: '' }));
    };

    const handleRemoveFromList = (field: keyof Actor, index: number) => {
        const currentList = Array.isArray(currentActor[field])
            ? [...(currentActor[field] as string[])]
            : [];

        currentList.splice(index, 1);

        setCurrentActor(prev => ({
            ...prev,
            [field]: currentList
        }));
    };

    const handleCreateActor = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:8000/actors/', currentActor);
            setActors([...actors, response.data]);
            toast({
                title: 'Успех!',
                description: 'Актёр успешно добавлен',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            resetForm();
        } catch (error) {
            console.error('Ошибка при создании актёра:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось добавить актёра',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateActor = async () => {
        if (!currentActor.id) return;

        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:8000/actor${currentActor.id}/`, currentActor);
            setActors(actors.map(actor =>
                actor.id === currentActor.id ? { ...actor, ...currentActor } as Actor : actor
            ));
            toast({
                title: 'Успех!',
                description: 'Актёр успешно обновлён',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            resetForm();
        } catch (error) {
            console.error('Ошибка при обновлении актёра:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось обновить актёра',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteActor = async () => {
        if (!deleteId) return;

        try {
            await axios.delete(`http://localhost:8000/actor${deleteId}/`);
            setActors(actors.filter(actor => actor.id !== deleteId));
            toast({
                title: 'Успех!',
                description: 'Актёр успешно удалён',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Ошибка при удалении актёра:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось удалить актёра',
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
        setCurrentActor({
            favorite_writer: [],
            favorite_character: [],
            favorite_painter: [],
            favorite_film: [],
            favorite_piece: [],
            favorite_song: [],
            author_song: [],
            perfomances: [],
            role_in_perfomances: []
        });
        setListInputs({});
        onFormClose();
    };

    const openEditForm = (actor: Actor) => {
        setCurrentActor(actor);
        onFormOpen();
    };

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const getYearsText = (years: number) => {
        if (years % 10 === 1 && years % 100 !== 11) return `${years} год`;
        if ([2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100)) return `${years} года`;
        return `${years} лет`;
    };

    const renderListField = (field: keyof Actor, label: string, icon: React.ReactElement) => (
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
                    {Array.isArray(currentActor[field]) && (currentActor[field] as string[]).map((item, index) => (
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

    const renderActorCards = () => {
        if (isLoading) {
            return (
                <Flex justify="center" align="center" minH="200px">
                    <Spinner size="xl" color={primaryColor} />
                </Flex>
            );
        }

        if (actors.length === 0) {
            return (
                <Text textAlign="center" fontSize="lg" color="#AAAAAA">
                    Актёры не найдены
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
                {actors.map(actor => (
                    <MotionGridItem
                        key={actor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        w="100%"
                        position="relative"
                        zIndex={1}
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
                            w="100%"
                            maxW="450px"
                            minW="300px"
                            mx="auto"
                            minH="300px"
                        >
                            <Flex align="center" mb={4}>
                                <Avatar
                                    name={actor.name}
                                    src={actor.image_url || undefined}
                                    size="xl"
                                    border={`2px solid ${primaryColor}`}
                                />
                                <Box ml={4} maxW="calc(100% - 80px)">
                                    <Heading size="md" fontFamily="Playfair Display" noOfLines={1}>{actor.name}</Heading>
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
                                        {actor.place_of_work} • {getYearsText(actor.time_in_theatre)}
                                    </Badge>
                                </Box>
                            </Flex>

                            <Text
                                noOfLines={3}
                                fontSize="sm"
                                color="#CCCCCC"
                                mb={4}
                                fontStyle="italic"
                            >
                                "{actor.favorite_quote}" — {actor.author_quote}
                            </Text>

                            <Flex justify="flex-end" gap={2}>
                                <Tooltip label="Редактировать" hasArrow>
                                    <MotionButton
                                        size="sm"
                                        iconSpacing={0}
                                        bg="transparent"
                                        color="#3182CE"
                                        onClick={() => openEditForm(actor)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <CFaEdit />
                                    </MotionButton>
                                </Tooltip>

                                <Tooltip label="Удалить" hasArrow>
                                    <MotionButton
                                        size="sm"
                                        iconSpacing={0}
                                        bg="transparent"
                                        color="#E53E3E"
                                        onClick={() => confirmDelete(actor.id)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <CFaTrash />
                                    </MotionButton>
                                </Tooltip>
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
                            Управление актёрами
                        </Heading>
                        <Text color="#AAAAAA">
                            CRUD операции для управления актёрами театра
                        </Text>
                    </VStack>

                    <MotionButton
                        leftIcon={<CFaUserPlus />}
                        bg={primaryColor}
                        _hover={{ bg: '#900030' }}
                        onClick={onFormOpen}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        mb={{ base: 4, md: 0 }}
                    >
                        Добавить актёра
                    </MotionButton>
                </Flex>

                {renderActorCards()}
            </Container>

            {/* Модальное окно для создания/редактирования */}
            <Modal isOpen={isFormOpen} onClose={resetForm} size="4xl" scrollBehavior="inside" isCentered>
                <ModalOverlay bg="blackAlpha.700" />
                <ModalContent bg="#222222" color="white">
                    <ModalHeader borderBottom="1px solid #333333" fontFamily="Playfair Display">
                        {currentActor.id ? 'Редактировать актёра' : 'Добавить нового актёра'}
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody py={6} overflowY="auto">
                        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                            {/* Левая колонка */}
                            <VStack spacing={4} align="stretch">
                                <FormControl>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <CFaUser color={primaryColor} />
                                        <Text as="span" fontWeight="semibold">Имя и фамилия актёра</Text>
                                    </FormLabel>
                                    <Input
                                        name="name"
                                        placeholder="Полное имя"
                                        value={currentActor.name || ''}
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
                                        <Text as="span" fontWeight="semibold">Место работы</Text>
                                    </FormLabel>
                                    <Input
                                        name="place_of_work"
                                        placeholder="Театр или студия"
                                        value={currentActor.place_of_work || ''}
                                        onChange={handleInputChange}
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <CFaHistory color={primaryColor} />
                                        <Text as="span" fontWeight="semibold">Время в студии</Text>
                                    </FormLabel>
                                    <NumberInput
                                        min={0}
                                        value={currentActor.time_in_theatre || 0}
                                        onChange={(valueString) => setCurrentActor(prev => ({
                                            ...prev,
                                            time_in_theatre: parseInt(valueString) || 0
                                        }))}
                                    >
                                        <NumberInputField
                                            placeholder="Количество лет"
                                            bg="#333333"
                                            borderColor="#444444"
                                            _hover={{ borderColor: '#555555' }}
                                        />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper color="white" />
                                            <NumberDecrementStepper color="white" />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    {currentActor.time_in_theatre && (
                                        <Text mt={1} fontSize="sm" color="#AAAAAA">
                                            {getYearsText(currentActor.time_in_theatre)}
                                        </Text>
                                    )}
                                </FormControl>

                                <FormControl>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <CFaQuoteRight color={primaryColor} />
                                        <Text as="span" fontWeight="semibold">Любимая цитата о театре</Text>
                                    </FormLabel>
                                    <Textarea
                                        name="favorite_quote"
                                        placeholder="Введите цитату"
                                        value={currentActor.favorite_quote || ''}
                                        onChange={handleInputChange}
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                        rows={3}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <CFaUser color={primaryColor} />
                                        <Text as="span" fontWeight="semibold">Автор цитаты</Text>
                                    </FormLabel>
                                    <Input
                                        name="author_quote"
                                        placeholder="Автор цитаты"
                                        value={currentActor.author_quote || ''}
                                        onChange={handleInputChange}
                                        list="quoteAuthors"
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                    />
                                    <datalist id="quoteAuthors">
                                        {quoteAuthors.map(author => (
                                            <option key={author} value={author} />
                                        ))}
                                    </datalist>
                                </FormControl>

                                <FormControl>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <CFaFilm color={primaryColor} />
                                        <Text as="span" fontWeight="semibold">Ссылка на фото</Text>
                                    </FormLabel>
                                    <Input
                                        name="image_url"
                                        placeholder="URL фотографии"
                                        value={currentActor.image_url || ''}
                                        onChange={handleInputChange}
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                    />
                                </FormControl>
                            </VStack>

                            {/* Правая колонка */}
                            <VStack spacing={4} align="stretch">
                                {renderListField('favorite_writer', 'Любимые писатели', <CFaBook color={accentColor} />)}
                                {renderListField('favorite_character', 'Любимые персонажи', <CFaUser color={accentColor} />)}
                                {renderListField('favorite_painter', 'Любимые художники', <CFaUser color={accentColor} />)}
                                {renderListField('favorite_film', 'Любимые фильмы', <CFaFilm color={accentColor} />)}
                                {renderListField('favorite_piece', 'Любимые пьесы', <CFaTheaterMasks color={accentColor} />)}

                                <HStack spacing={4}>
                                    <FormControl>
                                        <FormLabel display="flex" alignItems="center" gap={2}>
                                            <CFaMusic color={accentColor} />
                                            <Text as="span" fontWeight="semibold">Любимые песни</Text>
                                        </FormLabel>
                                        <Input
                                            value={listInputs.favorite_song || ''}
                                            onChange={(e) => handleListInputChange('favorite_song', e.target.value)}
                                            placeholder="Добавить песню"
                                            focusBorderColor={accentColor}
                                            bg="#333333"
                                            borderColor="#444444"
                                            _hover={{ borderColor: '#555555' }}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel display="flex" alignItems="center" gap={2}>
                                            <CFaUser color={accentColor} />
                                            <Text as="span" fontWeight="semibold">Автор</Text>
                                        </FormLabel>
                                        <Input
                                            value={listInputs.author_song || ''}
                                            onChange={(e) => handleListInputChange('author_song', e.target.value)}
                                            placeholder="Добавить автора"
                                            focusBorderColor={accentColor}
                                            bg="#333333"
                                            borderColor="#444444"
                                            _hover={{ borderColor: '#555555' }}
                                        />
                                    </FormControl>

                                    <Tooltip label="Добавить песню" hasArrow placement="top">
                                        <IconButton
                                            aria-label="Добавить песню"
                                            icon={<CFaPlus />}
                                            onClick={() => {
                                                if (listInputs.favorite_song && listInputs.author_song) {
                                                    setCurrentActor(prev => ({
                                                        ...prev,
                                                        favorite_song: [...(prev.favorite_song || []), listInputs.favorite_song],
                                                        author_song: [...(prev.author_song || []), listInputs.author_song]
                                                    }));
                                                    setListInputs(prev => ({
                                                        ...prev,
                                                        favorite_song: '',
                                                        author_song: ''
                                                    }));
                                                }
                                            }}
                                            alignSelf="flex-end"
                                            mt={7}
                                            bg={accentColor}
                                            _hover={{ bg: '#5EDDD5' }}
                                        />
                                    </Tooltip>
                                </HStack>

                                <Wrap spacing={2} minH="50px" mb={4}>
                                    <AnimatePresence>
                                        {Array.isArray(currentActor.favorite_song) &&
                                            currentActor.favorite_song.map((song, index) => (
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
                                                        {song}
                                                        {currentActor.author_song?.[index] &&
                                                            ` (${currentActor.author_song[index]})`}
                                                    </TagLabel>
                                                    <TagCloseButton onClick={() => {
                                                        handleRemoveFromList('favorite_song', index);
                                                        if (currentActor.author_song) {
                                                            const authors = [...currentActor.author_song];
                                                            authors.splice(index, 1);
                                                            setCurrentActor(prev => ({
                                                                ...prev,
                                                                author_song: authors
                                                            }));
                                                        }
                                                    }} />
                                                </MotionTag>
                                            ))}
                                    </AnimatePresence>
                                </Wrap>

                                <HStack spacing={4}>
                                    <FormControl>
                                        <FormLabel display="flex" alignItems="center" gap={2}>
                                            <CFaTheaterMasks color={accentColor} />
                                            <Text as="span" fontWeight="semibold">Спектакли</Text>
                                        </FormLabel>
                                        <Input
                                            value={listInputs.perfomances || ''}
                                            onChange={(e) => handleListInputChange('perfomances', e.target.value)}
                                            placeholder="Добавить спектакль"
                                            focusBorderColor={accentColor}
                                            bg="#333333"
                                            borderColor="#444444"
                                            _hover={{ borderColor: '#555555' }}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel display="flex" alignItems="center" gap={2}>
                                            <CFaUser color={accentColor} />
                                            <Text as="span" fontWeight="semibold">Роли</Text>
                                        </FormLabel>
                                        <Input
                                            value={listInputs.role_in_perfomances || ''}
                                            onChange={(e) => handleListInputChange('role_in_perfomances', e.target.value)}
                                            placeholder="Добавить роль"
                                            focusBorderColor={accentColor}
                                            bg="#333333"
                                            borderColor="#444444"
                                            _hover={{ borderColor: '#555555' }}
                                        />
                                    </FormControl>

                                    <Tooltip label="Добавить спектакль" hasArrow placement="top">
                                        <IconButton
                                            aria-label="Добавить спектакль"
                                            icon={<CFaPlus />}
                                            onClick={() => {
                                                if (listInputs.perfomances && listInputs.role_in_perfomances) {
                                                    setCurrentActor(prev => ({
                                                        ...prev,
                                                        perfomances: [...(prev.perfomances || []), listInputs.perfomances],
                                                        role_in_perfomances: [...(prev.role_in_perfomances || []), listInputs.role_in_perfomances]
                                                    }));
                                                    setListInputs(prev => ({
                                                        ...prev,
                                                        perfomances: '',
                                                        role_in_perfomances: ''
                                                    }));
                                                }
                                            }}
                                            alignSelf="flex-end"
                                            mt={7}
                                            bg={accentColor}
                                            _hover={{ bg: '#5EDDD5' }}
                                        />
                                    </Tooltip>
                                </HStack>

                                <Wrap spacing={2} minH="50px" mb={4}>
                                    <AnimatePresence>
                                        {Array.isArray(currentActor.perfomances) &&
                                            currentActor.perfomances.map((performance, index) => (
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
                                                        {performance}
                                                        {currentActor.role_in_perfomances?.[index] &&
                                                            ` (${currentActor.role_in_perfomances[index]})`}
                                                    </TagLabel>
                                                    <TagCloseButton onClick={() => {
                                                        handleRemoveFromList('perfomances', index);
                                                        if (currentActor.role_in_perfomances) {
                                                            const role_in_perfomances = [...currentActor.role_in_perfomances];
                                                            role_in_perfomances.splice(index, 1);
                                                            setCurrentActor(prev => ({
                                                                ...prev,
                                                                role_in_perfomances: role_in_perfomances
                                                            }));
                                                        }
                                                    }} />
                                                </MotionTag>
                                            ))}
                                    </AnimatePresence>
                                </Wrap>
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
                            onClick={currentActor.id ? handleUpdateActor : handleCreateActor}
                            leftIcon={<CFaSave />}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {currentActor.id ? 'Обновить' : 'Создать'}
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
                            Удаление актёра
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Вы уверены, что хотите удалить этого актёра? Это действие нельзя отменить.
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
                                onClick={handleDeleteActor}
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

export default ActorsPage;