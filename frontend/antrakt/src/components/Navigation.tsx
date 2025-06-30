import {
    Box,
    Flex,
    Text,
    Link,
    IconButton,
    useDisclosure,
    Stack,
    Collapse,
    useColorModeValue
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

const NAV_ITEMS = [
    { label: "Главная", href: "#" },
    { label: "О студии", href: "#about" },
    { label: "Наша команда", href: "#team" },
    { label: "Спектакли", href: "#performances" },
    { label: "Расписание", href: "#schedule" },
    { label: "Галерея", href: "#gallery" },
    { label: "Контакты", href: "#contacts" },
];

export default function Navigation() {
    const { isOpen, onToggle } = useDisclosure();
    const hoverColor = useColorModeValue("brand.700", "brand.300");

    return (
        <Box
            as="nav"
            position="sticky"
            top={0}
            zIndex="modal"
            bg="rgba(0, 0, 0, 0.8)"
            backdropFilter="blur(10px)"
            borderBottom="1px solid"
            borderColor="brand.700"
        >
            <Flex
                maxW="container.xl"
                mx="auto"
                align="center"
                justify="space-between"
                px={{ base: 4, md: 8 }}
                py={4}
            >
                {/* Логотип */}
                <Box>
                    <Link href="#" _hover={{ textDecoration: "none" }}>
                        <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color="white"
                            letterSpacing="wide"
                        >
                            ТЕАТР СТУДИЯ <Text as="span" color="brand.500">АНТРАКТ</Text>
                        </Text>
                    </Link>
                </Box>

                {/* Десктопное меню */}
                <Flex
                    display={{ base: "none", md: "flex" }}
                    align="center"
                    gap={8}
                >
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            color="white"
                            fontWeight={500}
                            position="relative"
                            _hover={{
                                textDecoration: "none",
                                color: hoverColor,
                                transform: "scale(1.05)"
                            }}
                            _active={{ transform: "scale(0.95)" }}
                            transition="all 0.2s"
                        >
                            {item.label}
                            <Box
                                as="span"
                                position="absolute"
                                bottom="-5px"
                                left="0"
                                w="0%"
                                h="2px"
                                bg="brand.500"
                                transition="width 0.3s ease"
                                _hover={{ width: "100%" }}
                            />
                        </Link>
                    ))}
                </Flex>

                {/* Мобильное меню - кнопка */}
                <IconButton
                    display={{ base: "flex", md: "none" }}
                    onClick={onToggle}
                    icon={isOpen ? <CloseIcon w={4} h={4} /> : <HamburgerIcon w={6} h={6} />}
                    variant="ghost"
                    aria-label="Toggle Navigation"
                    color="white"
                    _hover={{ bg: "brand.700" }}
                />
            </Flex>

            {/* Мобильное меню - раскрывающийся контент */}
            <Collapse in={isOpen} animateOpacity>
                <Box
                    display={{ md: "none" }}
                    bg="rgba(0, 0, 0, 0.95)"
                    px={4}
                    py={2}
                >
                    <Stack as="nav" spacing={4}>
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                color="white"
                                py={2}
                                px={4}
                                bg="rgba(90, 0, 23, 0.3)"
                                borderRadius="md"
                                fontWeight={500}
                                _hover={{
                                    transform: "translateX(10px)",
                                    bg: "rgba(128, 0, 32, 0.5)"
                                }}
                                _active={{ transform: "scale(0.95)" }}
                                transition="all 0.2s"
                                display="block"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </Stack>
                </Box>
            </Collapse>
        </Box>
    );
}