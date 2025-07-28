import React from 'react';
import {
    Box,
    Flex,
    VStack,
    HStack,
    Heading,
    Text,
    Button,
    Avatar,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    IconButton,
    chakra,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    FaTheaterMasks,
    FaUsers,
    FaNewspaper,
    FaTrophy,
    FaEye,
    FaChartLine,
    FaBars,
    FaSignOutAlt,
    FaHome,
    FaArchive,
    FaUser
} from 'react-icons/fa';

import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// wrap each react-icon in chakra() with a cast to any to satisfy TS
const CFaTheaterMasks = chakra(FaTheaterMasks as any);
const CFaUsers = chakra(FaUsers as any);
const CFaNewspaper = chakra(FaNewspaper as any);
const CFaTrophy = chakra(FaTrophy as any);
const CFaEye = chakra(FaEye as any);
const CFaChartLine = chakra(FaChartLine as any);
const CFaArchive = chakra(FaArchive as any);
const CFaBars = chakra(FaBars as any);
const CFaSignOutAlt = chakra(FaSignOutAlt as any);
const CFaHome = chakra(FaHome as any);
const CFaUser = chakra(FaUser as any);

interface AdminLayoutProps {
    children: React.ReactNode;
}

const primaryColor = "#800020";

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navigateToMain = () => {
        navigate('/');
    };

    const menuItems = [
        {
            label: 'Dashboard',
            icon: CFaChartLine,
            path: '/admin',
            active: location.pathname === '/admin'
        },
        {
            label: 'Спектакли',
            icon: CFaTheaterMasks,
            path: '/admin/performances',
            active: location.pathname.includes('/admin/performances')
        },
        {
            label: 'Актёры',
            icon: CFaUsers,
            path: '/admin/actors',
            active: location.pathname.includes('/admin/actors')
        },
        {
            label: 'Режиссёры',
            icon: CFaEye,
            path: '/admin/directors',
            active: location.pathname.includes('/admin/directors')
        },
        {
            label: 'Новости',
            icon: CFaNewspaper,
            path: '/admin/news',
            active: location.pathname.includes('/admin/news')
        },
        {
            label: 'Достижения',
            icon: CFaTrophy,
            path: '/admin/achievements',
            active: location.pathname.includes('/admin/achievements')
        },
        {
            label: 'Архив',
            icon: CFaArchive,
            path: '/admin/archive',
            active: location.pathname.includes('/admin/archive')
        },
        {
            label: 'Пользователи',
            icon: CFaUser,
            path: '/admin/users',
            active: location.pathname.includes('/admin/users/')
        }
    ];

    const SidebarContent = () => (
        <VStack spacing={0} align="stretch" h="full">
            {/* Логотип */}
            <MotionBox
                p={6}
                borderBottom="1px solid"
                borderColor="rgba(255, 255, 255, 0.1)"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <HStack spacing={3}>
                    <CFaTheaterMasks w={8} h={8} color={primaryColor} />
                    <VStack align="start" spacing={0}>
                        <Heading size="md" color="white" fontFamily="Playfair Display">
                            Антракт
                        </Heading>
                        <Text fontSize="xs" color="gray.400">
                            Админ‑панель
                        </Text>
                    </VStack>
                </HStack>
            </MotionBox>

            {/* Меню */}
            <VStack spacing={2} align="stretch" p={4} flex={1}>
                {menuItems.map((item) => (
                    <MotionBox
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        whileHover={{ x: 5 }}
                    >
                        <Button
                            leftIcon={<item.icon />}
                            variant="ghost"
                            justifyContent="flex-start"
                            w="full"
                            h="12"
                            color={item.active ? primaryColor : "white"}
                            bg={item.active ? `${primaryColor}20` : "transparent"}
                            borderLeft={item.active ? `3px solid ${primaryColor}` : "3px solid transparent"}
                            borderRadius="0 md md 0"
                            _hover={{
                                bg: `${primaryColor}30`,
                                color: primaryColor,
                                transform: "translateX(5px)"
                            }}
                            transition="all 0.3s"
                            onClick={() => {
                                navigate(item.path);
                                onClose(); // Закрываем мобильное меню при клике на пункт меню
                            }}
                        >
                            {item.label}
                        </Button>
                    </MotionBox>
                ))}
            </VStack>

            {/* Нижние кнопки */}
            <VStack spacing={2} p={4} borderTop="1px solid" borderColor="rgba(255,255,255,0.1)">
                <Button
                    leftIcon={<CFaHome />}
                    variant="ghost"
                    justifyContent="flex-start"
                    w="full"
                    color="white"
                    _hover={{ bg: "rgba(255,255,255,0.1)", color: primaryColor }}
                    onClick={() => {
                        navigateToMain();
                        onClose(); // Закрываем мобильное меню при переходе на главную
                    }}
                >
                    На главную
                </Button>
                <Button
                    leftIcon={<CFaSignOutAlt />}
                    variant="ghost"
                    justifyContent="flex-start"
                    w="full"
                    color="white"
                    _hover={{ bg: "rgba(255,0,0,0.2)", color: "red.300" }}
                    onClick={() => {
                        handleLogout();
                        onClose(); // Закрываем мобильное меню при выходе
                    }}
                >
                    Выйти
                </Button>
            </VStack>
        </VStack>
    );

    return (
        <Flex minH="100vh" bg="black">
            {/* Desktop Sidebar */}
            <MotionBox
                w="280px"
                bg="rgba(255,255,255,0.05)"
                borderRight="1px solid"
                borderColor="rgba(255,255,255,0.1)"
                backdropFilter="blur(10px)"
                display={{ base: "none", lg: "block" }}
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <SidebarContent />
            </MotionBox>

            {/* Mobile Drawer */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose} closeOnOverlayClick={true}>
                <DrawerOverlay onClick={onClose} />
                <DrawerContent bg="rgba(0,0,0,0.95)" backdropFilter="blur(10px)">
                    <DrawerCloseButton 
                        color="white" 
                        onClick={onClose}
                        _hover={{ bg: "rgba(255,255,255,0.1)" }}
                        size="lg"
                        zIndex={1400}
                        position="absolute"
                        top={4}
                        right={4}
                    />
                    <DrawerBody p={0}>
                        <SidebarContent />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Main Content */}
            <Flex direction="column" flex={1}>
                {/* Top Bar */}
                <MotionFlex
                    h="16"
                    bg="rgba(255,255,255,0.05)"
                    borderBottom="1px solid"
                    borderColor="rgba(255,255,255,0.1)"
                    backdropFilter="blur(10px)"
                    align="center"
                    justify="space-between"
                    px={6}
                    initial={{ y: -64 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <HStack spacing={4}>
                        <IconButton
                            aria-label="Open menu"
                            icon={<CFaBars />}
                            variant="ghost"
                            color="white"
                            display={{ base: "flex", lg: "none" }}
                            onClick={onOpen}
                        />
                        <Heading
                            size="md"
                            color="white"
                            fontFamily="Playfair Display"
                            display={{ base: "none", md: "block" }}
                        >
                            {menuItems.find(item => item.active)?.label || 'Dashboard'}
                        </Heading>
                    </HStack>

                    <HStack spacing={3}>
                        <Avatar size="sm" name={user?.email} bg={primaryColor} color="white" />
                        <VStack
                            spacing={0}
                            align="start"
                            display={{ base: "none", md: "flex" }}
                        >
                            <Text fontSize="sm" color="white" fontWeight="medium">
                                {user?.email}
                            </Text>
                            <Text fontSize="xs" color="gray.400">
                                Администратор
                            </Text>
                        </VStack>
                    </HStack>
                </MotionFlex>

                {/* Page Content */}
                <Box flex={1} overflow="auto">
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        h="full"
                    >
                        {children}
                    </MotionBox>
                </Box>
            </Flex>
        </Flex>
    );
};

export default AdminLayout;
