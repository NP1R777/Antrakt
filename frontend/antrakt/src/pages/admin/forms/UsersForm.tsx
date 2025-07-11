import React, { useState } from 'react';
import {
    VStack,
    FormControl,
    FormLabel,
    Input,
    Switch,
    Text,
    Button,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
} from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import { FaTimes, FaSave } from 'react-icons/fa';
import axios from 'axios';

const CFaTimes = chakra(FaTimes as any);
const CFaSave = chakra(FaSave as any);

const primaryColor = '#800020';
const accentColor = '#4ECDC4';

interface User {
    id?: number;
    email: string;
    phone_number: string;
    is_superuser: boolean;
    password?: string;
    confirmPassword?: string;
}

interface UserFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: User;
    onSuccess: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
    isOpen,
    onClose,
    initialData,
    onSuccess
}) => {
    const [user, setUser] = useState<User>(initialData || {
        email: '',
        phone_number: '',
        is_superuser: false,
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!user.email) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            newErrors.email = 'Некорректный формат email';
        }

        if (!initialData && !user.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (!initialData && user.password && user.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        if (!initialData && user.password !== user.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const userData = {
                email: user.email,
                phone_number: user.phone_number,
                is_superuser: user.is_superuser,
                password: user.password
            };

            if (initialData) {
                await axios.put(`http://localhost:8000/users/${initialData.id}/`, userData);
            } else {
                await axios.post('http://localhost:8000/users/', userData);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Ошибка при сохранении пользователя:', error);
            setErrors({ form: 'Ошибка при сохранении пользователя' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside" isCentered>
            <ModalOverlay bg="blackAlpha.700" />
            <ModalContent bg="#222222" color="white">
                <ModalHeader borderBottom="1px solid #333333" fontWeight="semibold">
                    {initialData ? 'Редактировать пользователя' : 'Добавить нового пользователя'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody py={6}>
                    <VStack spacing={4} align="stretch">
                        <FormControl isInvalid={!!errors.email} isRequired>
                            <FormLabel display="flex" alignItems="center" gap={2}>
                                <Text as="span" fontWeight="semibold">Email</Text>
                            </FormLabel>
                            <Input
                                name="email"
                                type="email"
                                value={user.email}
                                onChange={handleInputChange}
                                placeholder="Введите email"
                                focusBorderColor={primaryColor}
                                bg="#333333"
                                borderColor="#444444"
                                _hover={{ borderColor: '#555555' }}
                                isDisabled={false} // Разрешаем редактирование email
                            />
                            {errors.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
                        </FormControl>

                        <FormControl>
                            <FormLabel display="flex" alignItems="center" gap={2}>
                                <Text as="span" fontWeight="semibold">Телефон</Text>
                            </FormLabel>
                            <Input
                                name="phone_number"
                                value={user.phone_number}
                                onChange={handleInputChange}
                                placeholder="Введите телефон"
                                focusBorderColor={primaryColor}
                                bg="#333333"
                                borderColor="#444444"
                                _hover={{ borderColor: '#555555' }}
                            />
                        </FormControl>

                        {!initialData && (
                            <>
                                <FormControl isInvalid={!!errors.password} isRequired>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <Text as="span" fontWeight="semibold">Пароль</Text>
                                    </FormLabel>
                                    <Input
                                        name="password"
                                        type="password"
                                        value={user.password || ''}
                                        onChange={handleInputChange}
                                        placeholder="Введите пароль"
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                    />
                                    {errors.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
                                </FormControl>

                                <FormControl isInvalid={!!errors.confirmPassword} isRequired>
                                    <FormLabel display="flex" alignItems="center" gap={2}>
                                        <Text as="span" fontWeight="semibold">Подтверждение пароля</Text>
                                    </FormLabel>
                                    <Input
                                        name="confirmPassword"
                                        type="password"
                                        value={user.confirmPassword || ''}
                                        onChange={handleInputChange}
                                        placeholder="Подтвердите пароль"
                                        focusBorderColor={primaryColor}
                                        bg="#333333"
                                        borderColor="#444444"
                                        _hover={{ borderColor: '#555555' }}
                                    />
                                    {errors.confirmPassword && <Text color="red.500" fontSize="sm">{errors.confirmPassword}</Text>}
                                </FormControl>
                            </>
                        )}

                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="is_superuser" mb="0">
                                <Text as="span" fontWeight="semibold">Администратор</Text>
                            </FormLabel>
                            <Switch
                                id="is_superuser"
                                name="is_superuser"
                                isChecked={user.is_superuser}
                                onChange={handleInputChange}
                                colorScheme="green"
                                ml={2}
                            />
                        </FormControl>

                        {errors.form && <Text color="red.500" textAlign="center">{errors.form}</Text>}
                    </VStack>
                </ModalBody>
                <ModalFooter borderTop="1px solid #333333">
                    <HStack spacing={3}>
                        <Button
                            variant="outline"
                            mr={3}
                            onClick={onClose}
                            leftIcon={<CFaTimes />}
                            bg="#B00040"
                            borderColor="#B00040"
                            _hover={{ bg: 'red' }}
                        >
                            Отмена
                        </Button>
                        <Button
                            bg="#3182CE"
                            _hover={{ bg: '#4299E1' }}
                            isLoading={isSubmitting}
                            onClick={handleSubmit}
                            leftIcon={<CFaSave />}
                        >
                            {initialData ? 'Обновить' : 'Добавить'}
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};