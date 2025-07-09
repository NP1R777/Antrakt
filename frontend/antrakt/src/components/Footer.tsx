import { Box, Flex, Text, Link, Grid, GridItem, Heading, Icon, chakra } from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
    FaVk,
    FaTelegram,
    FaInstagram,
    FaYoutube,
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaClock
} from "react-icons/fa";

const MotionBox = motion(Box);
const MotionLink = motion(Link);

export default function Footer() {
    // Основные цвета проекта
    const primaryColor = "#800020"; // Бордовый
    const darkBg = "#0a0a0a";       // Темный фон
    const lightText = "#ffffff";    // Белый текст
    const grayText = "#a0a0a0";     // Серый текст

    // Контакты
    const director = "Дустимов Андрей Аидмазонович";
    const email = "ADustimov@mail.ru";
    const phone = "+7-913-161-00-34";
    const address = "г. Норильск, ул. Орджоникидзе, д. 15";
    const hours = "Пн-Сб: 10:00 - 22:00, Вс: 11:00 - 20:00";

    // Социальные сети
    const socialLinks = [
        { icon: FaVk, url: "https://vk.com/tsantrakt", label: "ВКонтакте" },
        { icon: FaTelegram, url: "https://t.me/tsantrakt", label: "Telegram" },
        { icon: FaInstagram, url: "https://instagram.com/tsantrakt", label: "Instagram" },
        { icon: FaYoutube, url: "https://youtube.com/tsantrakt", label: "YouTube" }
    ];

    // Навигация
    const navLinks = [
        { label: "Главная", url: "#" },
        { label: "О студии", url: "#about" },
        { label: "Спектакли", url: "#performances" },
        { label: "Расписание", url: "#schedule" },
        { label: "Галерея", url: "#gallery" },
        { label: "Новости", url: "#news" },
        { label: "Отзывы", url: "#testimonials" },
        { label: "Контакты", url: "#contacts" }
    ];

    return (
        <MotionBox
            as="footer"
            bg={darkBg}
            color={lightText}
            pt={16}
            pb={8}
            borderTop="1px solid"
            borderColor="#1a1a1a"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }}>
                <Grid
                    templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)"
                    }}
                    gap={10}
                    mb={12}
                >
                    {/* Колонка 1: Лого и описание */}
                    <GridItem>
                        <Flex direction="column" align={{ base: "center", md: "flex-start" }}>
                            <Heading
                                as="h3"
                                fontSize="2xl"
                                mb={4}
                                color={lightText}
                                position="relative"
                                _after={{
                                    content: '""',
                                    position: "absolute",
                                    bottom: "-5px",
                                    left: "0",
                                    width: "50px",
                                    height: "3px",
                                    bg: primaryColor,
                                    borderRadius: "full"
                                }}
                            >
                                ТЕАТР СТУДИЯ <Text as="span" color={primaryColor}>АНТРАКТ</Text>
                            </Heading>

                            <Text color={grayText} mb={6} textAlign={{ base: "center", md: "left" }}>
                                Профессиональная театральная студия, где каждый может раскрыть
                                свой творческий потенциал и найти свою сцену.
                            </Text>

                            {/* Социальные сети */}
                            <Flex gap={4}>
                                {socialLinks.map((social, index) => (
                                    <MotionLink
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        color={grayText}
                                        fontSize="xl"
                                        whileHover={{
                                            color: primaryColor,
                                            y: -5
                                        }}
                                        transition="all 0.2s"
                                    >
                                        <Icon as={social.icon as any} />
                                    </MotionLink>
                                ))}
                            </Flex>
                        </Flex>
                    </GridItem>

                    {/* Колонка 2: Контакты */}
                    <GridItem>
                        <Heading
                            as="h4"
                            fontSize="lg"
                            mb={6}
                            color={lightText}
                            position="relative"
                            pb={2}
                            _after={{
                                content: '""',
                                position: "absolute",
                                bottom: "0",
                                left: "0",
                                width: "40px",
                                height: "2px",
                                bg: primaryColor
                            }}
                        >
                            Контакты
                        </Heading>

                        {/* Руководитель */}
                        <Flex align="center" mb={4}>
                            <Box
                                w="8px"
                                h="8px"
                                bg={primaryColor}
                                borderRadius="full"
                                mr={3}
                            />
                            <Text color={grayText}>
                                Руководитель: <Text as="span" color={lightText}>{director}</Text>
                            </Text>
                        </Flex>

                        {/* Почта */}
                        <Flex align="center" mb={4}>
                            <Icon as={FaEnvelope} color={primaryColor} mr={3} />
                            <Link
                                href={`mailto:${email}`}
                                color={grayText}
                                _hover={{ color: primaryColor }}
                                transition="color 0.2s"
                            >
                                {email}
                            </Link>
                        </Flex>

                        {/* Телефон */}
                        <Flex align="center" mb={4}>
                            <Icon as={FaPhoneAlt} color={primaryColor} mr={3} />
                            <Link
                                href={`tel:${phone.replace(/\D/g, '')}`}
                                color={grayText}
                                _hover={{ color: primaryColor }}
                                transition="color 0.2s"
                            >
                                {phone}
                            </Link>
                        </Flex>

                        {/* Адрес */}
                        <Flex align="center" mb={4}>
                            <Icon as={FaMapMarkerAlt} color={primaryColor} mr={3} />
                            <Text color={grayText}>{address}</Text>
                        </Flex>

                        {/* Часы работы */}
                        <Flex align="center">
                            <Icon as={FaClock} color={primaryColor} mr={3} />
                            <Text color={grayText}>{hours}</Text>
                        </Flex>
                    </GridItem>

                    {/* Колонка 3: Навигация */}
                    <GridItem>
                        <Heading
                            as="h4"
                            fontSize="lg"
                            mb={6}
                            color={lightText}
                            position="relative"
                            pb={2}
                            _after={{
                                content: '""',
                                position: "absolute",
                                bottom: "0",
                                left: "0",
                                width: "40px",
                                height: "2px",
                                bg: primaryColor
                            }}
                        >
                            Навигация
                        </Heading>

                        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                            {navLinks.map((link, index) => (
                                <MotionLink
                                    key={index}
                                    href={link.url}
                                    color={grayText}
                                    fontSize="md"
                                    mb={2}
                                    whileHover={{
                                        color: primaryColor,
                                        x: 5
                                    }}
                                    transition="all 0.2s"
                                >
                                    {link.label}
                                </MotionLink>
                            ))}
                        </Grid>
                    </GridItem>

                    {/* Колонка 4: Подписка */}
                    <GridItem>
                        <Heading
                            as="h4"
                            fontSize="lg"
                            mb={6}
                            color={lightText}
                            position="relative"
                            pb={2}
                            _after={{
                                content: '""',
                                position: "absolute",
                                bottom: "0",
                                left: "0",
                                width: "40px",
                                height: "2px",
                                bg: primaryColor
                            }}
                        >
                            Подписаться
                        </Heading>

                        <Text color={grayText} mb={4}>
                            Узнавайте первыми о новых спектаклях, мастер-классах и акциях
                        </Text>

                        <chakra.form
                            display="flex"
                            flexDirection="column"
                            gap={3}
                        >
                            <chakra.input
                                type="email"
                                placeholder="Ваш email"
                                bg="#1a1a1a"
                                border="1px solid #333"
                                borderRadius="md"
                                p={3}
                                color={lightText}
                                _placeholder={{ color: "#555" }}
                                _focus={{
                                    outline: "none",
                                    borderColor: primaryColor,
                                    boxShadow: `0 0 0 1px ${primaryColor}`
                                }}
                                transition="all 0.2s"
                            />

                            <MotionBox
                                as="button"
                                type="submit"
                                bg={primaryColor}
                                color={lightText}
                                fontWeight="bold"
                                p={3}
                                borderRadius="md"
                                border="none"
                                cursor="pointer"
                                whileHover={{
                                    backgroundColor: "#600018",
                                    boxShadow: `0 5px 15px ${primaryColor}33`
                                }}
                                whileTap={{ scale: 0.98 }}
                                transition="all 0.2s"
                            >
                                Подписаться
                            </MotionBox>
                        </chakra.form>
                    </GridItem>
                </Grid>

                {/* Копирайт */}
                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="center"
                    borderTop="1px solid #1a1a1a"
                    pt={8}
                    gap={4}
                >
                    <Text color={grayText} fontSize="sm">
                        © {new Date().getFullYear()} Театральная студия "Антракт". Все права защищены.
                    </Text>

                    <Text color={grayText} fontSize="sm">
                        Разработано с ❤️ для театрального искусства
                    </Text>
                </Flex>
            </Box>
        </MotionBox>
    );
}