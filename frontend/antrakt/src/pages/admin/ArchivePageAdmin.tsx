import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Grid,
    GridItem,
    Heading,
    Flex,
    Button,
    VStack,
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
    IconButton,
    Tooltip,
    Image
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    FaPlus,
    FaTrash,
    FaEdit,
    FaUndo
} from 'react-icons/fa';
import axios from 'axios';
import { ArchiveForm } from './forms/ArchiveForm';

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);
const MotionButton = motion(Button);

const primaryColor = '#800020';
const secondaryColor = '#A00030';

const CFaPlus = chakra(FaPlus as any);
const CFaTrash = chakra(FaTrash as any);
const CFaEdit = chakra(FaEdit as any);
const CFaUndo = chakra(FaUndo as any);

interface Archive {
    id: number;
    title: string; // Добавлено поле title
    description: string;
    premiere_date: string;
    afisha: boolean;
    image_url: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    archive_image: string | null;
    images_list: [];
    age_limit: string;
}

const ArchivePageAdmin: React.FC = () => {
    const [archives, setArchives] = useState<Archive[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [currentArchive, setCurrentArchive] = useState<Archive | null>(null);
    const toast = useToast();

    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        fetchArchives();
    }, []);

    const fetchArchives = async () => {
        try {
            const response = await axios.get('http://localhost:8000/archive-admin/');
            setArchives(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Ошибка при загрузке архива:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить архивные записи',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    };

    const handleSoftDelete = async () => {
        if (!deleteId) return;

        try {
            await axios.put(`http://localhost:8000/archive${deleteId}/`, {
                deleted_at: new Date().toISOString()
            });
            setArchives(archives.map(archive =>
                archive.id === deleteId ? { ...archive, deleted_at: new Date().toISOString() } : archive
            ));
            toast({
                title: 'Успех!',
                description: 'Запись архива удалена',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Ошибка при удалении записи архива:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось удалить запись архива',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            onDeleteClose();
            setDeleteId(null);
        }
    };

    const handleRestoreArchive = async (id: number) => {
        try {
            await axios.put(`http://localhost:8000/archive${id}/`, {
                deleted_at: null
            });
            setArchives(archives.map(archive =>
                archive.id === id ? { ...archive, deleted_at: null } : archive
            ));
            toast({
                title: 'Успех!',
                description: 'Запись архива успешно восстановлена',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Ошибка при восстановлении записи архива:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось восстановить запись архива',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const openEditForm = (archive: Archive) => {
        setCurrentArchive(archive);
        onFormOpen();
    };

    const openCreateForm = () => {
        setCurrentArchive(null);
        onFormOpen();
    };

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const renderArchiveCards = () => {
        if (isLoading) {
            return (
                <Flex justify="center" align="center" minH="200px">
                    <Spinner size="xl" color={primaryColor} />
                </Flex>
            );
        }

        if (archives.length === 0) {
            return (
                <Text textAlign="center" fontSize="lg" color="#AAAAAA">
                    Архивные записи не найдены
                </Text>
            );
        }

        return (
            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap={6}
                w="100%"
                maxW="100%"
                overflow="hidden"
            >
                {archives.map(archive => (
                    <MotionGridItem
                        key={archive.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        w="100%"
                        position="relative"
                        zIndex={1}
                    >
                        <MotionBox
                            bg={archive.deleted_at ? "rgba(50,50,50,0.5)" : "rgba(255,255,255,0.05)"}
                            p={4}
                            borderRadius="xl"
                            border="1px solid"
                            borderColor={archive.deleted_at ? "#555" : "rgba(255,255,255,0.1)"}
                            backdropFilter="blur(10px)"
                            position="relative"
                            overflow="hidden"
                            whileHover={{
                                borderColor: archive.deleted_at ? "#666" : secondaryColor,
                                boxShadow: archive.deleted_at ? "none" : `0 0 20px ${secondaryColor}50`
                            }}
                            transition={{ duration: 0.3 }}
                            w="100%"
                            maxW="450px"
                            minW="300px"
                            mx="auto"
                            minH="300px"
                            opacity={archive.deleted_at ? 0.7 : 1}
                        >
                            {archive.deleted_at && (
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

                            {/* Обновлённый блок с изображением и заголовком */}
                            <Flex align="center" mb={4}>
                                <Box
                                    boxSize="90px"
                                    borderRadius="full"
                                    overflow="hidden"
                                    border={`2px solid ${primaryColor}`}
                                    flexShrink={0}
                                    bg="#222"
                                >
                                    <Image
                                        src={archive.image_url}
                                        alt={archive.title}
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                        objectPosition="top center"
                                    />
                                </Box>
                                <Box ml={4} maxW="calc(100% - 80px)">
                                    <Heading size="md" fontFamily="Playfair Display" noOfLines={1}>
                                        {archive.title}
                                    </Heading>
                                </Box>
                            </Flex>

                            <VStack align="start" spacing={2} mb={4}>
                                <Badge colorScheme={archive.afisha ? "green" : "purple"}>
                                    {archive.afisha ? "В афише" : "В архиве"}
                                </Badge>

                                <Text fontWeight="bold" fontSize="sm" color="#CCCCCC">
                                    Дата премьеры: {formatDate(archive.premiere_date)}
                                </Text>
                            </VStack>

                            <Text
                                noOfLines={3}
                                fontSize="sm"
                                color="#CCCCCC"
                                mb={4}
                            >
                                {archive.description}
                            </Text>

                            <Flex justify="flex-end" gap={2}>
                                <Tooltip label="Редактировать" hasArrow>
                                    <IconButton
                                        size="sm"
                                        icon={<CFaEdit />}
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => openEditForm(archive)}
                                        aria-label="Редактировать запись архива"
                                        isDisabled={!!archive.deleted_at}
                                    />
                                </Tooltip>

                                {archive.deleted_at ? (
                                    <Tooltip label="Восстановить" hasArrow>
                                        <IconButton
                                            size="sm"
                                            icon={<CFaUndo />}
                                            colorScheme="green"
                                            variant="ghost"
                                            onClick={() => handleRestoreArchive(archive.id)}
                                            aria-label="Восстановить запись архива"
                                        />
                                    </Tooltip>
                                ) : (
                                    <Tooltip label="Удалить" hasArrow>
                                        <IconButton
                                            size="sm"
                                            icon={<CFaTrash />}
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => confirmDelete(archive.id)}
                                            aria-label="Удалить запись архива"
                                        />
                                    </Tooltip>
                                )}
                            </Flex>
                        </MotionBox>
                    </MotionGridItem>
                ))}
            </Grid>
        );
    };

    return (
        <Box minH="100vh" bg="black" color="white" py={8} overflow="hidden" position="relative" zIndex={0}>
            <Container maxW="container.lg" px={{ base: 4, md: 6 }} overflow="hidden" position="relative" zIndex={1}>
                <Flex justify="space-between" align="center" mb={8} flexWrap="wrap">
                    <VStack align="start" spacing={2} mb={{ base: 4, md: 0 }}>
                        <Heading fontSize="3xl" fontFamily="Playfair Display" textShadow={`0 0 15px ${primaryColor}50`}>
                            Управление архивом
                        </Heading>
                        <Text color="#AAAAAA">
                            Архивные записи спектаклей театральной студии "Антракт"
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
                        Добавить запись
                    </MotionButton>
                </Flex>

                {renderArchiveCards()}
            </Container>

            {/* Модальное окно для создания/редактирования */}
            <Modal isOpen={isFormOpen} onClose={onFormClose} size="2xl" scrollBehavior="inside" isCentered>
                <ModalOverlay bg="blackAlpha.700" />
                <ModalContent bg="#222222" color="white">
                    <ModalHeader borderBottom="1px solid #333333" fontFamily="Playfair Display">
                        {currentArchive ? 'Редактировать запись архива' : 'Добавить новую запись в архив'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6} overflowY="auto">
                        <ArchiveForm
                            initialData={currentArchive || undefined}
                            onSuccess={() => {
                                fetchArchives();
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
                        <AlertDialogHeader fontSize="lg" fontWeight="bold" fontFamily="Playfair Display">
                            Удаление записи архива
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Вы уверены, что хотите удалить эту запись архива?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button
                                ref={cancelRef}
                                onClick={onDeleteClose}
                                borderColor="#555555"
                                _hover={{ bg: '#333333' }}
                            >
                                Отмена
                            </Button>
                            <Button
                                bg="#E53E3E"
                                _hover={{ bg: '#F56565' }}
                                onClick={handleSoftDelete}
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

export default ArchivePageAdmin;