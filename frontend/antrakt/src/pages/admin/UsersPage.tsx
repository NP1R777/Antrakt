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
    Avatar
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    FaUserPlus,
    FaTrash,
    FaEdit,
    FaUndo
} from 'react-icons/fa';
import axios from 'axios';
import { UserForm } from './forms/UsersForm';

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);
const MotionButton = motion(Button);

const primaryColor = '#800020';
const secondaryColor = '#A00030';

const CFaUserPlus = chakra(FaUserPlus as any);
const CFaTrash = chakra(FaTrash as any);
const CFaEdit = chakra(FaEdit as any);
const CFaUndo = chakra(FaUndo as any);

interface User {
    id: number;
    email: string;
    phone_number: string;
    is_superuser: boolean;
    created_at: string;
    is_staff: boolean;
    deleted_at?: string | null;
}

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const toast = useToast();

    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users/');
            setUsers(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить пользователей',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!id) return;

        try {
            await axios.put(`http://localhost:8000/user${id}/`, {
                deleted_at: new Date().toISOString()
            });
            toast({
                title: 'Успех!',
                description: 'Пользователь удалён',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === id
                        ? { ...user, deleted_at: new Date().toISOString() }
                        : user
                )
            );
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось удалить пользователя',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            onDeleteClose();
            setDeleteId(null);
        }
    };

    const handleRestoreUser = async (id: number) => {
        if (!id) return;

        try {
            await axios.put(`http://localhost:8000/user${id}/`, {
                deleted_at: null
            });
            toast({
                title: 'Успех!',
                description: 'Пользователь восстановлен',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === id
                        ? { ...user, deleted_at: null }
                        : user
                )
            );
        } catch (error) {
            console.error('Ошибка при восстановлении пользователя:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось восстановить пользователя',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const openEditForm = (user: User) => {
        setCurrentUser(user);
        onFormOpen();
    };

    const openCreateForm = () => {
        setCurrentUser(null);
        onFormOpen();
    };

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const renderUserCards = () => {
        if (isLoading) {
            return (
                <Flex justify="center" align="center" minH="200px">
                    <Spinner size="xl" color={primaryColor} />
                </Flex>
            );
        }

        if (users.length === 0) {
            return (
                <Text textAlign="center" fontSize="lg" color="#AAAAAA">
                    Пользователи не найдены
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
                {users.map(user => (
                    <MotionGridItem
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        w="100%"
                        position="relative"
                        zIndex={1}
                    >
                        <MotionBox
                            bg={user.deleted_at ? "rgba(50,50,50,0.5)" : "rgba(255,255,255,0.05)"}
                            p={4}
                            borderRadius="xl"
                            border="1px solid"
                            borderColor={user.deleted_at ? "#555" : "rgba(255,255,255,0.1)"}
                            backdropFilter="blur(10px)"
                            position="relative"
                            overflow="hidden"
                            whileHover={{
                                borderColor: user.deleted_at ? "#666" : secondaryColor,
                                boxShadow: user.deleted_at ? "none" : `0 0 20px ${secondaryColor}50`
                            }}
                            transition={{ duration: 0.3 }}
                            w="100%"
                            maxW="100%"
                            minH="200px"
                        >
                            {user.deleted_at && (
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

                            <Flex align="center" mb={4}>
                                <Avatar
                                    size="lg"
                                    name={user.email}
                                    bg={primaryColor}
                                    color="white"
                                    opacity={user.deleted_at ? 0.6 : 1}
                                />
                                <Box ml={4} maxW="calc(100% - 80px)">
                                    <Heading
                                        size="md"
                                        fontFamily="Playfair Display"
                                        noOfLines={1}
                                        color={user.deleted_at ? "#999" : "white"}
                                    >
                                        {user.email}
                                    </Heading>
                                    <Text
                                        color={user.deleted_at ? "#999" : "#CCCCCC"}
                                        fontSize="sm"
                                        mt={1}
                                        opacity={user.deleted_at ? 0.6 : 1}
                                    >
                                        {user.phone_number || 'Телефон не указан'}
                                    </Text>
                                </Box>
                            </Flex>

                            <Flex align="center" mb={4}>
                                <Badge
                                    colorScheme={user.is_superuser ? "green" : "blue"}
                                    px={3}
                                    py={1}
                                    borderRadius="md"
                                    opacity={user.deleted_at ? 0.6 : 1}
                                >
                                    {user.is_superuser ? 'Администратор' : 'Пользователь'}
                                </Badge>
                                <Text
                                    ml={3}
                                    fontSize="sm"
                                    color={user.deleted_at ? "#999" : "#AAAAAA"}
                                    opacity={user.deleted_at ? 0.6 : 1}
                                >
                                    Создан: {formatDate(user.created_at)}
                                </Text>
                            </Flex>

                            <Flex justify="flex-end" gap={2}>
                                <Tooltip label="Редактировать" hasArrow>
                                    <IconButton
                                        aria-label="Редактировать пользователя"
                                        icon={<CFaEdit />}
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => openEditForm(user)}
                                        isDisabled={!!user.deleted_at}
                                    />
                                </Tooltip>

                                {user.deleted_at ? (
                                    <Tooltip label="Восстановить" hasArrow>
                                        <IconButton
                                            aria-label="Восстановить пользователя"
                                            icon={<CFaUndo />}
                                            colorScheme="green"
                                            variant="ghost"
                                            onClick={() => handleRestoreUser(user.id)}
                                        />
                                    </Tooltip>
                                ) : (
                                    <Tooltip label="Удалить" hasArrow>
                                        <IconButton
                                            aria-label="Удалить пользователя"
                                            icon={<CFaTrash />}
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => confirmDelete(user.id)}
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
            <Container maxW="container.xl" px={{ base: 4, md: 6 }} overflow="hidden" position="relative" zIndex={1}>
                <Flex justify="space-between" align="center" mb={8} flexWrap="wrap">
                    <VStack align="start" spacing={2} mb={{ base: 4, md: 0 }} maxW="100%">
                        <Heading fontSize="3xl" fontFamily="Playfair Display" textShadow={`0 0 15px ${primaryColor}50`}>
                            Управление пользователями
                        </Heading>
                        <Text color="#AAAAAA">
                            Здесь вы можете управлять пользователями системы
                        </Text>
                    </VStack>

                    <MotionButton
                        leftIcon={<CFaUserPlus />}
                        bg={primaryColor}
                        _hover={{ bg: '#900030' }}
                        onClick={openCreateForm}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        mb={{ base: 4, md: 0 }}
                    >
                        Добавить пользователя
                    </MotionButton>
                </Flex>

                {renderUserCards()}
            </Container>

            <UserForm
                isOpen={isFormOpen}
                onClose={onFormClose}
                initialData={currentUser}
                onSuccess={() => {
                    fetchUsers();
                    onFormClose();
                }}
            />

            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="#222222" color="white">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold" fontFamily="Playfair Display">
                            Удаление пользователя
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Вы уверены, что хотите удалить этого пользователя?
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
                                onClick={() => handleDeleteUser(deleteId!)}
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

export default UsersPage;