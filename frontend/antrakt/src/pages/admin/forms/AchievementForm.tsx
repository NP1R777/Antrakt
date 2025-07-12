import React, { useState } from 'react';
import {
    Button,
    VStack,
    FormControl,
    FormLabel,
    Flex,
    Input,
    Textarea,
    FormHelperText,
    Text,
    Grid,
    Box,
    IconButton,
    HStack,
    Badge,
    Switch
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    FaTrophy,
    FaImage,
    FaTimes,
    FaSave,
    FaPlus,
    FaTrash
} from 'react-icons/fa';
import axios from 'axios';
import { chakra, useToast } from '@chakra-ui/react';
import ImageUpload from '../../../components/ImageUpload';

const MotionButton = motion(Button);
const CFaTrophy = chakra(FaTrophy as any);
const CFaImage = chakra(FaImage as any);
const CFaTimes = chakra(FaTimes as any);
const CFaSave = chakra(FaSave as any);
const CFaPlus = chakra(FaPlus as any);
const CFaTrash = chakra(FaTrash as any);

const primaryColor = '#800020';

interface Achievement {
    id?: number;
    achievements: string[];
    image_url: string;
    deleted_at?: string | null;
}

export const AchievementForm: React.FC<{
    initialData?: Partial<Achievement>;
    onSuccess: () => void;
    onCancel: () => void;
}> = ({ initialData, onSuccess, onCancel }) => {
    const [currentAchievement, setCurrentAchievement] = useState<Partial<Achievement>>(initialData || {
        achievements: [],
        image_url: '',
        deleted_at: null
    });
    const [newAchievement, setNewAchievement] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const handleImageUpload = (imageUrl: string) => {
        setCurrentAchievement(prev => ({
            ...prev,
            image_url: imageUrl
        }));
    };

    const handleImageRemove = () => {
        setCurrentAchievement(prev => ({
            ...prev,
            image_url: ''
        }));
    };

    const addAchievement = () => {
        if (newAchievement.trim()) {
            setCurrentAchievement(prev => ({
                ...prev,
                achievements: [...(prev.achievements || []), newAchievement.trim()]
            }));
            setNewAchievement('');
        }
    };

    const removeAchievement = (index: number) => {
        setCurrentAchievement(prev => ({
            ...prev,
            achievements: (prev.achievements || []).filter((_, i) => i !== index)
        }));
    };

    const updateAchievement = (index: number, value: string) => {
        setCurrentAchievement(prev => ({
            ...prev,
            achievements: (prev.achievements || []).map((achievement, i) => 
                i === index ? value : achievement
            )
        }));
    };

    const handleCreateAchievement = async () => {
        if (!currentAchievement.achievements || currentAchievement.achievements.length === 0) {
            toast({
                title: 'Ошибка',
                description: 'Добавьте хотя бы одно достижение',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:8000/achievements/', currentAchievement);
            toast({
                title: 'Успешно',
                description: 'Достижения созданы',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onSuccess();
        } catch (error) {
            console.error('Ошибка при создании достижений:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось создать достижения',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateAchievement = async () => {
        if (!currentAchievement.id) return;

        if (!currentAchievement.achievements || currentAchievement.achievements.length === 0) {
            toast({
                title: 'Ошибка',
                description: 'Добавьте хотя бы одно достижение',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:8000/achievements/${currentAchievement.id}/`, currentAchievement);
            toast({
                title: 'Успешно',
                description: 'Достижения обновлены',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onSuccess();
        } catch (error) {
            console.error('Ошибка при обновлении достижений:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось обновить достижения',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isEditing = !!currentAchievement.id;

    return (
        <>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                {/* Левая колонка */}
                <VStack spacing={4} align="stretch">
                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaTrophy color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Добавить достижение</Text>
                        </FormLabel>
                        <HStack spacing={3}>
                            <Input
                                placeholder="Введите достижение..."
                                value={newAchievement}
                                onChange={(e) => setNewAchievement(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                                focusBorderColor={primaryColor}
                                bg="#333333"
                                borderColor="#444444"
                                _hover={{ borderColor: '#555555' }}
                                flex={1}
                            />
                            <Button
                                leftIcon={<CFaPlus />}
                                onClick={addAchievement}
                                colorScheme="green"
                                size="md"
                                isDisabled={!newAchievement.trim() || isSubmitting}
                            >
                                Добавить
                            </Button>
                        </HStack>
                        <FormHelperText color="#AAAAAA">
                            Нажмите Enter или кнопку "Добавить" для добавления достижения
                        </FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel fontWeight="semibold">Список достижений</FormLabel>
                        <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto">
                            {(currentAchievement.achievements || []).map((achievement, index) => (
                                <Box
                                    key={index}
                                    p={3}
                                    bg="#333333"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="#444444"
                                >
                                    <HStack spacing={3}>
                                        <Badge
                                            colorScheme="purple"
                                            variant="subtle"
                                            px={2}
                                            py={1}
                                            borderRadius="full"
                                            fontSize="xs"
                                        >
                                            {index + 1}
                                        </Badge>
                                        <Textarea
                                            value={achievement}
                                            onChange={(e) => updateAchievement(index, e.target.value)}
                                            bg="transparent"
                                            border="none"
                                            resize="none"
                                            rows={2}
                                            _focus={{ boxShadow: 'none' }}
                                            _hover={{ bg: '#444444' }}
                                            flex={1}
                                        />
                                        <IconButton
                                            icon={<CFaTrash />}
                                            onClick={() => removeAchievement(index)}
                                            colorScheme="red"
                                            variant="ghost"
                                            size="sm"
                                            aria-label="Удалить достижение"
                                            isDisabled={isSubmitting}
                                        />
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>
                        {(!currentAchievement.achievements || currentAchievement.achievements.length === 0) && (
                            <Text color="#666666" textAlign="center" py={4}>
                                Добавьте первое достижение
                            </Text>
                        )}
                    </FormControl>
                </VStack>

                {/* Правая колонка */}
                <VStack spacing={4} align="stretch">
                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaImage color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Фотография достижений</Text>
                        </FormLabel>
                        <ImageUpload
                            currentImageUrl={currentAchievement.image_url}
                            onImageUpload={handleImageUpload}
                            onImageRemove={handleImageRemove}
                            contentType="achievements"
                            maxSize={10}
                            disabled={isSubmitting}
                        />
                        <FormHelperText color="#AAAAAA">
                            Загрузите фотографию, связанную с достижениями
                        </FormHelperText>
                    </FormControl>

                    <Box
                        p={4}
                        bg="#333333"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="#444444"
                    >
                        <Text fontWeight="semibold" mb={3}>Статистика</Text>
                        <VStack spacing={2} align="stretch">
                            <Flex justify="space-between">
                                <Text color="#AAAAAA">Количество достижений:</Text>
                                <Badge colorScheme="green" variant="subtle">
                                    {currentAchievement.achievements?.length || 0}
                                </Badge>
                            </Flex>
                            <Flex justify="space-between">
                                <Text color="#AAAAAA">Изображение:</Text>
                                <Badge 
                                    colorScheme={currentAchievement.image_url ? "green" : "red"} 
                                    variant="subtle"
                                >
                                    {currentAchievement.image_url ? "Загружено" : "Не загружено"}
                                </Badge>
                            </Flex>
                        </VStack>
                    </Box>
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
                    onClick={isEditing ? handleUpdateAchievement : handleCreateAchievement}
                    leftIcon={<CFaSave />}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isEditing ? 'Обновить' : 'Создать'}
                </MotionButton>
            </Flex>
        </>
    );
};