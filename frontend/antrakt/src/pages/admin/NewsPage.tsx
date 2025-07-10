import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Grid,
    GridItem,
    Heading,
    Flex,
    Button,
    VStack,
    HStack,
    Badge,
    Container,
    chakra,
    Input,
    Textarea,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useToast,
    Spinner,
    Text,
    FormControl,
    FormLabel,
    IconButton,
    Tooltip,
    Image,
    Switch,
    FormHelperText
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPlus,
    FaTrash,
    FaEdit,
    FaSave,
    FaTimes,
    FaNewspaper,
    FaCalendar,
    FaEye,
    FaEyeSlash,
    FaImage
} from 'react-icons/fa';
import axios from 'axios';
import ImageUpload from '../../components/ImageUpload';

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);
const MotionButton = motion(Button);

const primaryColor = '#800020';
const secondaryColor = '#A00030';
const accentColor = '#4ECDC4';

// Обернем иконки в chakra для корректной работы
const CFaPlus = chakra(FaPlus as any);
const CFaTrash = chakra(FaTrash as any);
const CFaEdit = chakra(FaEdit as any);
const CFaSave = chakra(FaSave as any);
const CFaTimes = chakra(FaTimes as any);
const CFaNewspaper = chakra(FaNewspaper as any);
const CFaCalendar = chakra(FaCalendar as any);
const CFaEye = chakra(FaEye as any);
const CFaEyeSlash = chakra(FaEyeSlash as any);
const CFaImage = chakra(FaImage as any);

interface News {
    id: number;
    title: string;
    content?: string; // Поле content теперь необязательное
    summary?: string; // Поле summary тоже необязательное
    image_url: string;
    published_date: string;
    is_published: boolean;
    author: string;
}

const NewsPage: React.FC = () => {
    const [news, setNews] = useState<News[]>([]);
    const [currentNews, setCurrentNews] = useState<Partial<News>>({
        is_published: false
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const toast = useToast();

    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await axios.get('http://localhost:8000/news/');
            setNews(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Ошибка при загрузке новостей:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить новости',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    };

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
            resetForm();
            fetchNews();
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
            await axios.put(`http://localhost:8000/news/${currentNews.id}/`, currentNews);
            toast({
                title: 'Успешно',
                description: 'Новость обновлена',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            resetForm();
            fetchNews();
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

    const handleDeleteNews = async () => {
        if (!deleteId) return;

        try {
            await axios.delete(`http://localhost:8000/news/${deleteId}/`);
            toast({
                title: 'Успешно',
                description: 'Новость удалена',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            fetchNews();
        } catch (error) {
            console.error('Ошибка при удалении новости:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось удалить новость',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            onDeleteClose();
            setDeleteId(null);
        }
    };

    const resetForm = () => {
        setCurrentNews({ is_published: false });
        onFormClose();
    };

    const openEditForm = (newsItem: News) => {
        setCurrentNews(newsItem);
        onFormOpen();
    };

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const truncateText = (text: string | undefined, maxLength: number) => {
        if (!text) return ''; // Возвращаем пустую строку, если text undefined или null
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const renderNewsCards = () => {
        if (isLoading) {
            return (
                <Flex justify="center" align="center" minH="400px">
                    <Spinner size="xl" color={primaryColor} />
                </Flex>
            );
        }

        if (news.length === 0) {
            return (
                <Box textAlign="center" py={20}>
                    <CFaNewspaper size="4em" color="#666" />
                    <Text mt={4} color="#666" fontSize="lg">
                        Новости не найдены
                    </Text>
                </Box>
            );
        }

        return (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(auto-fill, minmax(400px, 1fr))' }} gap={6}>
                {news.map((newsItem) => (
                    <MotionGridItem
                        key={newsItem.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <MotionBox
                            bg="rgba(255,255,255,0.05)"
                            p={4}
                            borderRadius="xl"
                            border="1px solid"
                            borderColor="rgba(255,255,255,0.1)"
                            backdropFilter="blur(10px)"
                            position="relative"
                            overflow="hidden"
                            whileHover={{ borderColor: secondaryColor, boxShadow: `0 0 20px ${secondaryColor}50` }}
                            transition={{ duration: 0.3 }}
                        >
                            {newsItem.image_url && (
                                <Image
                                    src={newsItem.image_url}
                                    alt={newsItem.title}
                                    w="100%"
                                    h="200px"
                                    objectFit="cover"
                                    borderRadius="md"
                                    mb={4}
                                />
                            )}

                            <VStack align="stretch" spacing={3}>
                                <HStack justify="space-between" align="start">
                                    <Heading size="md" fontFamily="Playfair Display" noOfLines={2} flex={1}>
                                        {newsItem.title}
                                    </Heading>
                                    {newsItem.is_published ? (
                                        <Badge colorScheme="green" variant="subtle">
                                            <CFaEye style={{ marginRight: '4px' }} />
                                            Опубликовано
                                        </Badge>
                                    ) : (
                                        <Badge colorScheme="gray" variant="subtle">
                                            <CFaEyeSlash style={{ marginRight: '4px' }} />
                                            Черновик
                                        </Badge>
                                    )}
                                </HStack>

                                <Text noOfLines={3} fontSize="sm" color="#CCCCCC">
                                    {newsItem.summary || truncateText(newsItem.content, 150)}
                                </Text>

                                <HStack spacing={2} fontSize="sm" color="#AAAAAA">
                                    <CFaCalendar style={{ display: 'inline' }} />
                                    <Text>{formatDate(newsItem.published_date)}</Text>
                                    {newsItem.author && (
                                        <>
                                            <Text>•</Text>
                                            <Text>Автор: {newsItem.author}</Text>
                                        </>
                                    )}
                                </HStack>

                                <Flex justify="flex-end" gap={2} mt={2}>
                                    <Tooltip label="Редактировать" hasArrow>
                                        <IconButton
                                            size="sm"
                                            icon={<CFaEdit />}
                                            colorScheme="blue"
                                            variant="ghost"
                                            onClick={() => openEditForm(newsItem)}
                                            aria-label='Редактировать новость'
                                        />
                                    </Tooltip>

                                    <Tooltip label="Удалить" hasArrow>
                                        <IconButton
                                            size="sm"
                                            icon={<CFaTrash />}
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => confirmDelete(newsItem.id)}
                                            aria-label='Удалить новость'
                                        />
                                    </Tooltip>
                                </Flex>
                            </VStack>
                        </MotionBox>
                    </MotionGridItem>
                ))}
            </Grid>
        );
    };

    return (
        <Box minH="100vh" bg="black" color="white" py={8}>
            <Container maxW="container.lg" px={{ base: 4, md: 6 }}>
                <Flex justify="space-between" align="center" mb={8} flexWrap="wrap">
                    <VStack align="start" spacing={2} mb={{ base: 4, md: 0 }}>
                        <Heading fontSize="3xl" fontFamily="Playfair Display">
                            Управление новостями
                        </Heading>
                        <Text color="#AAAAAA">
                            CRUD операции для управления новостями театра
                        </Text>
                    </VStack>

                    <MotionButton
                        leftIcon={<CFaPlus />}
                        bg={primaryColor}
                        _hover={{ bg: '#900030' }}
                        onClick={onFormOpen}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Добавить новость
                    </MotionButton>
                </Flex>

                {renderNewsCards()}
            </Container>

            {/* Модальное окно для создания/редактирования */}
            <Modal isOpen={isFormOpen} onClose={resetForm} size="4xl" scrollBehavior="inside">
                <ModalOverlay bg="blackAlpha.700" />
                <ModalContent bg="#222222" color="white">
                    <ModalHeader borderBottom="1px solid #333333" fontFamily="Playfair Display">
                        {currentNews.id ? 'Редактировать новость' : 'Добавить новую новость'}
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody py={6}>
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

                                <FormControl>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <CFaCalendar color={primaryColor} />
                                        <Text as="span" fontWeight="semibold">Дата публикации</Text>
                                    </FormLabel>
                                    <Input
                                        name="published_date"
                                        type="date"
                                        value={currentNews.published_date || ''}
                                        onChange={handleInputChange}
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontWeight="semibold">Автор</FormLabel>
                                    <Input
                                        name="author"
                                        placeholder="Имя автора"
                                        value={currentNews.author || ''}
                                        onChange={handleInputChange}
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                    />
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
                                        name="content"
                                        placeholder="Полное содержание новости"
                                        value={currentNews.content || ''}
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
                    </ModalBody>

                    <ModalFooter borderTop="1px solid #333333">
                        <HStack spacing={3}>
                            <Button
                                leftIcon={<CFaTimes />}
                                variant="outline"
                                onClick={resetForm}
                                disabled={isSubmitting}
                            >
                                Отмена
                            </Button>
                            <Button
                                leftIcon={currentNews.id ? <CFaSave /> : <CFaPlus />}
                                bg={primaryColor}
                                _hover={{ bg: '#900030' }}
                                onClick={currentNews.id ? handleUpdateNews : handleCreateNews}
                                isLoading={isSubmitting}
                                loadingText={currentNews.id ? 'Обновление...' : 'Создание...'}
                            >
                                {currentNews.id ? 'Обновить' : 'Создать'}
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Диалог подтверждения удаления */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="#222222" color="white">
                        <AlertDialogHeader fontFamily="Playfair Display">
                            Удалить новость
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Вы уверены, что хотите удалить эту новость? Это действие нельзя отменить.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose}>
                                Отмена
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDeleteNews}
                                ml={3}
                            >
                                Удалить
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default NewsPage;