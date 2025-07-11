import React, { useState } from 'react';
import {
    Button,
    VStack,
    HStack,
    Grid,
    Text,
    FormControl,
    FormLabel,
    Flex,
    Input,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Wrap,
    IconButton,
    Tooltip,
    useToast,
    Tag,
    TagLabel,
    TagCloseButton
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPlus,
    FaTheaterMasks,
    FaBook,
    FaFilm,
    FaMusic,
    FaQuoteRight,
    FaUser,
    FaHistory,
    FaTimes,
    FaSave
} from 'react-icons/fa';
import axios from 'axios';
import ImageUpload from '../../../components/ImageUpload';
import { chakra } from '@chakra-ui/react';

const MotionTag = motion(Tag);
const CFaPlus = chakra(FaPlus as any);
const CFaTheaterMasks = chakra(FaTheaterMasks as any);
const CFaBook = chakra(FaBook as any);
const CFaFilm = chakra(FaFilm as any);
const CFaMusic = chakra(FaMusic as any);
const CFaQuoteRight = chakra(FaQuoteRight as any);
const CFaUser = chakra(FaUser as any);
const CFaHistory = chakra(FaHistory as any);
const CFaTimes = chakra(FaTimes as any);
const CFaSave = chakra(FaSave as any);

const primaryColor = '#800020';
const accentColor = '#4ECDC4';

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
    deleted_at?: string | null;
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

export const ActorForm: React.FC<{
    initialData?: Partial<Actor>;
    onSuccess: () => void;
    onCancel: () => void;
}> = ({ initialData, onSuccess, onCancel }) => {
    const [currentActor, setCurrentActor] = useState<Partial<Actor>>(initialData || {
        favorite_writer: [],
        favorite_character: [],
        favorite_painter: [],
        favorite_film: [],
        favorite_piece: [],
        favorite_song: [],
        author_song: [],
        perfomances: [],
        role_in_perfomances: [],
        deleted_at: null
    });
    const [listInputs, setListInputs] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const getYearsText = (years: number) => {
        if (years % 10 === 1 && years % 100 !== 11) return `${years} год`;
        if ([2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100)) return `${years} года`;
        return `${years} лет`;
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

    const handleImageUpload = (imageUrl: string) => {
        setCurrentActor(prev => ({
            ...prev,
            image_url: imageUrl
        }));
    };

    const handleImageRemove = () => {
        setCurrentActor(prev => ({
            ...prev,
            image_url: ''
        }));
    };

    const handleCreateActor = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:8000/actors/', currentActor);
            toast({
                title: 'Успех!',
                description: 'Актёр успешно добавлен',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            onSuccess();
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
            toast({
                title: 'Успех!',
                description: 'Актёр успешно обновлён',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            onSuccess();
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

    return (
        <>
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
                        {currentActor.time_in_theatre !== undefined && (
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
                            <Text as="span" fontWeight="semibold">Фотография актёра</Text>
                        </FormLabel>
                        <ImageUpload
                            currentImageUrl={currentActor.image_url}
                            onImageUpload={handleImageUpload}
                            onImageRemove={handleImageRemove}
                            contentType="actors"
                            maxSize={10}
                            disabled={isSubmitting}
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
                <Button
                    bg="#3182CE"
                    _hover={{ bg: '#4299E1' }}
                    isLoading={isSubmitting}
                    onClick={currentActor.id ? handleUpdateActor : handleCreateActor}
                    leftIcon={<CFaSave />}
                >
                    {currentActor.id ? 'Обновить' : 'Создать'}
                </Button>
            </Flex>
        </>
    );
};