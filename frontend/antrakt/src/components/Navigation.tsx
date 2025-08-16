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
    const toast = useToast();
    const navigate = useNavigate(); // Добавлен хук useNavigate
    const { user, isAuthenticated, login, logout } = useAuth();

    const handleLoginClick = () => {
        setIsAuthModalOpen(true);
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
                    <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
                        <Text fontSize="xl" fontWeight="bold" color={lightText} letterSpacing="wide">
                            ТЕАТР СТУДИЯ <Text as="span" color={primaryColor}>АНТРАКТ</Text>
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
                                <MenuItem
                                    bg={darkBg}
                                    _hover={{ bg: "#1a1a1a" }}
                                    color={lightText}
                                    onClick={() => navigate(`/profile/${user.id}`)} // Добавлена навигация на страницу профиля
                                >
                                    Профиль
                                </MenuItem>

                                {user?.is_superuser && (
                                    <MenuItem
                                        bg={darkBg}
                                        _hover={{ bg: "#1a1a1a" }}
                                        color={lightText}
                                        onClick={() => navigate('/admin')} // Заменено window.location.href на navigate для согласованности
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
                                as={RouterLink}
                                to={`/${item.href}`}
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
                }}
                onLogin={handleLogin}
            />
        </Box>
    );
}