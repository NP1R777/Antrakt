import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Heading,
    Text,
    Textarea,
    Button,
    Flex,
    HStack,
    VStack,
    Avatar,
    Divider,
    IconButton,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    useDisclosure,
    Tooltip,
    Badge,
    chakra,
} from '@chakra-ui/react';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API = 'http://localhost:8000';
const primaryColor = '#f2f2f2';

const CFaTrash = chakra(FaTrash as any);
const CFaExclamationTriangle = chakra(FaExclamationTriangle as any);

const REACTIONS: { key: string; emoji: string; label: string }[] = [
    { key: 'heart', emoji: '❤️', label: 'Сердце' },
    { key: 'like', emoji: '👍', label: 'Нравится' },
    { key: 'laugh', emoji: '😂', label: 'Смешно' },
    { key: 'wow', emoji: '😮', label: 'Вау' },
    { key: 'sad', emoji: '😢', label: 'Грустно' },
];

interface ReactionCount {
    reaction: string;
    count: number;
}

interface Review {
    id: number;
    author: number;
    author_name: string;
    author_photo: string | null;
    author_email: string | null;
    text: string;
    created_at: string;
    reactions: ReactionCount[];
    my_reactions: string[];
}

type ReviewTargetType = 'performance' | 'actor' | 'director' | 'archive' | 'news';

interface ReviewsSectionProps {
    type: ReviewTargetType;
    targetId: number;
}

const URL_PREFIX: Record<ReviewTargetType, string> = {
    performance: 'perfomance',
    actor: 'actor',
    director: 'director',
    archive: 'archive',
    news: 'news',
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ type, targetId }) => {
    const { user, isAuthenticated } = useAuth();
    const toast = useToast();
    const listUrl = `${API}/${URL_PREFIX[type]}${targetId}/reviews/`;

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { isOpen: isWarnOpen, onOpen: onWarnOpen, onClose: onWarnClose } = useDisclosure();
    const [warnTarget, setWarnTarget] = useState<Review | null>(null);
    const [warnMessage, setWarnMessage] = useState('');
    const [isWarning, setIsWarning] = useState(false);

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(listUrl);
            setReviews(res.data || []);
        } catch (err) {
            console.error('Ошибка загрузки отзывов:', err);
        } finally {
            setLoading(false);
        }
    }, [listUrl]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSubmit = async () => {
        if (!text.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await axios.post(listUrl, { text: text.trim() });
            setReviews(prev => [res.data, ...prev]);
            setText('');
            toast({ title: 'Отзыв опубликован', status: 'success', duration: 2000, isClosable: true });
        } catch (err) {
            toast({ title: 'Не удалось опубликовать отзыв', status: 'error', duration: 3000, isClosable: true });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReact = async (review: Review, reaction: string) => {
        if (!isAuthenticated) {
            toast({ title: 'Войдите, чтобы ставить реакции', status: 'info', duration: 2500, isClosable: true });
            return;
        }
        try {
            const res = await axios.post(`${API}/review${review.id}/react/`, { reaction });
            setReviews(prev => prev.map(r => (r.id === review.id ? res.data : r)));
        } catch (err: any) {
            const msg = err?.response?.data?.error || 'Не удалось поставить реакцию';
            toast({ title: msg, status: 'warning', duration: 3000, isClosable: true });
        }
    };

    const handleDelete = async (review: Review) => {
        try {
            await axios.delete(`${API}/review${review.id}/`);
            setReviews(prev => prev.filter(r => r.id !== review.id));
            toast({ title: 'Отзыв удалён', status: 'info', duration: 2000, isClosable: true });
        } catch (err) {
            toast({ title: 'Не удалось удалить отзыв', status: 'error', duration: 3000, isClosable: true });
        }
    };

    const openWarn = (review: Review) => {
        setWarnTarget(review);
        setWarnMessage('');
        onWarnOpen();
    };

    const sendWarn = async () => {
        if (!warnTarget || !warnMessage.trim()) return;
        setIsWarning(true);
        try {
            await axios.post(`${API}/review${warnTarget.id}/warn/`, { message: warnMessage.trim() });
            toast({ title: 'Предупреждение отправлено', status: 'success', duration: 2500, isClosable: true });
            onWarnClose();
        } catch (err: any) {
            const msg = err?.response?.data?.error || 'Не удалось отправить письмо';
            toast({ title: msg, status: 'error', duration: 3500, isClosable: true });
        } finally {
            setIsWarning(false);
        }
    };

    const countFor = (review: Review, key: string) =>
        review.reactions.find(r => r.reaction === key)?.count || 0;

    return (
        <Box mt={10}>
            <Heading as="h3" size="md" color="white" mb={4}>
                Отзывы
            </Heading>
            <Divider borderColor="rgba(255, 255, 255, 0.25)" mb={6} />

            {isAuthenticated ? (
                <Box mb={8} bg="rgba(30,30,30,0.6)" p={4} borderRadius="lg" border="1px solid" borderColor="rgba(255, 255, 255, 0.22)">
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Поделитесь впечатлением..."
                        bg="#1a1a1a"
                        color="white"
                        borderColor="#333"
                        _hover={{ borderColor: '#444' }}
                        _focus={{ borderColor: primaryColor }}
                        rows={3}
                        maxLength={2000}
                    />
                    <Flex justify="flex-end" mt={3}>
                        <Button
                            bg={primaryColor}
                            color="#0a0a0a"
                            _hover={{ bg: "#d9d9d9" }}
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                            isDisabled={!text.trim()}
                        >
                            Оставить отзыв
                        </Button>
                    </Flex>
                </Box>
            ) : (
                <Text color="gray.400" mb={6}>
                    Войдите в аккаунт, чтобы оставить отзыв.
                </Text>
            )}

            {loading ? (
                <Text color="gray.400">Загрузка отзывов...</Text>
            ) : reviews.length === 0 ? (
                <Text color="gray.500">Пока нет отзывов. Будьте первым!</Text>
            ) : (
                <VStack spacing={4} align="stretch">
                    {reviews.map((review) => {
                        const canModerate = user?.is_superuser || user?.id === review.author;
                        return (
                            <Box
                                key={review.id}
                                bg="rgba(30,30,30,0.5)"
                                p={4}
                                borderRadius="lg"
                                border="1px solid"
                                borderColor="rgba(255, 255, 255, 0.1)"
                            >
                                <Flex justify="space-between" align="flex-start">
                                    <HStack spacing={3} mb={2}>
                                        <Avatar size="sm" name={review.author_name} src={review.author_photo || undefined} bg={primaryColor} color="#0a0a0a" />
                                        <Box>
                                            <Text color="white" fontWeight="bold">{review.author_name}</Text>
                                            <Text color="gray.500" fontSize="xs">
                                                {new Date(review.created_at).toLocaleDateString('ru-RU')}
                                            </Text>
                                        </Box>
                                    </HStack>
                                    <HStack>
                                        {user?.is_superuser && review.author_email && (
                                            <Tooltip label={`Предупредить (${review.author_email})`} hasArrow>
                                                <IconButton
                                                    aria-label="Отправить предупреждение"
                                                    icon={<CFaExclamationTriangle />}
                                                    size="sm"
                                                    variant="ghost"
                                                    color="orange.300"
                                                    _hover={{ bg: 'rgba(255,165,0,0.15)' }}
                                                    onClick={() => openWarn(review)}
                                                />
                                            </Tooltip>
                                        )}
                                        {canModerate && (
                                            <Tooltip label="Удалить отзыв" hasArrow>
                                                <IconButton
                                                    aria-label="Удалить отзыв"
                                                    icon={<CFaTrash />}
                                                    size="sm"
                                                    variant="ghost"
                                                    color="red.300"
                                                    _hover={{ bg: 'rgba(255,0,0,0.15)' }}
                                                    onClick={() => handleDelete(review)}
                                                />
                                            </Tooltip>
                                        )}
                                    </HStack>
                                </Flex>

                                <Text color="gray.200" whiteSpace="pre-wrap" mb={3}>{review.text}</Text>

                                <HStack spacing={2} wrap="wrap">
                                    {REACTIONS.map(({ key, emoji, label }) => {
                                        const count = countFor(review, key);
                                        const mine = review.my_reactions.includes(key);
                                        return (
                                            <Tooltip key={key} label={label} hasArrow>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    borderColor={mine ? primaryColor : '#333'}
                                                    bg={mine ? 'rgba(255, 255, 255, 0.18)' : 'transparent'}
                                                    _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
                                                    onClick={() => handleReact(review, key)}
                                                    px={2}
                                                >
                                                    <Text as="span" fontSize="md" mr={count ? 1 : 0}>{emoji}</Text>
                                                    {count > 0 && (
                                                        <Badge bg="transparent" color="white" fontSize="xs">{count}</Badge>
                                                    )}
                                                </Button>
                                            </Tooltip>
                                        );
                                    })}
                                </HStack>
                            </Box>
                        );
                    })}
                </VStack>
            )}

            {/* Модалка предупреждения (для админа) */}
            <Modal isOpen={isWarnOpen} onClose={onWarnClose} isCentered>
                <ModalOverlay />
                <ModalContent bg="#1a1a1a" color="white" border="1px solid" borderColor="rgba(255, 255, 255, 0.2)">
                    <ModalHeader>Предупреждение пользователю</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontSize="sm" color="gray.400" mb={2}>
                            Письмо будет отправлено на: {warnTarget?.author_email}
                        </Text>
                        <Textarea
                            value={warnMessage}
                            onChange={(e) => setWarnMessage(e.target.value)}
                            placeholder="Текст предупреждающего письма..."
                            bg="#0f0f0f"
                            borderColor="#333"
                            rows={5}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" color="white" borderColor="#555" mr={3} onClick={onWarnClose}>
                            Отмена
                        </Button>
                        <Button
                            bg={primaryColor}
                            color="#0a0a0a"
                            _hover={{ bg: "#d9d9d9" }}
                            onClick={sendWarn}
                            isLoading={isWarning}
                            isDisabled={!warnMessage.trim()}
                        >
                            Отправить
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ReviewsSection;
