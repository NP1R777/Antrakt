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
    Tooltip,
    Image,
    IconButton
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    FaPlus,
    FaTrash,
    FaEdit,
    FaNewspaper,
    FaEye,
    FaEyeSlash,
    FaUndo
} from 'react-icons/fa';
import axios from 'axios';
import { NewsForm } from './forms/NewsForm';

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);
const MotionButton = motion(Button);

const primaryColor = '#800020';
const secondaryColor = '#A00030';

const CFaPlus = chakra(FaPlus as any);
const CFaTrash = chakra(FaTrash as any);
const CFaEdit = chakra(FaEdit as any);
const CFaNewspaper = chakra(FaNewspaper as any);
const CFaEye = chakra(FaEye as any);
const CFaEyeSlash = chakra(FaEyeSlash as any);
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
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [currentNews, setCurrentNews] = useState<News | null>(null);
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

    const handleDeleteNews = async () => {
        if (!deleteId) return;

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
            onDeleteClose();
            setDeleteId(null);
        }
    };

    const handleRestoreNews = async (id: number) => {
        if (!id) return;

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
        }
    };

    const openEditForm = (newsItem: News) => {
        setCurrentNews(newsItem);
        onFormOpen();
    };

    const openCreateForm = () => {
        setCurrentNews(null);
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
                        onClick={openCreateForm}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Добавить новость
                    </MotionButton>
                </Flex>

                {renderNewsCards()}
            </Container>

            {/* Модальное окно для создания/редактирования */}
            <Modal isOpen={isFormOpen} onClose={onFormClose} size="4xl" scrollBehavior="inside">
                <ModalOverlay bg="blackAlpha.700" />
                <ModalContent bg="#222222" color="white">
                    <ModalHeader borderBottom="1px solid #333333" fontFamily="Playfair Display">
                        {currentNews ? 'Редактировать новость' : 'Добавить новую новость'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        <NewsForm
                            initialData={currentNews || undefined}
                            onSuccess={() => {
                                fetchNews();
                                onFormClose();
                            }}
                            onCancel={onFormClose}
                        />
                    </ModalBody>
                    <ModalFooter borderTop="1px solid #333333" />
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