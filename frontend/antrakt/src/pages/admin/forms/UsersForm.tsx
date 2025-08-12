import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Switch,
    Text,
    useToast,
    Flex,
} from "@chakra-ui/react";
import axios from "axios";

interface User {
    id?: number;
    email?: string;
    phone_number?: string;
    is_superuser: boolean;
    password?: string;
    confirmPassword?: string;
}

interface UsersFormProps {
    onSuccess: () => void;
}

const UsersForm: React.FC<UsersFormProps> = ({ onSuccess }) => {
    const toast = useToast();
    const [userData, setUserData] = useState<User>({
        email: "",
        phone_number: "",
        is_superuser: false,
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData((prev) => ({ ...prev, is_superuser: e.target.checked }));
    };

    const validate = (): boolean => {
        if (!userData.email && !userData.phone_number) {
            toast({
                title: "Укажите email или телефон",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        if (!userData.password || userData.password.length < 6) {
            toast({
                title: "Пароль должен быть не менее 6 символов",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        if (userData.password !== userData.confirmPassword) {
            toast({
                title: "Пароли не совпадают",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            const payload: any = {
                password: userData.password,
                is_superuser: userData.is_superuser,
            };
            if (userData.email) payload.email = userData.email;
            if (userData.phone_number) payload.phone_number = userData.phone_number;

            await axios.post("http://localhost:8000/register/", payload);
            toast({ title: "Пользователь создан", status: "success", duration: 3000, isClosable: true });
            setUserData({ email: "", phone_number: "", is_superuser: false, password: "", confirmPassword: "" });
            onSuccess();
        } catch (e: any) {
            toast({ title: "Ошибка", description: e?.response?.data || "Не удалось создать пользователя", status: "error", duration: 3000, isClosable: true });
        }
    };

    return (
        <Box>
            <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input name="email" value={userData.email || ''} onChange={handleChange} placeholder="email@domain.com" />
                </FormControl>
                <FormControl>
                    <FormLabel>Телефон</FormLabel>
                    <Input name="phone_number" value={userData.phone_number || ''} onChange={handleChange} placeholder="+7 999 999 99 99" />
                </FormControl>
            </Flex>

            <FormControl mt={4}>
                <FormLabel>Пароль</FormLabel>
                <Input name="password" type="password" value={userData.password || ''} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
                <FormLabel>Подтверждение пароля</FormLabel>
                <Input name="confirmPassword" type="password" value={userData.confirmPassword || ''} onChange={handleChange} />
            </FormControl>

            <FormControl display="flex" alignItems="center" mt={4}>
                <FormLabel mb="0">Суперпользователь</FormLabel>
                <Switch isChecked={userData.is_superuser} onChange={handleSwitchChange} />
            </FormControl>

            <Button mt={6} colorScheme="red" onClick={handleSubmit}>Создать</Button>
        </Box>
    );
};

export default UsersForm;