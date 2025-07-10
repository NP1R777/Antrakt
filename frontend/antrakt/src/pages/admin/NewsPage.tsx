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
    FaImage,
    FaUndo
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
const CFaUndo = chakra(FaUndo as any);

interface News {
    id: number;
    title: string;
    description: string;
    summary?: string;
    image_url: string;
    is_published: boolean;
    deleted_at?: string | null;
}

const NewsPage: React.FC = () => {
    const [news, setNews] = useState<News[]>([]);
    const [currentNews, setCurrentNews] = useState<Partial<News>>({
        is_published: false,
        deleted_at: null
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
            const response = await axios.get('http://localhost:8000/news-admin/');
            // Показываем все новости, включая удаленные
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
            await axios.put(`http://localhost:8000/news${currentNews.id}/`, currentNews);
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

        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:8000/news${deleteId}/`, {
                deleted_at: new Date().toISOString()
            });
            toast({
                title: 'Успешно',
                description: 'Новость удалена',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Обновляем локальное состояние вместо перезагрузки
            setNews(prevNews =>
                prevNews.map(item =>
                    item.id === deleteId
                        ? { ...item, deleted_at: new Date().toISOString() }
                        : item
                )
            );
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
            setIsSubmitting(false);
            onDeleteClose();
            setDeleteId(null);
        }
    };

    const handleRestoreNews = async (id: number) => {
        if (!id) return;

        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:8000/news${id}/`, {
                deleted_at: null
            });
            toast({
                title: 'Успешно',
                description: 'Новость восстановлена',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Обновляем локальное состояние вместо перезагрузки
            setNews(prevNews =>
                prevNews.map(item =>
                    item.id === id
                        ? { ...item, deleted_at: null }
                        : item
                )
            );
        } catch (error) {
            console.error('Ошибка при восстановлении новости:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось восстановить новость',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setCurrentNews({ is_published: false, deleted_at: null });
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
        if (!text) return '';
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
                            bg={newsItem.deleted_at ? "rgba(50,50,50,0.5)" : "rgba(255,255,255,0.05)"}
                            p={4}
                            borderRadius="xl"
                            border="1px solid"
                            borderColor={newsItem.deleted_at ? "#555" : "rgba(255,255,255,0.1)"}
                            backdropFilter="blur(10px)"
                            position="relative"
                            overflow="hidden"
                            whileHover={{
                                borderColor: newsItem.deleted_at ? "#666" : secondaryColor,
                                boxShadow: newsItem.deleted_at ? "none" : `0 0 20px ${secondaryColor}50`
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {newsItem.deleted_at && (
                                <Badge
                                    position="absolute"
                                    top={2}
                                    right={2}
                                    colorScheme="red"
                                    zIndex={1}
                                >
                                    Удалено
                                </Badge>
                            )}

                            {newsItem.image_url && (
                                <Image
                                    src={newsItem.image_url}
                                    alt={newsItem.title}
                                    w="100%"
                                    h="200px"
                                    objectFit="cover"
                                    borderRadius="md"
                                    mb={4}
                                    opacity={newsItem.deleted_at ? 0.6 : 1}
                                />
                            )}

                            <VStack align="stretch" spacing={3}>
                                <HStack justify="space-between" align="start">
                                    <Heading
                                        size="md"
                                        fontFamily="Playfair Display"
                                        noOfLines={2}
                                        flex={1}
                                        color={newsItem.deleted_at ? "#999" : "white"}
                                    >
                                        {newsItem.title}
                                    </Heading>
                                    {newsItem.is_published && !newsItem.deleted_at ? (
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

                                <Text
                                    noOfLines={3}
                                    fontSize="sm"
                                    color={newsItem.deleted_at ? "#999" : "#CCCCCC"}
                                >
                                    {newsItem.summary || truncateText(newsItem.description, 150)}
                                </Text>

                                <Flex justify="flex-end" gap={2} mt={2}>
                                    <Tooltip label="Редактировать" hasArrow>
                                        <IconButton
                                            size="sm"
                                            icon={<CFaEdit />}
                                            colorScheme="blue"
                                            variant="ghost"
                                            onClick={() => openEditForm(newsItem)}
                                            aria-label='Редактировать новость'
                                            isDisabled={!!newsItem.deleted_at}
                                        />
                                    </Tooltip>

                                    {newsItem.deleted_at ? (
                                        <Tooltip label="Восстановить" hasArrow>
                                            <IconButton
                                                size="sm"
                                                icon={<CFaUndo />}
                                                colorScheme="green"
                                                variant="ghost"
                                                onClick={() => handleRestoreNews(newsItem.id)}
                                                aria-label='Восстановить новость'
                                            />
                                        </Tooltip>
                                    ) : (
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
                                    )}
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
                            Здесь вы можете управлять новостями театральной студии "Антракт"
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
                    </ModalBody>

                    <ModalFooter borderTop="1px solid #333333">
                        <Button
                            variant="outline"
                            mr={3}
                            onClick={resetForm}
                            leftIcon={<CFaTimes />}
                            bg='#B00040'
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
                            Вы уверены, что хотите удалить эту новость?
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