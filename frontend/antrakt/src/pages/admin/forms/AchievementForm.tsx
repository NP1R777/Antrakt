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
    Textarea,
    useToast,
    Input,
    Box,
    Image,
    IconButton,
    SimpleGrid,
} from '@chakra-ui/react';
import { FaTimes, FaSave, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import ImageUpload from '../../../components/ImageUpload';
import RequiredFieldsHint from '../../../components/admin/RequiredFieldsHint';
import { chakra } from '@chakra-ui/react';

const CFaTimes = chakra(FaTimes as any);
const CFaSave = chakra(FaSave as any);
const CFaTrophy = chakra(FaTrophy as any);
const CFaCalendarAlt = chakra(FaCalendarAlt as any);

const primaryColor = '#f2f2f2';
const accentColor = '#c9c9c9';

interface Achievement {
    id?: number;
    achievement: string;
    image_url: string;
    images_list?: string[];
    deleted_at?: string | null;
    assigned?: string | null;
}

export const AchievementForm: React.FC<{
    initialData?: Achievement;
    onSuccess: () => void;
    onCancel: () => void;
}> = ({ initialData, onSuccess, onCancel }) => {
    const [achievement, setAchievement] = useState<Achievement>(initialData || {
        achievement: '',
        image_url: '',
        images_list: [],
        assigned: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const handleImageUpload = (imageUrl: string) => {
        setAchievement(prev => ({
            ...prev,
            image_url: imageUrl
        }));
    };

    const handleImageRemove = () => {
        setAchievement(prev => ({
            ...prev,
            image_url: ''
        }));
    };

    const handleAddGalleryImages = (imageUrls: string[]) => {
        if (!imageUrls?.length) return;
        setAchievement(prev => ({
            ...prev,
            images_list: [...(prev.images_list || []), ...imageUrls]
        }));
    };

    const handleRemoveGalleryImage = (index: number) => {
        setAchievement(prev => {
            const images = [...(prev.images_list || [])];
            images.splice(index, 1);
            return { ...prev, images_list: images };
        });
    };

    const handleAchievementChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAchievement(prev => ({
            ...prev,
            achievement: e.target.value
        }));
    };

    const handleAssignedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAchievement(prev => ({
            ...prev,
            assigned: e.target.value || ''
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (achievement.id) {
                await axios.put(`http://localhost:8000/achievement${achievement.id}/`, {
                    achievement: achievement.achievement,
                    image_url: achievement.image_url,
                    images_list: achievement.images_list || [],
                    assigned: achievement.assigned || null
                });
                toast({
                    title: 'Успех!',
                    description: 'Достижение успешно обновлено',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                await axios.post('http://localhost:8000/achievements/', {
                    achievement: achievement.achievement,
                    image_url: achievement.image_url,
                    images_list: achievement.images_list || [],
                    assigned: achievement.assigned || null
                });
                toast({
                    title: 'Успех!',
                    description: 'Достижение успешно добавлено',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            }
            onSuccess();
        } catch (error) {
            console.error('Ошибка при сохранении достижения:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось сохранить достижение',
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
            <RequiredFieldsHint required={['Текст достижения']} />
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                <VStack spacing={4}>
                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaTrophy color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Изображение достижения</Text>
                        </FormLabel>
                        <ImageUpload
                            currentImageUrl={achievement.image_url}
                            onImageUpload={handleImageUpload}
                            onImageRemove={handleImageRemove}
                            contentType="achievements"
                            maxSize={10}
                            disabled={isSubmitting}
                        />
                    </FormControl>
                </VStack>

                <VStack spacing={4}>
                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaTrophy color={accentColor} />
                            <Text as="span" fontWeight="semibold">Описание достижения</Text>
                        </FormLabel>
                        <Textarea
                            value={achievement.achievement}
                            onChange={handleAchievementChange}
                            placeholder="Опишите достижение театра"
                            focusBorderColor={accentColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                            minH="200px"
                        />
                        <Text mt={2} fontSize="sm" color="#AAAAAA">
                            Максимум 500 символов
                        </Text>
                    </FormControl>

                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaCalendarAlt color={accentColor} />
                            <Text as="span" fontWeight="semibold">Дата присвоения</Text>
                        </FormLabel>
                        <Input
                            type="date"
                            value={achievement.assigned ?? ''}
                            onChange={handleAssignedChange}
                            focusBorderColor={accentColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        />
                    </FormControl>
                </VStack>
            </Grid>

            <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2}>
                    <CFaTrophy color={accentColor} />
                    <Text as="span" fontWeight="semibold">Галерея фотографий</Text>
                </FormLabel>
                {(achievement.images_list && achievement.images_list.length > 0) && (
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mb={4}>
                        {achievement.images_list.map((url, index) => (
                            <Box key={index} position="relative" borderRadius="md" overflow="hidden" border="1px solid" borderColor="#444444">
                                <Image src={url} alt={`Фото ${index + 1}`} w="100%" h="110px" objectFit="cover" />
                                <IconButton
                                    aria-label="Удалить фото"
                                    icon={<CFaTimes />}
                                    size="xs"
                                    colorScheme="red"
                                    position="absolute"
                                    top={1}
                                    right={1}
                                    onClick={() => handleRemoveGalleryImage(index)}
                                />
                            </Box>
                        ))}
                    </SimpleGrid>
                )}
                <ImageUpload
                    currentImageUrl={null as any}
                    multiple
                    onImageUpload={(url) => handleAddGalleryImages([url])}
                    onImagesUpload={handleAddGalleryImages}
                    onImageRemove={() => { }}
                    contentType="achievements"
                    maxSize={10}
                    disabled={isSubmitting}
                />
            </FormControl>

            <Flex justify="flex-end" mt={4}>
                <Button
                    variant="outline"
                    mr={3}
                    onClick={onCancel}
                    leftIcon={<CFaTimes />}
                    bg="#3a3a3a"
                    borderColor="#3a3a3a"
                    _hover={{ bg: 'red' }}
                >
                    Отмена
                </Button>
                <Button
                    bg="#3182CE"
                    _hover={{ bg: '#4299E1' }}
                    isLoading={isSubmitting}
                    onClick={handleSubmit}
                    leftIcon={<CFaSave />}
                    isDisabled={!achievement.achievement.trim()}
                >
                    {achievement.id ? 'Обновить' : 'Создать'}
                </Button>
            </Flex>
        </VStack>
    );
};