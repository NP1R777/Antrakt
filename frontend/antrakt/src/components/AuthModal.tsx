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
import { useState, useEffect } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);

type AuthMode = "login" | "register";
type RegisterStep = "credentials" | "code";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: AuthMode;
    switchToLogin: () => void;
    switchToRegister: () => void;
    onLogin: (emailOrPhone: string, password: string) => Promise<boolean>;
    onRegister: (email: string, password: string, phone: string) => Promise<boolean>;
    onVerify: (email: string, code: string) => Promise<boolean>;
    onResend: (email: string) => Promise<boolean>;
}

const RESEND_COOLDOWN = 30;

export default function AuthModal({
    isOpen,
    onClose,
    mode,
    switchToLogin,
    switchToRegister,
    onLogin,
    onRegister,
    onVerify,
    onResend,
}: AuthModalProps) {
    const toast = useToast();
    const isRegister = mode === "register";

    const [step, setStep] = useState<RegisterStep>("credentials");
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [errors, setErrors] = useState({ emailOrPhone: "", email: "", password: "" });

    // Обратный отсчёт для повторной отправки кода
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    // Сброс шага при смене режима
    useEffect(() => {
        setStep("credentials");
        setCode("");
    }, [mode]);

    const isEmail = (value: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
    const isPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, "");
        return cleaned.length === 11 && cleaned.startsWith("7");
    };

    const validateEmailOrPhone = (value: string) => {
        if (!value) return "Email или телефон обязателен";
        if (!isEmail(value) && !isPhoneNumber(value.replace(/^\+/, ""))) return "Введите корректный email или телефон";
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

    const resetAll = () => {
        setStep("credentials");
        setEmailOrPhone(""); setEmail(""); setPhone(""); setPassword(""); setCode("");
        setErrors({ emailOrPhone: "", email: "", password: "" });
    };

    const handleClose = () => {
        resetAll();
        onClose();
    };

    // Шаг входа / шаг 1 регистрации (данные)
    const handleSubmitCredentials = async () => {
        const passwordError = validatePassword(password);
        const identifierError = isRegister ? validateEmail(email) : validateEmailOrPhone(emailOrPhone);
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
            if (isRegister) {
                const ok = await onRegister(email, password, phone);
                if (ok) {
                    setStep("code");
                    setCooldown(RESEND_COOLDOWN);
                }
            } else {
                const ok = await onLogin(emailOrPhone, password);
                if (ok) handleClose();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Шаг 2 регистрации: подтверждение кода → авто-логин
    const handleVerify = async () => {
        if (!code.trim()) return;
        setIsSubmitting(true);
        try {
            const ok = await onVerify(email, code.trim());
            if (ok) {
                const logged = await onLogin(email, password);
                if (logged) handleClose();
                else switchToLogin();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        const ok = await onResend(email);
        if (ok) {
            setCooldown(RESEND_COOLDOWN);
            toast({ title: "Код отправлен повторно", status: "info", duration: 2500, isClosable: true, position: "top" });
        }
    };

    const inputStyles = {
        bg: "#1a1a1a", borderColor: "#333", color: "white",
        _placeholder: { color: "#555" },
        _focus: { borderColor: "#800020", boxShadow: "0 0 0 1px #800020" },
        _hover: { borderColor: "#444" },
    };

    const heading = isRegister
        ? (step === "code" ? "Подтверждение почты" : "Регистрация")
        : "Вход в аккаунт";

    return (
        <Modal isOpen={isOpen} onClose={handleClose} isCentered size={{ base: "sm", md: "lg" }}
            motionPreset="scale" closeOnOverlayClick={!isSubmitting}>
            <ModalOverlay bg="rgba(0, 0, 0, 0.8)" backdropFilter="blur(5px)" />
            <ModalContent bg="#0a0a0a" border="1px solid" borderColor="#800020" borderRadius="xl" overflow="hidden" position="relative">
                <ModalCloseButton color="white" _hover={{ color: "#800020", bg: "rgba(255,255,255,0.1)" }}
                    size="lg" zIndex={10} top={3} right={3} isDisabled={isSubmitting} />

                <Box p={{ base: 4, md: 8 }}>
                    <AnimatePresence mode="wait">
                        <MotionBox key={`${mode}-${step}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                            <Heading as="h3" fontSize={{ base: "xl", md: "2xl" }} color="white" mb={6}
                                textAlign="center" fontFamily="Playfair Display, serif">
                                {heading}
                            </Heading>

                            {isRegister && step === "code" ? (
                                <Flex direction="column" gap={5}>
                                    <Text color="gray.300" textAlign="center" fontSize="sm">
                                        Мы отправили 6-значный код на <b>{email}</b>. Введите его для завершения регистрации.
                                    </Text>
                                    <FormControl>
                                        <FormLabel color="white">Код из письма</FormLabel>
                                        <Input
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            placeholder="______"
                                            inputMode="numeric"
                                            textAlign="center"
                                            letterSpacing="0.5em"
                                            fontSize="xl"
                                            {...inputStyles}
                                        />
                                    </FormControl>
                                    <Button bg="#800020" color="white" _hover={{ bg: "#600018" }}
                                        isLoading={isSubmitting} loadingText="Проверка..."
                                        onClick={handleVerify} size={{ base: "md", md: "lg" }} fontWeight="bold"
                                        isDisabled={code.length !== 6}>
                                        Подтвердить и войти
                                    </Button>
                                    <Flex justify="space-between" align="center">
                                        <Link color="#888" fontSize="sm" onClick={() => setStep("credentials")}>
                                            ← Изменить данные
                                        </Link>
                                        <Link color={cooldown > 0 ? "#555" : "#FFD700"} fontSize="sm"
                                            onClick={handleResend} pointerEvents={cooldown > 0 ? "none" : "auto"}>
                                            {cooldown > 0 ? `Отправить повторно (${cooldown})` : "Отправить код повторно"}
                                        </Link>
                                    </Flex>
                                </Flex>
                            ) : (
                                <Flex direction="column" gap={5}>
                                    {isRegister ? (
                                        <>
                                            <FormControl isInvalid={!!errors.email}>
                                                <FormLabel color="white">Email</FormLabel>
                                                <Input type="email" value={email}
                                                    onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: validateEmail(e.target.value) }); }}
                                                    placeholder="email@domain.com" {...inputStyles} />
                                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel color="white">Телефон (необязательно)</FormLabel>
                                                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="+7 (XXX) XXX-XX-XX" {...inputStyles} />
                                            </FormControl>
                                        </>
                                    ) : (
                                        <FormControl isInvalid={!!errors.emailOrPhone}>
                                            <FormLabel color="white">Email или телефон</FormLabel>
                                            <Input type="text" value={emailOrPhone}
                                                onChange={(e) => { setEmailOrPhone(e.target.value); setErrors({ ...errors, emailOrPhone: validateEmailOrPhone(e.target.value) }); }}
                                                placeholder="email@domain.com" {...inputStyles} />
                                            <FormErrorMessage>{errors.emailOrPhone}</FormErrorMessage>
                                        </FormControl>
                                    )}

                                    <FormControl isInvalid={!!errors.password}>
                                        <FormLabel color="white">Пароль</FormLabel>
                                        <InputGroup>
                                            <Input type={isPasswordVisible ? "text" : "password"} value={password}
                                                onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: validatePassword(e.target.value) }); }}
                                                placeholder="••••••••" {...inputStyles} />
                                            <InputRightElement height="full">
                                                <IconButton aria-label={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
                                                    icon={isPasswordVisible ? <ViewOffIcon /> : <ViewIcon />} variant="ghost" size="sm"
                                                    color="white" _hover={{ bg: "rgba(255,255,255,0.08)", color: "#FFD700" }}
                                                    onClick={() => setIsPasswordVisible((v) => !v)} tabIndex={0} />
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                                    </FormControl>

                                    <Button mt={4} bg="#800020" color="white"
                                        _hover={{ bg: "#600018", transform: "translateY(-2px)", boxShadow: "0 4px 10px rgba(128, 0, 32, 0.3)" }}
                                        _active={{ bg: "#500014" }} isLoading={isSubmitting}
                                        loadingText={isRegister ? "Отправка кода..." : "Вход..."}
                                        onClick={handleSubmitCredentials} size={{ base: "md", md: "lg" }}
                                        fontSize={{ base: "sm", md: "md" }} fontWeight="bold" transition="all 0.3s" py={{ base: 4, md: 6 }}>
                                        {isRegister ? "Зарегистрироваться" : "Войти"}
                                    </Button>

                                    <Text color="#888" textAlign="center" fontSize="sm">
                                        {isRegister ? "Уже есть аккаунт? " : "Нет аккаунта? "}
                                        <Link color="#FFD700" fontWeight="bold"
                                            onClick={() => { setErrors({ emailOrPhone: "", email: "", password: "" }); isRegister ? switchToLogin() : switchToRegister(); }}>
                                            {isRegister ? "Войти" : "Зарегистрироваться"}
                                        </Link>
                                    </Text>
                                </Flex>
                            )}
                        </MotionBox>
                    </AnimatePresence>

                    <MotionBox position="absolute" bottom={0} left={0} w="100%" h="4px"
                        bg="linear-gradient(90deg, #800020, #FFD700, #800020)" initial={{ width: 0 }}
                        animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.1 }} />
                </Box>
            </ModalContent>
        </Modal>
    );
}
