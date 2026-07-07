import React from "react";
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
    useToast
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom"; // Добавлен импорт Link as RouterLink
import AuthModal from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";

const primaryColor = "#f2f2f2";
const darkBg = "#0a0a0a";
const lightText = "#ffffff";

const NAV_ITEMS = [
    { label: "Афиша", href: "afisha" },
    { label: "Новости", href: "news" },
    { label: "Команда", href: "team" },
    { label: "Спектакли", href: "performances" },
    { label: "Достижения", href: "achievements" },
    { label: "О театре", href: "about" },
    { label: "Архив", href: "archive" },
];

export default function Navigation() {
    const { isOpen, onToggle } = useDisclosure();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    const toast = useToast();
    const navigate = useNavigate(); // Добавлен хук useNavigate
    const { user, isAuthenticated, login, register, verifyRegistration, resendCode, logout } = useAuth();

    const handleLoginClick = () => {
        setAuthMode("login");
        setIsAuthModalOpen(true);
    };

    const handleRegisterClick = () => {
        setAuthMode("register");
        setIsAuthModalOpen(true);
    };

    const extractError = (error: any, fallback: string) => {
        const data = error?.response?.data;
        if (data && typeof data === "object") {
            if (typeof data.error === "string") return data.error;
            const firstField = Object.values(data)[0];
            if (Array.isArray(firstField) && firstField.length) return String(firstField[0]);
        }
        return fallback;
    };

    const handleRegister = async (email: string, password: string, phone: string) => {
        try {
            const success = await register(email, password, phone);
            if (success) {
                toast({
                    title: "Код отправлен",
                    description: "Проверьте почту и введите код подтверждения.",
                    status: "info",
                    duration: 4000,
                    isClosable: true,
                    position: "top"
                });
            }
            return success;
        } catch (error: any) {
            toast({
                title: "Ошибка регистрации",
                description: extractError(error, "Не удалось зарегистрироваться"),
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top"
            });
            return false;
        }
    };

    const handleVerify = async (email: string, code: string) => {
        try {
            return await verifyRegistration(email, code);
        } catch (error: any) {
            toast({
                title: "Ошибка подтверждения",
                description: extractError(error, "Неверный код"),
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top"
            });
            return false;
        }
    };

    const handleResend = async (email: string) => {
        try {
            return await resendCode(email);
        } catch (error: any) {
            toast({
                title: "Не удалось отправить код",
                description: extractError(error, "Попробуйте позже"),
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top"
            });
            return false;
        }
    };

    const handleLogin = async (emailOrPhone: string, password: string) => {
        const success = await login(emailOrPhone, password);
        if (success) {
            toast({
                title: "Вход выполнен!",
                description: "Добро пожаловать!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            setIsAuthModalOpen(false);
        } else {
            toast({
                title: "Ошибка входа",
                description: "Неверные данные для входа",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
        }
        return success;
    };

    const handleLogout = async () => {
        await logout();
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
                    <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
                        <Text
                            fontSize={{ base: "xl", md: "2xl" }}
                            fontWeight="bold"
                            color={lightText}
                            letterSpacing="widest"
                            whiteSpace="nowrap"
                            title="Норильский народный театр"
                        >
                            ННТ
                        </Text>
                    </Link>
                </Box>

                <Flex display={{ base: "none", md: "flex" }} align="center" gap={6}>
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.label}
                            as={RouterLink}
                            to={`/${item.href}`}
                            color={lightText}
                            fontWeight={500}
                            _hover={{ textDecoration: "none", color: primaryColor, transform: "translateY(-2px)" }}
                            transition="all 0.3s"
                        >
                            {item.label}
                        </Link>
                    ))}

                    {!isAuthenticated ? (
                        <Flex gap={3} align="center">
                            <Button
                                variant="outline"
                                color={lightText}
                                borderColor={primaryColor}
                                _hover={{ bg: primaryColor, transform: "translateY(-2px)" }}
                                onClick={handleLoginClick}
                            >
                                Войти
                            </Button>
                            <Button
                                variant="solid"
                                bg={primaryColor}
                                color="#0a0a0a"
                                _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
                                onClick={handleRegisterClick}
                            >
                                Регистрация
                            </Button>
                        </Flex>
                    ) : user?.is_superuser ? (
                        <Button
                            variant="solid"
                            bg={primaryColor}
                            color="#0a0a0a"
                            _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
                            onClick={() => navigate('/admin')}
                        >
                            Админ-панель
                        </Button>
                    ) : (
                        <Menu>
                            <MenuButton>
                                <Avatar
                                    size="sm"
                                    name={user?.email || "User"}
                                    bg={primaryColor}
                                    color="#0a0a0a"
                                    cursor="pointer"
                                />
                            </MenuButton>
                            <MenuList bg={darkBg} borderColor="#1a1a1a">
                                <MenuItem
                                    bg={darkBg}
                                    _hover={{ bg: "#1a1a1a" }}
                                    color={lightText}
                                    onClick={() => navigate(`/profile/${user.id}`)} // Добавлена навигация на страницу профиля
                                >
                                    Профиль
                                </MenuItem>
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
                <Box display={{ md: "none" }} bg="rgba(0, 0, 0, 0.95)" px={{ base: 2, sm: 4 }} py={2}>
                    <Stack as="nav" spacing={4}>
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.label}
                                as={RouterLink}
                                to={`/${item.href}`}
                                color={lightText}
                                py={2}
                                px={{ base: 3, sm: 4 }}
                                bg="rgba(255, 255, 255, 0.1)"
                                borderRadius="md"
                                fontWeight={500}
                                _hover={{ transform: "translateX(10px)", bg: "rgba(255, 255, 255, 0.25)" }}
                                transition="all 0.2s"
                                display="block"
                            >
                                {item.label}
                            </Link>
                        ))}

                        {!isAuthenticated && (
                            <>
                                <Button
                                    variant="outline"
                                    color={lightText}
                                    borderColor={primaryColor}
                                    _hover={{ bg: primaryColor }}
                                    onClick={handleLoginClick}
                                    mt={2}
                                    w="full"
                                >
                                    Войти
                                </Button>
                                <Button
                                    variant="solid"
                                    bg={primaryColor}
                                    color="#0a0a0a"
                                    _hover={{ opacity: 0.9 }}
                                    onClick={handleRegisterClick}
                                    w="full"
                                >
                                    Регистрация
                                </Button>
                            </>
                        )}

                        {isAuthenticated && !user?.is_superuser && (
                            <Button
                                variant="solid"
                                bg={primaryColor}
                                color="#0a0a0a"
                                _hover={{ opacity: 0.9 }}
                                onClick={() => navigate(`/profile/${user?.id}`)}
                                mt={2}
                                w="full"
                            >
                                Профиль
                            </Button>
                        )}

                        {isAuthenticated && user?.is_superuser && (
                            <Button
                                variant="solid"
                                bg={primaryColor}
                                color="#0a0a0a"
                                _hover={{ opacity: 0.9 }}
                                onClick={() => navigate('/admin')}
                                mt={2}
                                w="full"
                            >
                                Админ-панель
                            </Button>
                        )}
                    </Stack>
                </Box>
            </Collapse>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => {
                    setIsAuthModalOpen(false);
                }}
                mode={authMode}
                switchToLogin={() => setAuthMode("login")}
                switchToRegister={() => setAuthMode("register")}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onVerify={handleVerify}
                onResend={handleResend}
            />
        </Box>
    );
}