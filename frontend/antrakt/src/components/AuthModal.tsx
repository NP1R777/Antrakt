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
import { useState } from "react";

const MotionBox = motion(Box);

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (emailOrPhone: string, password: string) => Promise<boolean>;
}

export default function AuthModal({
    isOpen,
    onClose,
    onLogin,
}: AuthModalProps) {
    const toast = useToast();
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        emailOrPhone: "",
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
            return "Введите корректный email или номер телефона";
        }
        return "";
    };

    const validatePassword = (value: string) => {
        if (!value) return "Пароль обязателен";
        if (value.length < 6) return "Пароль должен быть не менее 6 символов";
        return "";
    };

    const handleSubmit = async () => {
        const emailOrPhoneError = validateEmailOrPhone(emailOrPhone);
        const passwordError = validatePassword(password);

        if (emailOrPhoneError || passwordError) {
            setErrors({
                emailOrPhone: emailOrPhoneError,
                password: passwordError,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const success = await onLogin(emailOrPhone, password);
            if (success) {
                onClose();
                setEmailOrPhone("");
                setPassword("");
                setErrors({ emailOrPhone: "", password: "" });
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
                            key="login"
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
                                Вход в аккаунт
                            </Heading>

                            <Flex direction="column" gap={5}>
                                {/* Поле Email или телефон */}
                                <FormControl isInvalid={!!errors.emailOrPhone}>
                                    <FormLabel color="white">
                                        Email или телефон
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        value={emailOrPhone}
                                        onChange={(e) => {
                                            setEmailOrPhone(e.target.value);
                                            setErrors({ ...errors, emailOrPhone: validateEmailOrPhone(e.target.value) });
                                        }}
                                        placeholder={"email@domain.com или +7XXXXXXXXXX"}
                                        bg="#1a1a1a"
                                        borderColor="#333"
                                        color="white"
                                        _placeholder={{ color: "#555" }}
                                        _focus={{
                                            borderColor: "#800020",
                                            boxShadow: "0 0 0 1px #800020"
                                        }}
                                        _hover={{ borderColor: "#444" }}
                                        autoFocus={!!emailOrPhone}
                                    />
                                    <FormErrorMessage>{errors.emailOrPhone}</FormErrorMessage>
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
                                    loadingText={"Вход..."}
                                    onClick={handleSubmit}
                                    size="lg"
                                    fontSize="md"
                                    fontWeight="bold"
                                    transition="all 0.3s"
                                    py={6}
                                >
                                    Войти
                                </Button>
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