import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    Box,
    Heading,
    Text,
    Input,
    Button,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    useToast
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const MotionBox = motion(Box);

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "login" | "register";
    switchToRegister: () => void;
    switchToLogin: () => void;
    onRegister: (email: string, password: string, phone: string) => Promise<boolean>;
    onLogin: (email: string, password: string) => Promise<boolean>;
    registeredEmail?: string;
}

export default function AuthModal({
    isOpen,
    onClose,
    mode,
    switchToRegister,
    switchToLogin,
    onRegister,
    onLogin,
    registeredEmail = ""
}: AuthModalProps) {
    const toast = useToast();
    const [email, setEmail] = useState(registeredEmail);
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        phone: ""
    });

    // Обновляем email при изменении registeredEmail
    useEffect(() => {
        if (registeredEmail) {
            setEmail(registeredEmail);
        }
    }, [registeredEmail]);

    const validateEmail = (value: string) => {
        if (!value) return "Email обязателен";
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return "Некорректный email";
        }
        return "";
    };

    const validatePassword = (value: string) => {
        if (!value) return "Пароль обязателен";
        if (value.length < 6) return "Пароль должен быть не менее 6 символов";
        return "";
    };

    const formatPhone = (value: string) => {
        let cleaned = value.replace(/\D/g, "").substring(0, 11);
        let formatted = cleaned;
        if (cleaned.length > 1) {
            formatted = `+7 (${cleaned.substring(1, 4)}`;
        }
        if (cleaned.length >= 4) {
            formatted += `) ${cleaned.substring(4, 7)}`;
        }
        if (cleaned.length >= 7) {
            formatted += `-${cleaned.substring(7, 9)}`;
        }
        if (cleaned.length >= 9) {
            formatted += `-${cleaned.substring(9, 11)}`;
        }
        return formatted;
    };

    const validatePhone = (value: string) => {
        if (!value) return "Телефон обязателен";
        const cleaned = value.replace(/\D/g, "");
        if (cleaned.length !== 11) return "Некорректный номер телефона";
        return "";
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setPhone(formatted);
        setErrors({ ...errors, phone: validatePhone(formatted) });
    };

    const handleSubmit = async () => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const phoneError = mode === "register" ? validatePhone(phone) : "";

        if (emailError || passwordError || phoneError) {
            setErrors({
                email: emailError,
                password: passwordError,
                phone: phoneError
            });
            return;
        }

        setIsSubmitting(true);

        try {
            let success = false;
            if (mode === "register") {
                success = await onRegister(email, password, phone);
            } else {
                success = await onLogin(email, password);
            }

            if (success) {
                if (mode === 'register') {
                    setPassword("");
                    setPhone("");
                    setErrors({ email: "", password: "", phone: "" });
                    switchToLogin();
                } else {
                    onClose();
                    setEmail("");
                    setPassword("");
                    setPhone("");
                    setErrors({ email: "", password: "", phone: "" });
                }
            }
        } catch (error) {
            toast({
                title: "Ошибка",
                description: "Произошла ошибка. Попробуйте снова.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size="lg"
            motionPreset="scale"
            closeOnOverlayClick={!isSubmitting}
        >
            <ModalOverlay
                bg="rgba(0, 0, 0, 0.8)"
                backdropFilter="blur(5px)"
            />

            <ModalContent
                bg="#0a0a0a"
                border="1px solid"
                borderColor="#800020"
                borderRadius="xl"
                overflow="hidden"
                position="relative"
            >
                <ModalCloseButton
                    color="white"
                    _hover={{ color: "#800020", bg: "rgba(255,255,255,0.1)" }}
                    size="lg"
                    zIndex={10}
                    top={3}
                    right={3}
                    isDisabled={isSubmitting}
                />

                <Box p={{ base: 6, md: 8 }}>
                    <AnimatePresence mode="wait">
                        <MotionBox
                            key={mode}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <Heading
                                as="h3"
                                fontSize="2xl"
                                color="white"
                                mb={6}
                                textAlign="center"
                                fontFamily="Playfair Display, serif"
                            >
                                {mode === "register" ? "Регистрация" : "Вход в аккаунт"}
                            </Heading>

                            <Flex direction="column" gap={5}>
                                {/* Поле Email */}
                                <FormControl isInvalid={!!errors.email}>
                                    <FormLabel color="white">Email</FormLabel>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setErrors({ ...errors, email: validateEmail(e.target.value) });
                                        }}
                                        placeholder="your@email.com"
                                        bg="#1a1a1a"
                                        borderColor="#333"
                                        color="white"
                                        _placeholder={{ color: "#555" }}
                                        _focus={{
                                            borderColor: "#800020",
                                            boxShadow: "0 0 0 1px #800020"
                                        }}
                                        _hover={{ borderColor: "#444" }}
                                        autoFocus={mode === "login" && !!email}
                                    />
                                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                                </FormControl>

                                {/* Поле Пароль */}
                                <FormControl isInvalid={!!errors.password}>
                                    <FormLabel color="white">Пароль</FormLabel>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setErrors({ ...errors, password: validatePassword(e.target.value) });
                                        }}
                                        placeholder="••••••"
                                        bg="#1a1a1a"
                                        borderColor="#333"
                                        color="white"
                                        _placeholder={{ color: "#555" }}
                                        _focus={{
                                            borderColor: "#800020",
                                            boxShadow: "0 0 0 1px #800020"
                                        }}
                                        _hover={{ borderColor: "#444" }}
                                    />
                                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                                </FormControl>

                                {/* Поле Телефон (только для регистрации) */}
                                {mode === "register" && (
                                    <FormControl isInvalid={!!errors.phone}>
                                        <FormLabel color="white">Телефон</FormLabel>
                                        <Input
                                            type="tel"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            placeholder="+7 (999) 999-99-99"
                                            bg="#1a1a1a"
                                            borderColor="#333"
                                            color="white"
                                            _placeholder={{ color: "#555" }}
                                            _focus={{
                                                borderColor: "#800020",
                                                boxShadow: "0 0 0 1px #800020"
                                            }}
                                            _hover={{ borderColor: "#444" }}
                                        />
                                        <FormErrorMessage>{errors.phone}</FormErrorMessage>
                                    </FormControl>
                                )}

                                <Button
                                    mt={4}
                                    bg="#800020"
                                    color="white"
                                    _hover={{
                                        bg: "#600018",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 4px 10px rgba(128, 0, 32, 0.3)"
                                    }}
                                    _active={{ bg: "#500014" }}
                                    isLoading={isSubmitting}
                                    loadingText={mode === "register" ? "Регистрация..." : "Вход..."}
                                    onClick={handleSubmit}
                                    size="lg"
                                    fontSize="md"
                                    fontWeight="bold"
                                    transition="all 0.3s"
                                    py={6}
                                >
                                    {mode === "register" ? "Зарегистрироваться!" : "Войти"}
                                </Button>
                            </Flex>
                        </MotionBox>
                    </AnimatePresence>

                    <Flex justify="center" mt={4} wrap="wrap">
                        <Text color="#a0a0a0" textAlign="center">
                            {mode === "register"
                                ? "Уже зарегистрированы?"
                                : "Ещё нет аккаунта?"}
                        </Text>
                        <Button
                            variant="link"
                            color="#800020"
                            ml={2}
                            onClick={mode === "register" ? switchToLogin : switchToRegister}
                            _hover={{
                                textDecoration: "underline",
                                color: "#a00028"
                            }}
                            fontSize={{ base: "sm", md: "md" }}
                            whiteSpace="nowrap"
                            isDisabled={isSubmitting}
                        >
                            {mode === "register"
                                ? "Нажмите сюда, чтобы войти!"
                                : "Зарегистрироваться"}
                        </Button>
                    </Flex>
                </Box>

                {/* Анимационная полоса в стиле театрального занавеса */}
                <MotionBox
                    position="absolute"
                    bottom={0}
                    left={0}
                    w="100%"
                    h="4px"
                    bg="linear-gradient(90deg, #800020, #FFD700, #800020)"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                />
            </ModalContent>
        </Modal>
    );
}