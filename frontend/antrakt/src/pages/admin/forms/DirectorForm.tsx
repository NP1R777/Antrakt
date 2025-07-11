import React, { useState } from 'react';
import {
    Button,
    VStack,
    FormControl,
    FormLabel,
    Flex,
    Input,
    Textarea,
    Text,
    Grid,
    Wrap,
    Tag,
    TagLabel,
    TagCloseButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPlus,
    FaUser,
    FaUsers,
    FaFilm,
    FaTimes,
    FaSave,
    FaTheaterMasks
} from 'react-icons/fa';
import axios from 'axios';
import { chakra, useToast } from '@chakra-ui/react';
import ImageUpload from '../../../components/ImageUpload';

const MotionButton = motion(Button);
const MotionTag = motion(Tag);
const CFaPlus = chakra(FaPlus as any);
const CFaUser = chakra(FaUser as any);
const CFaUsers = chakra(FaUsers as any);
const CFaFilm = chakra(FaFilm as any);
const CFaTimes = chakra(FaTimes as any);
const CFaSave = chakra(FaSave as any);
const CFaTheaterMasks = chakra(FaTheaterMasks as any);

const primaryColor = '#800020';
const accentColor = '#4ECDC4';

interface Director {
    id: number;
    name: string;
    description: string;
    perfomances: string[];
    years: number[];
    team_name: string[];
    image_url: string;
    deleted_at?: string | null;
}

interface PerfomanceEntry {
    title: string;
    team: string;
    year: string;
}

export const DirectorForm: React.FC<{
    initialData?: Partial<Director>;
    onSuccess: () => void;
    onCancel: () => void;
}> = ({ initialData, onSuccess, onCancel }) => {
    const [currentDirector, setCurrentDirector] = useState<Partial<Director>>(initialData || {
        perfomances: [],
        years: [],
        team_name: [],
        deleted_at: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [perfomanceModalOpen, setPerfomanceModalOpen] = useState(false);
    const [currentPerfomance, setCurrentPerfomance] = useState<PerfomanceEntry>({
        title: '',
        team: '',
        year: ''
    });
    const toast = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentDirector(prev => ({ ...prev, [name]: value }));
    };

    const handlePerfomanceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentPerfomance(prev => ({ ...prev, [name]: value }));
    };

    const openPerfomanceModal = () => {
        setCurrentPerfomance({ title: '', team: '', year: '' });
        setPerfomanceModalOpen(true);
    };

    const addPerfomanceEntry = () => {
        if (!currentPerfomance.title || !currentPerfomance.team || !currentPerfomance.year) {
            toast({
                title: 'Ошибка',
                description: 'Заполните все поля',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const yearValue = parseInt(currentPerfomance.year);
        if (isNaN(yearValue)) {
            toast({
                title: 'Ошибка',
                description: 'Введите корректный год',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setCurrentDirector(prev => ({
            ...prev,
            perfomances: [...(prev.perfomances || []), currentPerfomance.title],
            team_name: [...(prev.team_name || []), currentPerfomance.team],
            years: [...(prev.years || []), yearValue]
        }));

        setPerfomanceModalOpen(false);
        toast({
            title: 'Успешно',
            description: 'Спектакль добавлен',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    const handleRemovePerfomance = (index: number) => {
        const perfomances = [...(currentDirector.perfomances || [])];
        const teams = [...(currentDirector.team_name || [])];
        const years = [...(currentDirector.years || [])];

        perfomances.splice(index, 1);
        teams.splice(index, 1);
        years.splice(index, 1);

        setCurrentDirector(prev => ({
            ...prev,
            perfomances,
            team_name: teams,
            years
        }));
    };

    const handleImageUpload = (imageUrl: string) => {
        setCurrentDirector(prev => ({
            ...prev,
            image_url: imageUrl
        }));
    };

    const handleImageRemove = () => {
        setCurrentDirector(prev => ({
            ...prev,
            image_url: ''
        }));
    };

    const handleCreateDirector = async () => {
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:8000/directors/', currentDirector);
            toast({
                title: 'Успех!',
                description: 'Режиссёр успешно добавлен',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            onSuccess();
        } catch (error) {
            console.error('Ошибка при создании режиссёра:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось добавить режиссёра',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateDirector = async () => {
        if (!currentDirector.id) return;

        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:8000/director${currentDirector.id}/`, currentDirector);
            toast({
                title: 'Успех!',
                description: 'Режиссёр успешно обновлён',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            onSuccess();
        } catch (error) {
            console.error('Ошибка при обновлении режиссёра:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось обновить режиссёра',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                {/* Левая колонка */}
                <VStack spacing={4} align="stretch">
                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaUser color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Имя режиссёра</Text>
                        </FormLabel>
                        <Input
                            name="name"
                            placeholder="Полное имя"
                            value={currentDirector.name || ''}
                            onChange={handleInputChange}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaUsers color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Описание</Text>
                        </FormLabel>
                        <Textarea
                            name="description"
                            placeholder="Описание режиссёра"
                            value={currentDirector.description || ''}
                            onChange={handleInputChange}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                            rows={5}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaFilm color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Фотография режиссёра</Text>
                        </FormLabel>
                        <ImageUpload
                            currentImageUrl={currentDirector.image_url}
                            onImageUpload={handleImageUpload}
                            onImageRemove={handleImageRemove}
                            contentType="directors"
                            maxSize={10}
                            disabled={isSubmitting}
                        />
                    </FormControl>
                </VStack>

                {/* Правая колонка */}
                <VStack spacing={4} align="stretch">
                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2} mb={2}>
                            <CFaTheaterMasks color={accentColor} />
                            <Text as="span" fontWeight="semibold">Поставленные спектакли</Text>
                        </FormLabel>

                        <Button
                            leftIcon={<CFaPlus />}
                            onClick={openPerfomanceModal}
                            bg={accentColor}
                            _hover={{ bg: '#5EDDD5' }}
                            mb={4}
                        >
                            Добавить спектакль
                        </Button>

                        <Wrap spacing={2} minH="50px" mb={4}>
                            <AnimatePresence>
                                {currentDirector.perfomances?.map((perfomance, index) => (
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
                                            {perfomance}
                                            {currentDirector.team_name?.[index] && ` (${currentDirector.team_name[index]})`}
                                            {currentDirector.years?.[index] && `, ${currentDirector.years[index]} год`}
                                        </TagLabel>
                                        <TagCloseButton onClick={() => handleRemovePerfomance(index)} />
                                    </MotionTag>
                                ))}
                            </AnimatePresence>
                        </Wrap>
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
                    onClick={currentDirector.id ? handleUpdateDirector : handleCreateDirector}
                    leftIcon={<CFaSave />}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {currentDirector.id ? 'Обновить' : 'Создать'}
                </MotionButton>
            </Flex>

            {/* Модальное окно для добавления спектакля */}
            <Modal isOpen={perfomanceModalOpen} onClose={() => setPerfomanceModalOpen(false)} size="md" isCentered>
                <ModalOverlay bg="blackAlpha.700" />
                <ModalContent bg="#222222" color="white" borderRadius="xl">
                    <ModalHeader borderBottom="1px solid #333333" fontFamily="Playfair Display">
                        Добавить спектакль
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody py={6}>
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>Название спектакля</FormLabel>
                                <Input
                                    name="title"
                                    value={currentPerfomance.title}
                                    onChange={handlePerfomanceInputChange}
                                    placeholder="Название"
                                    focusBorderColor={accentColor}
                                    bg="#333333"
                                    borderColor="#444444"
                                    _hover={{ borderColor: '#555555' }}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Коллектив</FormLabel>
                                <Input
                                    name="team"
                                    value={currentPerfomance.team}
                                    onChange={handlePerfomanceInputChange}
                                    placeholder="Название коллектива"
                                    focusBorderColor={accentColor}
                                    bg="#333333"
                                    borderColor="#444444"
                                    _hover={{ borderColor: '#555555' }}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Год постановки</FormLabel>
                                <Input
                                    name="year"
                                    type="number"
                                    value={currentPerfomance.year}
                                    onChange={handlePerfomanceInputChange}
                                    placeholder="Год (например, 2023)"
                                    focusBorderColor={accentColor}
                                    bg="#333333"
                                    borderColor="#444444"
                                    _hover={{ borderColor: '#555555' }}
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>

                    <ModalFooter borderTop="1px solid #333333">
                        <Button
                            variant="outline"
                            mr={3}
                            onClick={() => setPerfomanceModalOpen(false)}
                            bg="#B00040"
                            borderColor="#B00040"
                            _hover={{ bg: 'red' }}
                        >
                            Отмена
                        </Button>
                        <Button
                            bg={accentColor}
                            _hover={{ bg: '#5EDDD5' }}
                            onClick={addPerfomanceEntry}
                        >
                            Добавить
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};