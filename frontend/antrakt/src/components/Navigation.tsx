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
    usePrefersReducedMotion,
    useToast
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate, Link as RouterLink } from "react-router-dom"; // Добавлен импорт Link as RouterLink
import AuthModal from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";
import { useAuthModal } from "../contexts/AuthModalContext";
import { useSiteContent } from "../contexts/SiteContentContext";

const primaryColor = "#f2f2f2";
const darkBg = "#0a0a0a";
const lightText = "#ffffff";
const MotionBox = motion(Box);

const NAV_ITEMS = [
    { label: "Афиша", href: "afisha" },
    { label: "Новости", href: "news" },
    { label: "Команда", href: "team" },
    { label: "Спектакли", href: "performances" },
    { label: "Достижения", href: "achievements" },
    { label: "О театре", href: "about" },
    { label: "Проекты", href: "projects" },
];

export default function Navigation() {
    const { isOpen, onToggle } = useDisclosure();
    const prefersReducedMotion = usePrefersReducedMotion();
    const {
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        closeAuthModal,
    } = useAuthModal();
    const toast = useToast();
    const navigate = useNavigate(); // Добавлен хук useNavigate
    const { user, isAuthenticated, login, register, verifyRegistration, resendCode, resetPassword, logout } = useAuth();
    const { getText } = useSiteContent();

    const handleLoginClick = () => {
        openAuthModal("login");
    };

    const handleRegisterClick = () => {
        openAuthModal("register");
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
            closeAuthModal();
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
                        <MotionBox
                            position="relative"
                            display="inline-block"
                            animate={prefersReducedMotion ? undefined : {
                                scale: [1, 1.035, 1],
                                filter: [
                                    "drop-shadow(0 0 4px rgba(255,255,255,0.25))",
                                    "drop-shadow(0 0 13px rgba(255,255,255,0.75))",
                                    "drop-shadow(0 0 4px rgba(255,255,255,0.25))",
                                ],
                            }}
                            transition={{
                                duration: 2.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            whileHover={{ scale: 1.08 }}
                        >
                            <Box
                                position="absolute"
                                inset="-8px"
                                borderRadius="lg"
                                bg="radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 72%)"
                                filter="blur(7px)"
                                pointerEvents="none"
                                aria-hidden="true"
                            />
                            <Text
                                position="relative"
                                zIndex={1}
                                fontSize={{ base: "xl", md: "2xl" }}
                                fontWeight="bold"
                                color={lightText}
                                letterSpacing="widest"
                                whiteSpace="nowrap"
                                title={getText('nav.brand_full', 'Норильский народный театр')}
                            >
                                {getText('nav.logo', 'ННТ')}
                            </Text>
                        </MotionBox>
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
                                    src={user?.profile_photo || undefined}
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
                onClose={closeAuthModal}
                mode={authMode}
                switchToLogin={() => setAuthMode("login")}
                switchToRegister={() => setAuthMode("register")}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onVerify={handleVerify}
                onResend={handleResend}
                onResetPassword={resetPassword}
            />
        </Box>
    );
}