import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    Box,
    Heading,
    Text,
    Link,
    Input,
    Button,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    useToast,
    InputGroup,
    InputRightElement,
    IconButton
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);

type AuthMode = "login" | "register";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: AuthMode;
    switchToLogin: () => void;
    switchToRegister: () => void;
    onLogin: (emailOrPhone: string, password: string) => Promise<boolean>;
    onRegister: (email: string, password: string, phone: string) => Promise<boolean>;
}

export default function AuthModal({
    isOpen,
    onClose,
    mode,
    switchToLogin,
    switchToRegister,
    onLogin,
    onRegister,
}: AuthModalProps) {
    const toast = useToast();
    const isRegister = mode === "register";

    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({
        emailOrPhone: "",
        email: "",
        password: "",
    });

    const isEmail = (value: string) => {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
    };

    const isPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, "");
        return cleaned.length === 11 && cleaned.startsWith('7');
    };

    const validateEmailOrPhone = (value: string) => {
        if (!value) return "Email или телефон обязателен";
        if (!isEmail(value) && !isPhoneNumber(value.replace(/^\+/, ''))) {
            return "Введите корректный email или телефон";
        }
        return "";
    };

    const validateEmail = (value: string) => {
        if (!value) return "Email обязателен для регистрации";
        if (!isEmail(value)) return "Введите корректный email";
        return "";
    };

    const validatePassword = (value: string) => {
        if (!value) return "Пароль обязателен";
        if (value.length < 8) return "Пароль должен быть не менее 8 символов";
        return "";
    };

    const resetFields = () => {
        setEmailOrPhone("");
        setEmail("");
        setPhone("");
        setPassword("");
        setErrors({ emailOrPhone: "", email: "", password: "" });
    };

    const handleSubmit = async () => {
        const passwordError = validatePassword(password);
        let identifierError = "";
        if (isRegister) {
            identifierError = validateEmail(email);
        } else {
            identifierError = validateEmailOrPhone(emailOrPhone);
        }

        if (identifierError || passwordError) {
            setErrors({
                emailOrPhone: isRegister ? "" : identifierError,
                email: isRegister ? identifierError : "",
                password: passwordError,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const success = isRegister
                ? await onRegister(email, password, phone)
                : await onLogin(emailOrPhone, password);
            if (success) {
                resetFields();
                if (isRegister) {
                    switchToLogin();
                } else {
                    onClose();
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
            size={{ base: "sm", md: "lg" }}
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

                <Box p={{ base: 4, md: 8 }}>
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
                                fontSize={{ base: "xl", md: "2xl" }}
                                color="white"
                                mb={6}
                                textAlign="center"
                                fontFamily="Playfair Display, serif"
                            >
                                {isRegister ? "Регистрация" : "Вход в аккаунт"}
                            </Heading>

                            <Flex direction="column" gap={5}>
                                {isRegister ? (
                                    <>
                                        <FormControl isInvalid={!!errors.email}>
                                            <FormLabel color="white">Email</FormLabel>
                                            <Input
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    setErrors({ ...errors, email: validateEmail(e.target.value) });
                                                }}
                                                placeholder="email@domain.com"
                                                bg="#1a1a1a"
                                                borderColor="#333"
                                                color="white"
                                                _placeholder={{ color: "#555" }}
                                                _focus={{ borderColor: "#800020", boxShadow: "0 0 0 1px #800020" }}
                                                _hover={{ borderColor: "#444" }}
                                            />
                                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel color="white">Телефон (необязательно)</FormLabel>
                                            <Input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+7 (XXX) XXX-XX-XX"
                                                bg="#1a1a1a"
                                                borderColor="#333"
                                                color="white"
                                                _placeholder={{ color: "#555" }}
                                                _focus={{ borderColor: "#800020", boxShadow: "0 0 0 1px #800020" }}
                                                _hover={{ borderColor: "#444" }}
                                            />
                                        </FormControl>
                                    </>
                                ) : (
                                    <FormControl isInvalid={!!errors.emailOrPhone}>
                                        <FormLabel color="white">Email или телефон</FormLabel>
                                        <Input
                                            type="text"
                                            value={emailOrPhone}
                                            onChange={(e) => {
                                                setEmailOrPhone(e.target.value);
                                                setErrors({ ...errors, emailOrPhone: validateEmailOrPhone(e.target.value) });
                                            }}
                                            placeholder="email@domain.com"
                                            bg="#1a1a1a"
                                            borderColor="#333"
                                            color="white"
                                            _placeholder={{ color: "#555" }}
                                            _focus={{ borderColor: "#800020", boxShadow: "0 0 0 1px #800020" }}
                                            _hover={{ borderColor: "#444" }}
                                        />
                                        <FormErrorMessage>{errors.emailOrPhone}</FormErrorMessage>
                                    </FormControl>
                                )}

                                <FormControl isInvalid={!!errors.password}>
                                    <FormLabel color="white">Пароль</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={isPasswordVisible ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setErrors({ ...errors, password: validatePassword(e.target.value) });
                                            }}
                                            placeholder="••••••••"
                                            bg="#1a1a1a"
                                            borderColor="#333"
                                            color="white"
                                            _placeholder={{ color: "#555" }}
                                            _focus={{ borderColor: "#800020", boxShadow: "0 0 0 1px #800020" }}
                                            _hover={{ borderColor: "#444" }}
                                        />
                                        <InputRightElement height="full">
                                            <IconButton
                                                aria-label={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
                                                icon={isPasswordVisible ? <ViewOffIcon /> : <ViewIcon />}
                                                variant="ghost"
                                                size="sm"
                                                color="white"
                                                _hover={{ bg: "rgba(255,255,255,0.08)", color: "#FFD700" }}
                                                onClick={() => setIsPasswordVisible((v) => !v)}
                                                tabIndex={0}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                                </FormControl>

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
                                    loadingText={isRegister ? "Регистрация..." : "Вход..."}
                                    onClick={handleSubmit}
                                    size={{ base: "md", md: "lg" }}
                                    fontSize={{ base: "sm", md: "md" }}
                                    fontWeight="bold"
                                    transition="all 0.3s"
                                    py={{ base: 4, md: 6 }}
                                >
                                    {isRegister ? "Зарегистрироваться" : "Войти"}
                                </Button>

                                <Text color="#888" textAlign="center" fontSize="sm">
                                    {isRegister ? "Уже есть аккаунт? " : "Нет аккаунта? "}
                                    <Link
                                        color="#FFD700"
                                        fontWeight="bold"
                                        onClick={() => {
                                            setErrors({ emailOrPhone: "", email: "", password: "" });
                                            isRegister ? switchToLogin() : switchToRegister();
                                        }}
                                    >
                                        {isRegister ? "Войти" : "Зарегистрироваться"}
                                    </Link>
                                </Text>
                            </Flex>
                        </MotionBox>
                    </AnimatePresence>

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
                </Box>
            </ModalContent>
        </Modal>
    );
}
