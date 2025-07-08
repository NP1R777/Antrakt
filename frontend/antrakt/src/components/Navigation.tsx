import {
    Box,
    Flex,
    Text,
    Link,
    IconButton,
    useDisclosure,
    Stack,
    Collapse,
    Button,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useToast,
    LightMode
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal.tsx";
import axios from "axios";

const primaryColor = "#800020";
const darkBg = "#0a0a0a";
const lightText = "#ffffff";

const NAV_ITEMS = [
    { label: "Главная", href: "#" },
    { label: "О студии", href: "#about" },
    { label: "Наша команда", href: "#team" },
    { label: "Спектакли", href: "#performances" },
    { label: "Расписание", href: "#schedule" },
    { label: "Галерея", href: "#gallery" },
    { label: "Контакты", href: "#contacts" },
];

const REGISTER_URL = "http://127.0.0.1:8000/register/";
const LOGIN_URL = "http://127.0.0.1:8000/login/";

// Тип для данных пользователя
interface UserData {
    name: string;
    email: string;
    is_superuser: boolean;
}

export default function Navigation() {
    const { isOpen, onToggle } = useDisclosure();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [registeredEmail, setRegisteredEmail] = useState("");
    const toast = useToast();

    // Функция для загрузки данных пользователя
    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem("access");
            if (!token) return;

            const response = await axios.get(`http://localhost:8000/user${token}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUserData({
                name: response.data.name,
                email: response.data.email,
                is_superuser: response.data.is_superuser
            });
        } catch (error) {
            console.error("Ошибка загрузки профиля:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
            setIsAuthenticated(true);
            // Загружаем данные пользователя, включая флаг администратора
            fetchUserProfile();
        }
    }, []);

    const handleLoginClick = () => {
        setAuthMode("login");
        setIsAuthModalOpen(true);
    };

    const handleRegisterClick = () => {
        setAuthMode("register");
        setIsAuthModalOpen(true);
    };

    const handleRegister = async (email: string, password: string, phone: string) => {
        try {
            const response = await axios.post(REGISTER_URL, {
                email,
                password,
                phone_number: phone
            });

            setRegisteredEmail(email);
            localStorage.setItem("id", response.data.user.id)

            toast({
                title: "Успешная регистрация!",
                description: "Теперь войдите в свой аккаунт.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top"
            });

            setAuthMode("login");
            return true;
        } catch (error: any) {
            toast({
                title: "Ошибка регистрации",
                description: error.response?.data?.message || "Произошла ошибка",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            return false;
        }
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await axios.post(LOGIN_URL, {
                email,
                password
            });

            localStorage.setItem("access", response.data.access);
            setIsAuthenticated(true);

            // После входа загружаем данные пользователя
            await fetchUserProfile();

            toast({
                title: "Вход выполнен!",
                description: "Добро пожаловать!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top"
            });

            setIsAuthModalOpen(false);
            return true;
        } catch (error: any) {
            toast({
                title: "Ошибка входа",
                description: error.response?.data?.message || "Неверный email или пароль",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            return false;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("id")
        setIsAuthenticated(false);
        setUserData(null);
        toast({
            title: "Вы вышли из системы",
            status: "info",
            duration: 2000,
            isClosable: true,
            position: "top"
        });
    };

    return (
        <Box
            as="nav"
            position="sticky"
            top={0}
            zIndex="modal"
            bg="rgba(0, 0, 0, 0.8)"
            backdropFilter="blur(10px)"
            borderBottom="1px solid"
            borderColor={primaryColor}
        >
            <Flex
                maxW="container.xl"
                mx="auto"
                align="center"
                justify="space-between"
                px={{ base: 4, md: 8 }}
                py={4}
            >
                <Box>
                    <Link href="#" _hover={{ textDecoration: "none" }}>
                        <Text fontSize="xl" fontWeight="bold" color={lightText} letterSpacing="wide">
                            ТЕАТР СТУДИЯ <Text as="span" color={primaryColor}>АНТРАКТ</Text>
                        </Text>
                    </Link>
                </Box>

                <Flex display={{ base: "none", md: "flex" }} align="center" gap={6}>
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            color={lightText}
                            fontWeight={500}
                            _hover={{ textDecoration: "none", color: primaryColor, transform: "translateY(-2px)" }}
                            transition="all 0.3s"
                        >
                            {item.label}
                        </Link>
                    ))}

                    {!isAuthenticated ? (
                        <Button
                            variant="outline"
                            color={lightText}
                            borderColor={primaryColor}
                            _hover={{ bg: primaryColor, transform: "translateY(-2px)" }}
                            onClick={handleLoginClick}
                        >
                            Войти
                        </Button>
                    ) : (
                        <Menu>
                            <MenuButton>
                                <Avatar
                                    size="sm"
                                    name={userData?.name || "User"}
                                    bg={primaryColor}
                                    color={lightText}
                                    cursor="pointer"
                                />
                            </MenuButton>
                            <MenuList bg={darkBg} borderColor="#1a1a1a">
                                <MenuItem bg={darkBg} _hover={{ bg: "#1a1a1a" }} color={lightText}>
                                    Профиль
                                </MenuItem>

                                {/* Пункт "Админ-панель" только для суперпользователей */}
                                {userData?.is_superuser && (
                                    <MenuItem
                                        bg={darkBg}
                                        _hover={{ bg: "#1a1a1a" }}
                                        color={lightText}
                                        onClick={() => window.location.href = "/admin"}
                                    >
                                        Админ-панель
                                    </MenuItem>
                                )}

                                <MenuItem
                                    bg={darkBg}
                                    _hover={{ bg: "#1a1a1a" }}
                                    color={primaryColor}
                                    onClick={handleLogout}
                                >
                                    Выйти
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    )}
                </Flex>

                <IconButton
                    display={{ base: "flex", md: "none" }}
                    onClick={onToggle}
                    icon={isOpen ? <CloseIcon w={4} h={4} /> : <HamburgerIcon w={6} h={6} />}
                    variant="ghost"
                    aria-label="Toggle Navigation"
                    color={lightText}
                    _hover={{ bg: primaryColor }}
                />
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <Box display={{ md: "none" }} bg="rgba(0, 0, 0, 0.95)" px={4} py={2}>
                    <Stack as="nav" spacing={4}>
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                color={lightText}
                                py={2}
                                px={4}
                                bg="rgba(90, 0, 23, 0.3)"
                                borderRadius="md"
                                fontWeight={500}
                                _hover={{ transform: "translateX(10px)", bg: "rgba(128, 0, 32, 0.5)" }}
                                transition="all 0.2s"
                                display="block"
                            >
                                {item.label}
                            </Link>
                        ))}

                        {!isAuthenticated && (
                            <Button
                                variant="outline"
                                color={lightText}
                                borderColor={primaryColor}
                                _hover={{ bg: primaryColor }}
                                onClick={handleLoginClick}
                                mt={2}
                            >
                                Войти
                            </Button>
                        )}
                    </Stack>
                </Box>
            </Collapse>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => {
                    setIsAuthModalOpen(false);
                    setRegisteredEmail("");
                }}
                mode={authMode}
                switchToRegister={handleRegisterClick}
                switchToLogin={handleLoginClick}
                onRegister={handleRegister}
                onLogin={handleLogin}
                registeredEmail={registeredEmail}
            />
        </Box>
    );
}