import React, { useState, useEffect } from 'react';
import {
    VStack,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    FormHelperText,
    Text,
    Grid,
    Box,
    IconButton,
    HStack,
    Badge,
    Divider,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useToast
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
import { chakra } from '@chakra-ui/react';
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

interface AchievementFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Achievement | null;
    onSuccess: () => void;
}

export const AchievementForm: React.FC<AchievementFormProps> = ({
    isOpen,
    onClose,
    initialData,
    onSuccess
}) => {
    const [currentAchievement, setCurrentAchievement] = useState<Partial<Achievement>>({
        achievements: [],
        image_url: '',
        deleted_at: null
    });
    const [newAchievement, setNewAchievement] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const toast = useToast();

    // Обновляем состояние при изменении initialData
    useEffect(() => {
        if (initialData) {
            setCurrentAchievement({
                ...initialData,
                achievements: [...initialData.achievements]
            });
        } else {
            setCurrentAchievement({
                achievements: [],
                image_url: '',
                deleted_at: null
            });
        }
        setNewAchievement('');
        setErrors({});
    }, [initialData, isOpen]);

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
            setErrors(prev => ({ ...prev, achievements: '' }));
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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!currentAchievement.achievements || currentAchievement.achievements.length === 0) {
            newErrors.achievements = 'Добавьте хотя бы одно достижение';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            if (initialData?.id) {
                await axios.put(`http://localhost:8000/achievements/${initialData.id}/`, currentAchievement);
                toast({
                    title: 'Успешно',
                    description: 'Достижения обновлены',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await axios.post('http://localhost:8000/achievements/', currentAchievement);
                toast({
                    title: 'Успешно',
                    description: 'Достижения созданы',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Ошибка при сохранении достижений:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось сохранить достижения',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isEditing = !!initialData?.id;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside" isCentered>
            <ModalOverlay bg="blackAlpha.700" />
            <ModalContent bg="#222222" color="white">
                <ModalHeader borderBottom="1px solid #333333" fontWeight="semibold">
                    <HStack spacing={3}>
                        <CFaTrophy color={primaryColor} />
                        <Text>{isEditing ? 'Редактировать достижения' : 'Создать достижения'}</Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody py={6}>
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
                                    <IconButton
                                        aria-label="Добавить достижение"
                                        icon={<CFaPlus />}
                                        onClick={addAchievement}
                                        colorScheme="green"
                                        variant="outline"
                                        isDisabled={!newAchievement.trim()}
                                        _hover={{ bg: 'green.500', color: 'white' }}
                                    />
                                </HStack>

                                {/* Список достижений */}
                                <VStack spacing={3} align="stretch" maxH="400px" overflowY="auto">
                                    {currentAchievement.achievements?.map((achievement, index) => (
                                        <Box
                                            key={index}
                                            p={4}
                                            bg="#333333"
                                            borderRadius="md"
                                            border="1px solid #444444"
                                            _hover={{ borderColor: '#555555' }}
                                        >
                                            <HStack spacing={3} align="start">
                                                <Badge
                                                    colorScheme="purple"
                                                    variant="subtle"
                                                    px={2}
                                                    py={1}
                                                    borderRadius="full"
                                                    flexShrink={0}
                                                >
                                                    {index + 1}
                                                </Badge>
                                                <Input
                                                    value={achievement}
                                                    onChange={(e) => updateAchievement(index, e.target.value)}
                                                    bg="transparent"
                                                    border="none"
                                                    _focus={{ bg: '#444444', border: '1px solid #555555' }}
                                                    flex={1}
                                                />
                                                <IconButton
                                                    aria-label="Удалить достижение"
                                                    icon={<CFaTrash />}
                                                    onClick={() => removeAchievement(index)}
                                                    colorScheme="red"
                                                    variant="ghost"
                                                    size="sm"
                                                    _hover={{ bg: 'red.500', color: 'white' }}
                                                />
                                            </HStack>
                                        </Box>
                                    ))}
                                </VStack>

                                {errors.achievements && (
                                    <Text color="red.500" fontSize="sm" mt={2}>
                                        {errors.achievements}
                                    </Text>
                                )}

                                {currentAchievement.achievements && currentAchievement.achievements.length > 0 && (
                                    <Box mt={4} p={3} bg="#444444" borderRadius="md">
                                        <Text fontSize="sm" color="#CCCCCC">
                                            Всего достижений: {currentAchievement.achievements.length}
                                        </Text>
                                    </Box>
                                )}
                            </Box>
                        </VStack>

                        {/* Правая колонка - Изображение */}
                        <VStack spacing={6} align="stretch">
                            <Box>
                                <FormLabel display="flex" alignItems="center" gap={2} mb={4}>
                                    <CFaImage color={primaryColor} />
                                    <Text as="span" fontWeight="semibold" fontSize="lg">
                                        Изображение достижений
                                    </Text>
                                </FormLabel>
                                
                                <ImageUpload
                                    currentImageUrl={currentAchievement.image_url}
                                    onImageUpload={handleImageUpload}
                                    onImageRemove={handleImageRemove}
                                    contentType="achievements"
                                    maxSize={10}
                                    disabled={isSubmitting}
                                />
                                
                                <FormHelperText color="#AAAAAA" mt={2}>
                                    Загрузите изображение, связанное с достижениями (максимум 10 МБ)
                                </FormHelperText>
                            </Box>

                            {/* Предварительный просмотр */}
                            {currentAchievement.image_url && (
                                <Box>
                                    <Text fontWeight="semibold" mb={3}>Предварительный просмотр</Text>
                                    <Box
                                        p={4}
                                        bg="#333333"
                                        borderRadius="md"
                                        border="1px solid #444444"
                                    >
                                        <VStack spacing={3} align="stretch">
                                            <Box position="relative">
                                                <img
                                                    src={currentAchievement.image_url}
                                                    alt="Предварительный просмотр"
                                                    style={{
                                                        width: '100%',
                                                        height: '200px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                            </Box>
                                            <Text fontSize="sm" color="#CCCCCC">
                                                Изображение будет отображаться вместе с достижениями
                                            </Text>
                                        </VStack>
                                    </Box>
                                </Box>
                            )}
                        </VStack>
                    </Grid>
                </ModalBody>
                <ModalFooter borderTop="1px solid #333333">
                    <HStack spacing={3}>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            leftIcon={<CFaTimes />}
                            isDisabled={isSubmitting}
                        >
                            Отмена
                        </Button>
                        <MotionButton
                            colorScheme="red"
                            bg={primaryColor}
                            _hover={{ bg: '#A00030' }}
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                            loadingText={isEditing ? 'Обновление...' : 'Создание...'}
                            leftIcon={<CFaSave />}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isEditing ? 'Обновить' : 'Создать'}
                        </MotionButton>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};