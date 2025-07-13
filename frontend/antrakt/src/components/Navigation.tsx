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
import AuthModal from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";

const primaryColor = "#800020";
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
    const [registeredEmail, setRegisteredEmail] = useState("");
    const toast = useToast();

    // Используем новый AuthContext
    const { user, isAuthenticated, login, register, logout } = useAuth();

    // Больше не нужно - управляется через AuthContext

    const handleLoginClick = () => {
        setAuthMode("login");
        setIsAuthModalOpen(true);
    };

    const handleRegisterClick = () => {
        setAuthMode("register");
        setIsAuthModalOpen(true);
    };

    const handleRegister = async (email: string, password: string, phone: string) => {
        const success = await register(email, password, phone);
        if (success) {
            setRegisteredEmail(email);
            toast({
                title: "Успешная регистрация!",
                description: "Теперь войдите в свой аккаунт.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            setAuthMode("login");
        } else {
            toast({
                title: "Ошибка регистрации",
                description: "Произошла ошибка при регистрации",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
        }
        return success;
    };

    const handleLogin = async (email: string, password: string) => {
        const success = await login(email, password);
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
                description: "Неверный email или пароль",
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
                    <Link href="/" _hover={{ textDecoration: "none" }}>
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
                                    name={user?.email || "User"}
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
                                {user?.is_superuser && (
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