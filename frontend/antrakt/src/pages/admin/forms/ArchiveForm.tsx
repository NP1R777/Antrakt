import React, { useState } from 'react';
import {
    Button,
    VStack,
    FormControl,
    FormLabel,
    Flex,
    Textarea,
    Input,
    Switch,
    Text,
    Grid,
    HStack,
    useToast
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    FaCalendar,
    FaImage,
    FaTimes,
    FaSave,
    FaArchive
} from 'react-icons/fa';
import axios from 'axios';
import { chakra } from '@chakra-ui/react';
import ImageUpload from '../../../components/ImageUpload';

const MotionButton = motion(Button);
const CFaCalendar = chakra(FaCalendar as any);
const CFaImage = chakra(FaImage as any);
const CFaTimes = chakra(FaTimes as any);
const CFaSave = chakra(FaSave as any);
const CFaArchive = chakra(FaArchive as any);

const primaryColor = '#800020';
const accentColor = '#4ECDC4';

interface Archive {
    id?: number;
    title: string; // Добавлено поле title
    description: string;
    premiere_date: string;
    afisha: boolean;
    image_url: string;
    deleted_at?: string | null;
}

export const ArchiveForm: React.FC<{
    initialData?: Archive;
    onSuccess: () => void;
    onCancel: () => void;
}> = ({ initialData, onSuccess, onCancel }) => {
    const [archive, setArchive] = useState<Archive>(initialData || {
        title: '',
        description: '',
        premiere_date: '',
        afisha: true,
        image_url: '',
        deleted_at: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setArchive(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (imageUrl: string) => {
        setArchive(prev => ({
            ...prev,
            image_url: imageUrl
        }));
    };

    const handleImageRemove = () => {
        setArchive(prev => ({
            ...prev,
            image_url: ''
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (archive.id) {
                await axios.put(`http://localhost:8000/archive${archive.id}/`, archive);
                toast({
                    title: 'Успех!',
                    description: 'Запись архива успешно обновлена',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                await axios.post('http://localhost:8000/archive/', archive);
                toast({
                    title: 'Успех!',
                    description: 'Запись архива успешно добавлена',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            }
            onSuccess();
        } catch (error) {
            console.error('Ошибка при сохранении записи архива:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось сохранить запись архива',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <VStack spacing={6} align="stretch">
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                {/* Левая колонка */}
                <VStack spacing={4} align="stretch">
                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaArchive color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Название записи</Text>
                        </FormLabel>
                        <Input
                            name="title"
                            placeholder="Название архивной записи"
                            value={archive.title || ''}
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
                            value={archive.premiere_date || ''}
                            onChange={handleInputChange}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="afisha" mb="0" fontWeight="semibold">
                            Статус записи
                        </FormLabel>
                        <Switch
                            id="afisha"
                            isChecked={archive.afisha}
                            onChange={(e) => setArchive(prev => ({
                                ...prev,
                                afisha: e.target.checked
                            }))}
                            colorScheme="green"
                        />
                        <Text ml={3} color={archive.afisha ? "green.300" : "purple.300"}>
                            {archive.afisha ? "В афише" : "В архиве"}
                        </Text>
                    </FormControl>
                </VStack>

                {/* Правая колонка */}
                <VStack spacing={4} align="stretch">
                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaImage color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Изображение</Text>
                        </FormLabel>
                        <ImageUpload
                            currentImageUrl={archive.image_url}
                            onImageUpload={handleImageUpload}
                            onImageRemove={handleImageRemove}
                            contentType="archive"
                            maxSize={10}
                            disabled={isSubmitting}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaArchive color={accentColor} />
                            <Text as="span" fontWeight="semibold">Описание</Text>
                        </FormLabel>
                        <Textarea
                            name="description"
                            placeholder="Описание архивной записи"
                            value={archive.description || ''}
                            onChange={handleInputChange}
                            focusBorderColor={accentColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                            minH="200px"
                        />
                        <Text mt={2} fontSize="sm" color="#AAAAAA">
                            Максимум 2000 символов
                        </Text>
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
                    onClick={handleSubmit}
                    leftIcon={<CFaSave />}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {archive.id ? 'Обновить' : 'Создать'}
                </MotionButton>
            </Flex>
        </VStack>
    );
};