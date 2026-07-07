import React, { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    Heading,
    Text,
    Avatar,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    VStack,
    HStack,
    IconButton,
    Divider,
    Grid,
    GridItem,
    Icon,
    Container,
    Skeleton,
    SkeletonCircle,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaEdit, FaTrash, FaArrowLeft, FaImage, FaUser, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);
const CFaPhone = motion(FaPhone as any);
const CFaImage = motion(FaImage as any);
const CFaUser = motion(FaUser as any);
const CFaSave = motion(FaSave as any);
const CFaTrash = motion(FaTrash as any);
const CFaEdit = motion(FaEdit as any);

const primaryColor = '#f2f2f2';
const secondaryColor = '#8a8a8a';
const accentColor = '#c9c9c9';

interface UserProfile {
    id: number;
    email: string;
    phone_number: string;
    profile_photo: string | null;
    is_superuser: boolean;
}

interface User {
    id: number;
    email: string;
    phone_number: string;
    profile_photo: string | null;
    is_superuser: boolean;
}

interface ChangePasswordFormData {
    current_password: string;
    new_password: string;
}

const ProfileForm: React.FC<{
    initialData: Partial<UserProfile>;
    onSave: (data: Partial<UserProfile>) => Promise<void>;
    onCancel: () => void;
}> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<UserProfile>>(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (imageUrl: string) => {
        setFormData(prev => ({ ...prev, profile_photo: imageUrl }));
    };

    const handleImageRemove = () => {
        setFormData(prev => ({ ...prev, profile_photo: null }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSave(formData);
            toast({
                title: 'Профиль обновлён',
                description: 'Ваши данные успешно сохранены',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Ошибка',
                description: 'Не удалось обновить профиль',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <VStack spacing={6} align="stretch">
            <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2} color="gray.300">
                    <Icon as={CFaUser} color={primaryColor} />
                    Электронная почта
                </FormLabel>
                <Input
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    placeholder="Введите email"
                    focusBorderColor={primaryColor}
                    bg="#333333"
                    borderColor="#444444"
                    color="white"
                    _hover={{ borderColor: '#555555' }}
                />
            </FormControl>

            <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2} color="gray.300">
                    <Icon as={CFaPhone} color={primaryColor} />
                    Номер телефона
                </FormLabel>
                <Input
                    name="phone_number"
                    value={formData.phone_number || ''}
                    onChange={handleInputChange}
                    placeholder="+7 (XXX) XXX-XX-XX"
                    focusBorderColor={primaryColor}
                    bg="#333333"
                    borderColor="#444444"
                    color="white"
                    _hover={{ borderColor: '#555555' }}
                />
            </FormControl>

            <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2} color="gray.300">
                    <Icon as={CFaImage} color={primaryColor} />
                    Фотография профиля
                </FormLabel>
                <ImageUpload
                    currentImageUrl={formData.profile_photo || ''}
                    onImageUpload={handleImageUpload}
                    onImageRemove={handleImageRemove}
                    contentType="profile"
                    maxSize={5}
                    compact={true}
                    disabled={isSubmitting}
                />
            </FormControl>

            <Flex justify="flex-end" gap={3}>
                <Button
                    variant="outline"
                    color="white"
                    borderColor="#3a3a3a"
                    _hover={{ bg: '#3a3a3a' }}
                    onClick={onCancel}
                >
                    Отмена
                </Button>
                <Button
                    bg={primaryColor}
                    color="#0a0a0a"
                    _hover={{ bg: "#d9d9d9" }}
                    isLoading={isSubmitting}
                    onClick={handleSubmit}
                    leftIcon={<Icon as={CFaSave} />}
                >
                    Сохранить
                </Button>
            </Flex>
        </VStack>
    );
};

const ChangePasswordForm: React.FC<{
    userId: number;
    onSuccess: () => void;
    onCancel: () => void;
}> = ({ userId, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState<ChangePasswordFormData>({
        current_password: '',
        new_password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:8000/change-password/', {
                current_password: formData.current_password,
                new_password: formData.new_password,
            });
            toast({
                title: 'Пароль изменён',
                description: 'Ваш пароль успешно обновлён',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onSuccess();
        } catch (error: any) {
            console.error('Ошибка при смене пароля:', error);
            const data = error?.response?.data;
            let description = 'Не удалось изменить пароль';
            if (data?.error) {
                description = data.error;
            } else if (data?.new_password && Array.isArray(data.new_password)) {
                description = data.new_password[0];
            }
            toast({
                title: 'Ошибка',
                description,
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <VStack spacing={6} align="stretch">
            <FormControl>
                <FormLabel color="gray.300">Текущий пароль</FormLabel>
                <Input
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleInputChange}
                    placeholder="Введите текущий пароль"
                    focusBorderColor={primaryColor}
                    bg="#333333"
                    borderColor="#444444"
                    color="white"
                    _hover={{ borderColor: '#555555' }}
                />
            </FormControl>

            <FormControl>
                <FormLabel color="gray.300">Новый пароль</FormLabel>
                <Input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleInputChange}
                    placeholder="Введите новый пароль"
                    focusBorderColor={primaryColor}
                    bg="#333333"
                    borderColor="#444444"
                    color="white"
                    _hover={{ borderColor: '#555555' }}
                />
            </FormControl>

            <Flex justify="flex-end" gap={3}>
                <Button
                    variant="outline"
                    color="white"
                    borderColor="#3a3a3a"
                    _hover={{ bg: '#3a3a3a' }}
                    onClick={onCancel}
                >
                    Отмена
                </Button>
                <Button
                    bg={primaryColor}
                    color="#0a0a0a"
                    _hover={{ bg: "#d9d9d9" }}
                    isLoading={isSubmitting}
                    onClick={handleSubmit}
                    leftIcon={<Icon as={CFaSave} />}
                >
                    Сохранить
                </Button>
            </Flex>
        </VStack>
    );
};

export default function ProfilePage() {
    const navigate = useNavigate();
    const toast = useToast();
    const { user, isAuthenticated, logout, updateUser } = useAuth();
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
    const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
    const { isOpen: isPasswordModalOpen, onOpen: onPasswordModalOpen, onClose: onPasswordModalClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [myReviews, setMyReviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchMyReviews = async () => {
            try {
                const res = await axios.get('http://localhost:8000/my/reviews/');
                setMyReviews(res.data || []);
            } catch (error) {
                console.error('Ошибка при загрузке отзывов:', error);
            }
        };
        if (isAuthenticated && user) {
            fetchMyReviews();
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:8000/user${user?.id}/`);
                setProfile(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error);
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось загрузить данные профиля',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                setIsLoading(false);
            }
        };

        if (isAuthenticated && user) {
            fetchProfile();
        } else {
            navigate('/');
        }
    }, [user, isAuthenticated, navigate, toast]);

    const handleSaveProfile = async (data: Partial<UserProfile>) => {
        if (!profile) return;

        try {
            const updatedData: UserProfile = {
                ...profile,
                email: data.email || profile.email,
                phone_number: data.phone_number || profile.phone_number,
                profile_photo: data.profile_photo || profile.profile_photo,
            };

            await axios.put(`http://localhost:8000/user${profile.id}/`, updatedData);

            updateUser({
                ...user!,
                email: updatedData.email,
                phone_number: updatedData.phone_number,
                profile_photo: updatedData.profile_photo,
            } as User);

            setProfile(updatedData);
            onEditModalClose();
        } catch (error) {
            throw error;
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete(`http://localhost:8000/user${profile?.id}/`);
            logout();
            navigate('/');
            toast({
                title: 'Аккаунт удалён',
                description: 'Ваш аккаунт был успешно удалён',
                status: 'info',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Ошибка при удалении аккаунта:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось удалить аккаунт',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            onDeleteModalClose();
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Box bg="black" minH="100vh" display="flex" flexDirection="column" overflowX="hidden">
            <Navigation />
            <Box flex="1" py={{ base: 12, md: 20 }} position="relative" px={{ base: 4, md: 8 }}>
                <MotionBox
                    position="absolute"
                    top="-10%"
                    right="-10%"
                    w="400px"
                    h="400px"
                    bg="linear-gradient(135deg, #2a2a2a, #151515)"
                    borderRadius="full"
                    filter="blur(80px)"
                    opacity={0.2}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                />

                <Container
                    maxW="container.xl"
                    position="relative"
                    zIndex="1"
                    px={{ base: 0, md: 4 }}
                >
                    <MotionBox
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        mb={12}
                        textAlign="center"
                        px={{ base: 4, md: 0 }}
                    >
                        <Heading
                            as="h1"
                            fontSize={{ base: "2xl", md: "3xl" }}
                            color="white"
                            mb={4}
                            position="relative"
                            display="inline-block"
                            _after={{
                                content: '""',
                                position: "absolute",
                                bottom: "-10px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "80px",
                                height: "4px",
                                bg: primaryColor,
                                borderRadius: "full"
                            }}
                        >
                            Личный кабинет
                        </Heading>
                    </MotionBox>

                    <MotionGrid
                        templateColumns={{ base: '1fr', md: '1fr 2fr' }}
                        gap={8}
                        bg="linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(64, 0, 16, 0.3))"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="rgba(64, 0, 16, 0.7)"
                        p={{ base: 4, md: 8 }}
                        boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.3,
                                    duration: 1.2,
                                    ease: "easeOut"
                                }
                            }
                        }}
                    >
                        <MotionGridItem
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
                            }}
                        >
                            <VStack spacing={6} align="center">
                                {isLoading ? (
                                    <SkeletonCircle size="200px" />
                                ) : (
                                    <Box position="relative">
                                        <Avatar
                                            size="2xl"
                                            src={profile?.profile_photo || undefined}
                                            name={profile?.email || 'User'}
                                            bg={primaryColor}
                                            color="#0a0a0a"
                                            border="4px solid"
                                            borderColor={secondaryColor}
                                            boxShadow="0 0 20px rgba(128, 0, 32, 0.5)"
                                        />
                                    </Box>
                                )}

                                <VStack spacing={2} textAlign="center">
                                    {isLoading ? (
                                        <>
                                            <Skeleton height="20px" width="150px" />
                                            <Skeleton height="16px" width="120px" />
                                        </>
                                    ) : (
                                        <>
                                            <Text fontSize="xl" fontWeight="bold" color="white">
                                                {profile?.email}
                                            </Text>
                                            <Text color="gray.400">
                                                {profile?.is_superuser ? 'Администратор' : 'Пользователь'}
                                            </Text>
                                        </>
                                    )}
                                </VStack>

                                <Divider borderColor="rgba(64, 0, 16, 0.7)" />

                                <Button
                                    colorScheme="red"
                                    variant="outline"
                                    leftIcon={<Icon as={CFaTrash} />}
                                    onClick={onDeleteModalOpen}
                                    size="sm"
                                    w="full"
                                >
                                    Удалить аккаунт
                                </Button>
                            </VStack>
                        </MotionGridItem>

                        <MotionGridItem
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
                            }}
                        >
                            <VStack spacing={6} align="stretch">
                                <Flex justify="space-between" align="center">
                                    <Heading as="h2" fontSize="2xl" color="white">
                                        Личные данные
                                    </Heading>
                                    <Button
                                        leftIcon={<Icon as={CFaEdit} />}
                                        colorScheme="brand"
                                        onClick={onEditModalOpen}
                                    >
                                        Редактировать
                                    </Button>
                                </Flex>

                                <Divider borderColor="rgba(64, 0, 16, 0.7)" />

                                <VStack spacing={6} align="stretch">
                                    <FormControl>
                                        <FormLabel color="gray.300">Электронная почта</FormLabel>
                                        {isLoading ? (
                                            <Skeleton height="40px" />
                                        ) : (
                                            <Text color="white" fontSize="lg">
                                                {profile?.email}
                                            </Text>
                                        )}
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel color="gray.300">Номер телефона</FormLabel>
                                        {isLoading ? (
                                            <Skeleton height="40px" />
                                        ) : (
                                            <Text color="white" fontSize="lg">
                                                {profile?.phone_number || 'Не указан'}
                                            </Text>
                                        )}
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel color="gray.300">Пароль</FormLabel>
                                        <Button
                                            variant="outline"
                                            color="white"
                                            w="full"
                                            onClick={onPasswordModalOpen}
                                        >
                                            Изменить пароль
                                        </Button>
                                    </FormControl>
                                </VStack>
                            </VStack>
                        </MotionGridItem>
                    </MotionGrid>

                    <MotionBox
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                        mt={8}
                        bg="linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(64, 0, 16, 0.3))"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="rgba(64, 0, 16, 0.7)"
                        p={{ base: 4, md: 8 }}
                        boxShadow="0 5px 20px rgba(0, 0, 0, 0.5)"
                        _hover={{ boxShadow: "0 10px 25px rgba(245, 101, 101, 0.4)", transition: { duration: 0.5, ease: "easeOut" } }}
                    >
                        <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={2}>
                            <Heading as="h2" fontSize="2xl" color="white">
                                Мои отзывы
                            </Heading>
                            <Text color="gray.400">Всего: {myReviews.length}</Text>
                        </Flex>

                        {myReviews.length === 0 ? (
                            <Text color="gray.500">Вы ещё не оставляли отзывов.</Text>
                        ) : (
                            <VStack spacing={4} align="stretch">
                                {myReviews.map((review) => (
                                    <Box
                                        key={review.id}
                                        bg="rgba(30, 30, 30, 0.5)"
                                        borderRadius="lg"
                                        p={4}
                                        border="1px solid"
                                        borderColor="rgba(64, 0, 16, 0.7)"
                                        cursor="pointer"
                                        _hover={{ borderColor: primaryColor }}
                                        onClick={() => navigate(
                                            review.subject_type === 'performance'
                                                ? `/performance/${review.performance}`
                                                : `/actor/${review.actor}`
                                        )}
                                    >
                                        <Text color={accentColor} fontSize="sm" mb={1}>
                                            {review.subject_type === 'performance' ? 'Спектакль' : 'Актёр'}: {review.subject_title || '—'}
                                        </Text>
                                        <Text color="gray.200" noOfLines={2}>{review.text}</Text>
                                        <Text color="gray.500" fontSize="xs" mt={2}>
                                            {new Date(review.created_at).toLocaleDateString('ru-RU')}
                                        </Text>
                                    </Box>
                                ))}
                            </VStack>
                        )}
                    </MotionBox>
                </Container>

                {/* Модальное окно для удаления аккаунта */}
                <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} isCentered size="sm">
                    <ModalOverlay />
                    <ModalContent bg="#1a1a1a" color="white" borderRadius="xl" border="1px solid" borderColor="rgba(64, 0, 16, 0.7)">
                        <ModalHeader>Удаление аккаунта</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>Вы уверены, что хотите удалить аккаунт? Это действие необратимо.</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="outline"
                                color="white"
                                borderColor="#3a3a3a"
                                _hover={{ bg: '#3a3a3a' }}
                                mr={3}
                                onClick={onDeleteModalClose}
                            >
                                Отмена
                            </Button>
                            <Button
                                bg="red.600"
                                color="white"
                                _hover={{ bg: 'red.700' }}
                                onClick={handleDeleteAccount}
                            >
                                Подтвердить
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Модальное окно для редактирования профиля */}
                <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} isCentered size={{ base: "sm", md: "lg" }}>
                    <ModalOverlay />
                    <ModalContent bg="#1a1a1a" color="white" borderRadius="xl" border="1px solid" borderColor="rgba(64, 0, 16, 0.7)">
                        <ModalHeader>Редактировать профиль</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <ProfileForm
                                initialData={{
                                    email: profile?.email,
                                    phone_number: profile?.phone_number,
                                    profile_photo: profile?.profile_photo
                                }}
                                onSave={handleSaveProfile}
                                onCancel={onEditModalClose}
                            />
                        </ModalBody>
                    </ModalContent>
                </Modal>

                {/* Модальное окно для смены пароля */}
                <Modal isOpen={isPasswordModalOpen} onClose={onPasswordModalClose} isCentered size="sm">
                    <ModalOverlay />
                    <ModalContent bg="#1a1a1a" color="white" borderRadius="xl" border="1px solid" borderColor="rgba(64, 0, 16, 0.7)">
                        <ModalHeader>Изменить пароль</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <ChangePasswordForm
                                userId={profile?.id || 0}
                                onSuccess={onPasswordModalClose}
                                onCancel={onPasswordModalClose}
                            />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
            <Footer />
        </Box>
    );
}
