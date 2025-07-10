import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    Image,
    VStack,
    HStack,
    Text,
    useToast,
    Spinner,
    IconButton,
    Tooltip,
    Badge,
    Progress,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';
import { FaUpload, FaTrash, FaEye, FaTimes } from 'react-icons/fa';
import ImageService from '../services/ImageService';
import { chakra } from '@chakra-ui/react';

// Оборачиваем иконки в chakra для совместимости с Chakra UI
const CFaUpload = chakra(FaUpload as any);
const CFaTrash = chakra(FaTrash as any);
const CFaEye = chakra(FaEye as any);
const CFaTimes = chakra(FaTimes as any);

interface ImageUploadProps {
    currentImageUrl?: string;
    onImageUpload: (imageUrl: string) => void;
    onImageRemove?: () => void;
    contentType: 'perfomances' | 'actors' | 'directors' | 'news' | 'archive' | 'achievements';
    maxSize?: number; // в MB
    aspectRatio?: number; // соотношение сторон (например, 16/9)
    disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    currentImageUrl,
    onImageUpload,
    onImageRemove,
    contentType,
    maxSize = 10,
    aspectRatio,
    disabled = false,
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Очищаем предыдущие ошибки
        setError(null);

        // Валидация файла
        const validation = ImageService.validateImageFile(file);
        if (!validation.isValid) {
            setError(validation.error);
            toast({
                title: 'Ошибка валидации',
                description: validation.error,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            // Создаем предварительный просмотр
            const preview = await ImageService.createImagePreview(file);
            setPreviewUrl(preview);

            // Загружаем изображение
            setIsUploading(true);
            setUploadProgress(0);

            // Симуляция прогресса загрузки
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);

            const folder = ImageService.getFolderByContentType(contentType);
            const imageUrl = await ImageService.uploadImage(file, folder);

            clearInterval(progressInterval);
            setUploadProgress(100);

            // Вызываем callback с новым URL
            onImageUpload(imageUrl);

            toast({
                title: 'Успешно',
                description: 'Изображение загружено',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Очищаем предварительный просмотр
            setPreviewUrl(null);
        } catch (error) {
            const errorMessage = ImageService.handleUploadError(error);
            setError(errorMessage);
            toast({
                title: 'Ошибка загрузки',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            // Очищаем input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = async () => {
        if (!currentImageUrl) return;

        try {
            const success = await ImageService.deleteImage(currentImageUrl);
            if (success) {
                onImageRemove?.();
                toast({
                    title: 'Успешно',
                    description: 'Изображение удалено',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось удалить изображение',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Ошибка',
                description: 'Не удалось удалить изображение',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handlePreviewClick = () => {
        if (currentImageUrl) {
            window.open(currentImageUrl, '_blank');
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <VStack spacing={4} align="stretch" w="100%">
            {/* Текущее изображение */}
            {currentImageUrl && !previewUrl && (
                <Box
                    position="relative"
                    borderRadius="md"
                    overflow="hidden"
                    border="2px solid"
                    borderColor="gray.200"
                    _dark={{ borderColor: 'gray.600' }}
                >
                    <Image
                        src={currentImageUrl}
                        alt="Текущее изображение"
                        w="100%"
                        h="auto"
                        maxH="300px"
                        objectFit="cover"
                        cursor="pointer"
                        onClick={handlePreviewClick}
                        _hover={{ opacity: 0.8 }}
                    />
                    <HStack
                        position="absolute"
                        top={2}
                        right={2}
                        spacing={2}
                    >
                        <Tooltip label="Просмотреть">
                            <IconButton
                                aria-label="Просмотреть изображение"
                                icon={<CFaEye />}
                                size="sm"
                                colorScheme="blue"
                                onClick={handlePreviewClick}
                            />
                        </Tooltip>
                        {onImageRemove && (
                            <Tooltip label="Удалить">
                                <IconButton
                                    aria-label="Удалить изображение"
                                    icon={<CFaTrash />}
                                    size="sm"
                                    colorScheme="red"
                                    onClick={handleRemoveImage}
                                    disabled={disabled}
                                />
                            </Tooltip>
                        )}
                    </HStack>
                </Box>
            )}

            {/* Предварительный просмотр */}
            {previewUrl && (
                <Box
                    position="relative"
                    borderRadius="md"
                    overflow="hidden"
                    border="2px solid"
                    borderColor="blue.300"
                >
                    <Image
                        src={previewUrl}
                        alt="Предварительный просмотр"
                        w="100%"
                        h="auto"
                        maxH="300px"
                        objectFit="cover"
                    />
                    <Badge
                        position="absolute"
                        top={2}
                        left={2}
                        colorScheme="blue"
                    >
                        Предварительный просмотр
                    </Badge>
                    <IconButton
                        position="absolute"
                        top={2}
                        right={2}
                        aria-label="Отменить загрузку"
                        icon={<CFaTimes />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => setPreviewUrl(null)}
                    />
                </Box>
            )}

            {/* Прогресс загрузки */}
            {isUploading && (
                <VStack spacing={2}>
                    <Text fontSize="sm" color="gray.600">
                        Загрузка изображения...
                    </Text>
                    <Progress
                        value={uploadProgress}
                        w="100%"
                        colorScheme="blue"
                        size="sm"
                    />
                    <Text fontSize="xs" color="gray.500">
                        {uploadProgress}%
                    </Text>
                </VStack>
            )}

            {/* Ошибка */}
            {error && (
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Ошибка загрузки!</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Box>
                </Alert>
            )}

            {/* Кнопка загрузки */}
            <VStack spacing={2}>
                <Button
                    leftIcon={<CFaUpload />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || isUploading}
                    colorScheme="blue"
                    variant="outline"
                    w="100%"
                    h="60px"
                    borderStyle="dashed"
                    _hover={{
                        borderColor: 'blue.400',
                        bg: 'blue.50',
                        _dark: { bg: 'blue.900' }
                    }}
                >
                    {isUploading ? (
                        <HStack>
                            <Spinner size="sm" />
                            <Text>Загрузка...</Text>
                        </HStack>
                    ) : (
                        <Text>
                            {currentImageUrl ? 'Заменить изображение' : 'Загрузить изображение'}
                        </Text>
                    )}
                </Button>

                <Text fontSize="xs" color="gray.500" textAlign="center">
                    Поддерживаемые форматы: JPEG, PNG, GIF, WebP
                    <br />
                    Максимальный размер: {maxSize}MB
                </Text>
            </VStack>

            {/* Скрытый input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={disabled || isUploading}
            />
        </VStack>
    );
};

export default ImageUpload;