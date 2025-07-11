import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Grid,
    GridItem,
    Heading,
    Flex,
    Button,
    VStack,
    Badge,
    Container,
    chakra,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useToast,
    Spinner,
    Text,
    Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    FaUserPlus,
    FaTrash,
    FaEdit,
    FaUndo
} from 'react-icons/fa';
import axios from 'axios';
import { ActorForm } from './forms/ActorForm';

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);
const MotionButton = motion(Button);

const primaryColor = '#800020';
const secondaryColor = '#A00030';

const CFaUserPlus = chakra(FaUserPlus as any);
const CFaTrash = chakra(FaTrash as any);
const CFaEdit = chakra(FaEdit as any);
const CFaUndo = chakra(FaUndo as any);

interface Actor {
    id: number;
    name: string;
    place_of_work: string;
    time_in_theatre: number;
    favorite_writer: string[];
    favorite_character: string[];
    favorite_painter: string[];
    favorite_film: string[];
    favorite_piece: string[];
    favorite_quote: string;
    author_quote: string;
    favorite_song: string[];
    author_song: string[];
    perfomances: string[];
    role_in_perfomances: string[];
    image_url: string;
    deleted_at?: string | null;
}

const ActorsPage: React.FC = () => {
    const [actors, setActors] = useState<Actor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [currentActor, setCurrentActor] = useState<Actor | null>(null);
    const toast = useToast();

    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        fetchActors();
    }, []);

    const fetchActors = async () => {
        try {
            const response = await axios.get('http://localhost:8000/actors-admin/');
            setActors(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Ошибка при загрузке актёров:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить актёров',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    };

    const handleDeleteActor = async (id: number) => {
        if (!id) return;

        try {
            await axios.put(`http://localhost:8000/actor${id}/`, {
                deleted_at: new Date().toISOString()
            });
            toast({
                title: 'Успех!',
                description: 'Актёр удалён',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });

            setActors(prevActors =>
                prevActors.map(actor =>
                    actor.id === id
                        ? { ...actor, deleted_at: new Date().toISOString() }
                        : actor
                )
            );
        } catch (error) {
            console.error('Ошибка при удалении актёра:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось удалить актёра',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            onDeleteClose();
            setDeleteId(null);
        }
    };

    const handleRestoreActor = async (id: number) => {
        if (!id) return;

        try {
            await axios.put(`http://localhost:8000/actor${id}/`, {
                deleted_at: null
            });
            toast({
                title: 'Успех!',
                description: 'Актёр восстановлен',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });

            setActors(prevActors =>
                prevActors.map(actor =>
                    actor.id === id
                        ? { ...actor, deleted_at: null }
                        : actor
                )
            );
        } catch (error) {
            console.error('Ошибка при восстановлении актёра:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось восстановить актёра',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const openEditForm = (actor: Actor) => {
        setCurrentActor(actor);
        onFormOpen();
    };

    const openCreateForm = () => {
        setCurrentActor(null);
        onFormOpen();
    };

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        onDeleteOpen();
    };

    const getYearsText = (years: number) => {
        if (years % 10 === 1 && years % 100 !== 11) return `${years} год`;
        if ([2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100)) return `${years} года`;
        return `${years} лет`;
    };

    const renderActorCards = () => {
        if (isLoading) {
            return (
                <Flex justify="center" align="center" minH="200px">
                    <Spinner size="xl" color={primaryColor} />
                </Flex>
            );
        }

        if (actors.length === 0) {
            return (
                <Text textAlign="center" fontSize="lg" color="#AAAAAA">
                    Актёры не найдены
                </Text>
            );
        }

        return (
            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap={6}
                w="100%"
                maxW="100%"
                overflow="hidden"
            >
                {actors.map(actor => (
                    <MotionGridItem
                        key={actor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        w="100%"
                        position="relative"
                        zIndex={1}
                    >
                        <MotionBox
                            bg={actor.deleted_at ? "rgba(50,50,50,0.5)" : "rgba(255,255,255,0.05)"}
                            p={4}
                            borderRadius="xl"
                            border="1px solid"
                            borderColor={actor.deleted_at ? "#555" : "rgba(255,255,255,0.1)"}
                            backdropFilter="blur(10px)"
                            position="relative"
                            overflow="hidden"
                            whileHover={{
                                borderColor: actor.deleted_at ? "#666" : secondaryColor,
                                boxShadow: actor.deleted_at ? "none" : `0 0 20px ${secondaryColor}50`
                            }}
                            transition={{ duration: 0.3 }}
                            w="100%"
                            maxW="450px"
                            minW="300px"
                            mx="auto"
                            minH="250px"
                        >
                            {actor.deleted_at && (
                                <Badge
                                    position="absolute"
                                    top={2}
                                    right={2}
                                    colorScheme="red"
                                    zIndex={1}
                                >
                                    Удалено
                                </Badge>
                            )}

                            <Flex align="center" mb={4}>
                                <Box
                                    boxSize="90px"
                                    borderRadius="full"
                                    overflow="hidden"
                                    border={`2px solid ${primaryColor}`}
                                    flexShrink={0}
                                    bg="#222"
                                    opacity={actor.deleted_at ? 0.6 : 1}
                                >
                                    <img
                                        src={actor.image_url}
                                        alt={actor.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'top center'
                                        }}
                                    />
                                </Box>
                                <Box ml={4} maxW="calc(100% - 80px)">
                                    <Heading
                                        size="md"
                                        fontFamily="Playfair Display"
                                        noOfLines={1}
                                        color={actor.deleted_at ? "#999" : "white"}
                                    >
                                        {actor.name}
                                    </Heading>
                                    <Badge
                                        bg={secondaryColor}
                                        color="white"
                                        mt={1}
                                        px={3}
                                        py={1.5}
                                        fontSize="xs"
                                        borderRadius="md"
                                        whiteSpace="normal"
                                        wordBreak="break-word"
                                        maxW="100%"
                                        textShadow="0 1px 2px rgba(0, 0, 0, 0.3)"
                                        _hover={{ bg: '#B00040' }}
                                        noOfLines={2}
                                        opacity={actor.deleted_at ? 0.6 : 1}
                                    >
                                        {actor.place_of_work} • {getYearsText(actor.time_in_theatre)}
                                    </Badge>
                                </Box>
                            </Flex>

                            <Text
                                noOfLines={3}
                                fontSize="sm"
                                color={actor.deleted_at ? "#999" : "#CCCCCC"}
                                mb={4}
                                fontStyle="italic"
                                opacity={actor.deleted_at ? 0.6 : 1}
                            >
                                "{actor.favorite_quote}" — {actor.author_quote}
                            </Text>

                            <Flex justify="flex-end" gap={2}>
                                <Tooltip label="Редактировать" hasArrow>
                                    <MotionButton
                                        size="sm"
                                        iconSpacing={0}
                                        bg="transparent"
                                        color="#3182CE"
                                        onClick={() => openEditForm(actor)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        isDisabled={!!actor.deleted_at}
                                    >
                                        <CFaEdit />
                                    </MotionButton>
                                </Tooltip>

                                {actor.deleted_at ? (
                                    <Tooltip label="Восстановить" hasArrow>
                                        <MotionButton
                                            size="sm"
                                            iconSpacing={0}
                                            bg="transparent"
                                            color="#48BB78"
                                            onClick={() => handleRestoreActor(actor.id)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <CFaUndo />
                                        </MotionButton>
                                    </Tooltip>
                                ) : (
                                    <Tooltip label="Удалить" hasArrow>
                                        <MotionButton
                                            size="sm"
                                            iconSpacing={0}
                                            bg="transparent"
                                            color="#E53E3E"
                                            onClick={() => confirmDelete(actor.id)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <CFaTrash />
                                        </MotionButton>
                                    </Tooltip>
                                )}
                            </Flex>
                        </MotionBox>
                    </MotionGridItem>
                ))}
            </Grid>
        );
    };

    return (
        <Box minH="100vh" bg="black" color="white" py={8} overflow="hidden" position="relative" zIndex={0}>
            <Container maxW="container.lg" px={{ base: 4, md: 6 }} overflow="hidden" position="relative" zIndex={1}>
                <Flex justify="space-between" align="center" mb={8} flexWrap="wrap">
                    <VStack align="start" spacing={2} mb={{ base: 4, md: 0 }} maxW="100%">
                        <Heading fontSize="3xl" fontFamily="Playfair Display" textShadow={`0 0 15px ${primaryColor}50`}>
                            Управление актёрами
                        </Heading>
                        <Text color="#AAAAAA">
                            Здесь вы можете управлять данными актёров театральной студии "Антракт"
                        </Text>
                    </VStack>

                    <MotionButton
                        leftIcon={<CFaUserPlus />}
                        bg={primaryColor}
                        _hover={{ bg: '#900030' }}
                        onClick={openCreateForm}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        mb={{ base: 4, md: 0 }}
                    >
                        Добавить актёра
                    </MotionButton>
                </Flex>

                {renderActorCards()}
            </Container>

            {/* Модальное окно для создания/редактирования */}
            <Modal isOpen={isFormOpen} onClose={onFormClose} size="4xl" scrollBehavior="inside" isCentered>
                <ModalOverlay bg="blackAlpha.700" />
                <ModalContent bg="#222222" color="white">
                    <ModalHeader borderBottom="1px solid #333333" fontFamily="Playfair Display">
                        {currentActor ? 'Редактировать актёра' : 'Добавить нового актёра'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6} overflowY="auto">
                        <ActorForm
                            initialData={currentActor || undefined}
                            onSuccess={() => {
                                fetchActors();
                                onFormClose();
                            }}
                            onCancel={onFormClose}
                        />
                    </ModalBody>
                    <ModalFooter borderTop="1px solid #333333" />
                </ModalContent>
            </Modal>

            {/* Диалог подтверждения удаления */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="#222222" color="white">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold" fontFamily="Playfair Display">
                            Удаление актёра
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Вы уверены, что хотите удалить этого актёра?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button
                                ref={cancelRef}
                                onClick={onDeleteClose}
                                borderColor="#555555"
                                _hover={{ bg: '#333333' }}
                            >
                                Отмена
                            </Button>
                            <Button
                                bg="#E53E3E"
                                _hover={{ bg: '#F56565' }}
                                onClick={() => deleteId && handleDeleteActor(deleteId)}
                                ml={3}
                            >
                                Удалить
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default ActorsPage;