import React, { useState } from 'react';
import {
    Button,
    VStack,
    FormControl,
    FormLabel,
    Flex,
    Input,
    Textarea,
    Switch,
    FormHelperText,
    Text,
    Grid,
    Box,
    Image,
    Center,
    Wrap,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    useDisclosure
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaNewspaper,
    FaImage,
    FaTimes,
    FaSave,
    FaPlus,
    FaTrash,
    FaCalendar
} from 'react-icons/fa';
import axios from 'axios';
import { chakra, useToast } from '@chakra-ui/react';
import ImageUpload from '../../../components/ImageUpload';

const MotionButton = motion(Button);
const MotionBox = motion(Box);
const CFaNewspaper = chakra(FaNewspaper as any);
const CFaImage = chakra(FaImage as any);
const CFaTimes = chakra(FaTimes as any);
const CFaSave = chakra(FaSave as any);
const CFaPlus = chakra(FaPlus as any);
const CFaTrash = chakra(FaTrash as any);
const CFaCalendar = chakra(FaCalendar as any);

const primaryColor = '#800020';

interface News {
    id: number;
    title: string;
    description: string;
    summary?: string;
    image_url: string;
    is_published: boolean;
    deleted_at?: string | null;
    images_list: string[];
    date_publish?: string; // Добавлено поле даты публикации
}

export const NewsForm: React.FC<{
    initialData?: Partial<News>;
    onSuccess: () => void;
    onCancel: () => void;
}> = ({ initialData, onSuccess, onCancel }) => {
    const [currentNews, setCurrentNews] = useState<Partial<News>>(initialData || {
        is_published: false,
        deleted_at: null,
        images_list: [],
        date_publish: '' // Инициализация поля даты
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGalleryUploading, setIsGalleryUploading] = useState(false);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentNews(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (imageUrl: string) => {
        setCurrentNews(prev => ({
            ...prev,
            image_url: imageUrl
        }));
    };

    const handleImageRemove = () => {
        setCurrentNews(prev => ({
            ...prev,
            image_url: ''
        }));
    };

    // Добавление изображения в галерею
    const handleAddGalleryImage = (imageUrl: string) => {
        if (!imageUrl) return;

        setCurrentNews(prev => ({
            ...prev,
            images_list: [...(prev.images_list || []), imageUrl]
        }));
    };

    // Удаление изображения из галереи
    const handleRemoveGalleryImage = (index: number) => {
        if (!currentNews.images_list) return;

        const newImages = [...currentNews.images_list];
        newImages.splice(index, 1);

        setCurrentNews(prev => ({
            ...prev,
            images_list: newImages
        }));
    };

    const handleCreateNews = async () => {
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:8000/news/', currentNews);
            toast({
                title: 'Успешно',
                description: 'Новость создана',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onSuccess();
        } catch (error) {
            console.error('Ошибка при создании новости:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось создать новость',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateNews = async () => {
        if (!currentNews.id) return;

        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:8000/news${currentNews.id}/`, currentNews);
            toast({
                title: 'Успешно',
                description: 'Новость обновлена',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onSuccess();
        } catch (error) {
            console.error('Ошибка при обновлении новости:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось обновить новость',
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
                            <CFaNewspaper color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Заголовок новости</Text>
                        </FormLabel>
                        <Input
                            name="title"
                            placeholder="Заголовок новости"
                            value={currentNews.title || ''}
                            onChange={handleInputChange}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontWeight="semibold">Краткое описание</FormLabel>
                        <Textarea
                            name="summary"
                            placeholder="Краткое описание новости"
                            value={currentNews.summary || ''}
                            onChange={handleInputChange}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                            rows={3}
                        />
                        <FormHelperText color="#AAAAAA">
                            Краткое описание для предварительного просмотра
                        </FormHelperText>
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="is_published" mb="0" fontWeight="semibold">
                            Опубликовать
                        </FormLabel>
                        <Switch
                            id="is_published"
                            isChecked={currentNews.is_published}
                            onChange={(e) => setCurrentNews(prev => ({
                                ...prev,
                                is_published: e.target.checked
                            }))}
                            colorScheme="green"
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaCalendar color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Дата публикации</Text>
                        </FormLabel>
                        <Input
                            name="date_publish"
                            type="date"
                            value={currentNews.date_publish || ''}
                            onChange={handleInputChange}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaImage color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Фотогалерея новости</Text>
                        </FormLabel>

                        <Box
                            border="1px dashed"
                            borderColor="gray.600"
                            borderRadius="md"
                            p={4}
                            mb={4}
                            bg="rgba(30, 30, 30, 0.5)"
                        >
                            {currentNews.images_list?.length ? (
                                <Wrap spacing={3} mb={4}>
                                    <AnimatePresence>
                                        {currentNews.images_list.map((url, index) => (
                                            <MotionBox
                                                key={index}
                                                position="relative"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Image
                                                    src={url}
                                                    boxSize="100px"
                                                    objectFit="cover"
                                                    borderRadius="md"
                                                    border="1px solid"
                                                    borderColor="gray.600"
                                                />
                                                <IconButton
                                                    aria-label="Удалить фото"
                                                    icon={<CFaTrash />}
                                                    size="xs"
                                                    position="absolute"
                                                    top="-8px"
                                                    right="-8px"
                                                    borderRadius="full"
                                                    bg="red.500"
                                                    color="white"
                                                    _hover={{ bg: 'red.600' }}
                                                    onClick={() => handleRemoveGalleryImage(index)}
                                                />
                                            </MotionBox>
                                        ))}
                                    </AnimatePresence>
                                </Wrap>
                            ) : (
                                <Center minH="100px" color="gray.500" fontSize="sm">
                                    Нет загруженных фотографий
                                </Center>
                            )}

                            <Button
                                leftIcon={<CFaPlus />}
                                colorScheme="teal"
                                variant="outline"
                                onClick={onOpen}
                                isLoading={isGalleryUploading}
                                w="full"
                            >
                                Добавить фотографию
                            </Button>
                        </Box>
                    </FormControl>
                </VStack>

                {/* Правая колонка */}
                <VStack spacing={4} align="stretch">
                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaImage color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Изображение новости</Text>
                        </FormLabel>
                        <ImageUpload
                            currentImageUrl={currentNews.image_url}
                            onImageUpload={handleImageUpload}
                            onImageRemove={handleImageRemove}
                            contentType="news"
                            maxSize={10}
                            disabled={isSubmitting}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontWeight="semibold">Содержание новости</FormLabel>
                        <Textarea
                            name="description"
                            placeholder="Полное содержание новости"
                            value={currentNews.description || ''}
                            onChange={handleInputChange}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                            rows={12}
                        />
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
                    onClick={currentNews.id ? handleUpdateNews : handleCreateNews}
                    leftIcon={<CFaSave />}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {currentNews.id ? 'Обновить' : 'Создать'}
                </MotionButton>
            </Flex>

            {/* Модальное окно для загрузки фотографий в галерею */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent bg="gray.800" color="white">
                    <ModalHeader>Добавить фотографию в галерею</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ImageUpload
                            currentImageUrl={null}
                            onImageUpload={(imageUrl) => {
                                handleAddGalleryImage(imageUrl);
                                onClose();
                            }}
                            onImageRemove={() => { }}
                            contentType="news"
                            maxSize={10}
                            disabled={isSubmitting}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={onClose}>
                            Отмена
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};