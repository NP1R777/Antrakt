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
} from '@chakra-ui/react';
import { FaTimes, FaSave, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import ImageUpload from '../../../components/ImageUpload';
import { chakra } from '@chakra-ui/react';

const CFaTimes = chakra(FaTimes as any);
const CFaSave = chakra(FaSave as any);
const CFaTrophy = chakra(FaTrophy as any);
const CFaCalendarAlt = chakra(FaCalendarAlt as any);

const primaryColor = '#800020';
const accentColor = '#4ECDC4';

interface Achievement {
    id?: number;
    achievement: string;
    image_url: string;
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

            <Flex justify="flex-end" mt={4}>
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