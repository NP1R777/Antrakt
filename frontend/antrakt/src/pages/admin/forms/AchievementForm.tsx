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
    Divider
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
const MotionBox = motion(Box);
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
            <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
                {/* Левая колонка - Достижения */}
                <VStack spacing={6} align="stretch">
                    <Box>
                        <FormLabel display="flex" alignItems="center" gap={2} mb={4}>
                            <CFaTrophy color={primaryColor} />
                            <Text as="span" fontWeight="semibold" fontSize="lg">
                                Список достижений
                            </Text>
                        </FormLabel>
                        
                        {/* Добавление нового достижения */}
                        <HStack spacing={3} mb={4}>
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
                            <MotionButton
                                leftIcon={<CFaPlus />}
                                onClick={addAchievement}
                                colorScheme="green"
                                size="md"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                isDisabled={!newAchievement.trim() || isSubmitting}
                            >
                                Добавить
                            </MotionButton>
                        </HStack>

                        {/* Список достижений */}
                        <VStack spacing={3} align="stretch" maxH="400px" overflowY="auto">
                            {(currentAchievement.achievements || []).map((achievement, index) => (
                                <MotionBox
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <HStack
                                        p={4}
                                        bg="#2A2A2A"
                                        borderRadius="lg"
                                        border="1px solid"
                                        borderColor="#444444"
                                        _hover={{ borderColor: primaryColor }}
                                        transition="all 0.2s"
                                    >
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
                                            _hover={{ bg: '#333333' }}
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
                                </MotionBox>
                            ))}
                        </VStack>

                        {(!currentAchievement.achievements || currentAchievement.achievements.length === 0) && (
                            <Box
                                p={6}
                                bg="#2A2A2A"
                                borderRadius="lg"
                                border="2px dashed"
                                borderColor="#444444"
                                textAlign="center"
                            >
                                <CFaTrophy size={24} color="#666666" />
                                <Text color="#666666" mt={2}>
                                    Добавьте первое достижение
                                </Text>
                            </Box>
                        )}
                    </Box>
                </VStack>

                {/* Правая колонка - Изображение */}
                <VStack spacing={6} align="stretch">
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

                    {/* Статистика */}
                    <Box
                        p={4}
                        bg="#2A2A2A"
                        borderRadius="lg"
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

            <Divider my={6} borderColor="#444444" />

            {/* Кнопки действий */}
            <Flex justify="flex-end" gap={4}>
                <MotionButton
                    leftIcon={<CFaTimes />}
                    onClick={onCancel}
                    variant="outline"
                    borderColor="#444444"
                    color="#AAAAAA"
                    _hover={{ borderColor: '#666666', color: 'white' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    isDisabled={isSubmitting}
                >
                    Отмена
                </MotionButton>
                <MotionButton
                    leftIcon={<CFaSave />}
                    onClick={isEditing ? handleUpdateAchievement : handleCreateAchievement}
                    bg={primaryColor}
                    color="white"
                    _hover={{ bg: '#600018' }}
                    _active={{ bg: '#400012' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    isLoading={isSubmitting}
                    loadingText={isEditing ? "Обновление..." : "Создание..."}
                >
                    {isEditing ? 'Обновить' : 'Создать'}
                </MotionButton>
            </Flex>
        </>
    );
};