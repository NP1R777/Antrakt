import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Flex,
    HStack,
    VStack,
    Badge,
    Button,
    IconButton,
    Tooltip,
    Spinner,
    useToast,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Textarea,
    chakra,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const API = 'http://localhost:8000';
const primaryColor = '#800020';

const MotionBox = motion(Box);
const CFaTrash = chakra(FaTrash as any);
const CFaExclamationTriangle = chakra(FaExclamationTriangle as any);

const REACTION_EMOJI: Record<string, string> = {
    heart: '❤️', like: '👍', laugh: '😂', wow: '😮', sad: '😢',
};

interface ReactionCount { reaction: string; count: number; }

interface AdminReview {
    id: number;
    author_name: string;
    author_email: string | null;
    subject_title: string | null;
    subject_type: 'performance' | 'actor';
    text: string;
    created_at: string;
    reactions: ReactionCount[];
}

const ReviewsPageAdmin: React.FC = () => {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [warnTarget, setWarnTarget] = useState<AdminReview | null>(null);
    const [warnMessage, setWarnMessage] = useState('');
    const [isWarning, setIsWarning] = useState(false);

    const fetchReviews = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${API}/reviews-admin/`);
            setReviews(res.data || []);
        } catch (err) {
            toast({ title: 'Не удалось загрузить отзывы', status: 'error', duration: 3000, isClosable: true });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => { fetchReviews(); }, [fetchReviews]);

    const handleDelete = async (review: AdminReview) => {
        try {
            await axios.delete(`${API}/review${review.id}/`);
            setReviews(prev => prev.filter(r => r.id !== review.id));
            toast({ title: 'Отзыв удалён', status: 'info', duration: 2000, isClosable: true });
        } catch (err) {
            toast({ title: 'Не удалось удалить отзыв', status: 'error', duration: 3000, isClosable: true });
        }
    };

    const openWarn = (review: AdminReview) => {
        setWarnTarget(review);
        setWarnMessage('');
        onOpen();
    };

    const sendWarn = async () => {
        if (!warnTarget || !warnMessage.trim()) return;
        setIsWarning(true);
        try {
            await axios.post(`${API}/review${warnTarget.id}/warn/`, { message: warnMessage.trim() });
            toast({ title: 'Предупреждение отправлено', status: 'success', duration: 2500, isClosable: true });
            onClose();
        } catch (err: any) {
            const msg = err?.response?.data?.error || 'Не удалось отправить письмо';
            toast({ title: msg, status: 'error', duration: 3500, isClosable: true });
        } finally {
            setIsWarning(false);
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Heading color="white" size="lg" mb={6}>Отзывы пользователей</Heading>

            {isLoading ? (
                <Flex justify="center" py={20}><Spinner size="xl" color={primaryColor} /></Flex>
            ) : reviews.length === 0 ? (
                <Text color="gray.400">Отзывов пока нет.</Text>
            ) : (
                <VStack spacing={4} align="stretch">
                    {reviews.map((review) => (
                        <MotionBox
                            key={review.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            bg="rgba(30,30,30,0.6)"
                            border="1px solid"
                            borderColor="rgba(128,0,32,0.5)"
                            borderRadius="lg"
                            p={4}
                        >
                            <Flex justify="space-between" align="flex-start" wrap="wrap" gap={2}>
                                <Box>
                                    <HStack mb={1} spacing={2}>
                                        <Badge colorScheme={review.subject_type === 'performance' ? 'purple' : 'teal'}>
                                            {review.subject_type === 'performance' ? 'Спектакль' : 'Актёр'}
                                        </Badge>
                                        <Text color="white" fontWeight="bold">{review.subject_title || '—'}</Text>
                                    </HStack>
                                    <Text color="gray.400" fontSize="sm">
                                        {review.author_name}
                                        {review.author_email ? ` · ${review.author_email}` : ''}
                                        {' · '}
                                        {new Date(review.created_at).toLocaleString('ru-RU')}
                                    </Text>
                                </Box>
                                <HStack>
                                    {review.author_email && (
                                        <Tooltip label="Отправить предупреждение" hasArrow>
                                            <IconButton
                                                aria-label="Предупредить"
                                                icon={<CFaExclamationTriangle />}
                                                size="sm"
                                                variant="ghost"
                                                color="orange.300"
                                                _hover={{ bg: 'rgba(255,165,0,0.15)' }}
                                                onClick={() => openWarn(review)}
                                            />
                                        </Tooltip>
                                    )}
                                    <Tooltip label="Удалить отзыв" hasArrow>
                                        <IconButton
                                            aria-label="Удалить"
                                            icon={<CFaTrash />}
                                            size="sm"
                                            variant="ghost"
                                            color="red.300"
                                            _hover={{ bg: 'rgba(255,0,0,0.15)' }}
                                            onClick={() => handleDelete(review)}
                                        />
                                    </Tooltip>
                                </HStack>
                            </Flex>

                            <Text color="gray.200" mt={3} whiteSpace="pre-wrap">{review.text}</Text>

                            {review.reactions.length > 0 && (
                                <HStack mt={3} spacing={3}>
                                    {review.reactions.map(r => (
                                        <Text key={r.reaction} color="gray.300" fontSize="sm">
                                            {REACTION_EMOJI[r.reaction] || r.reaction} {r.count}
                                        </Text>
                                    ))}
                                </HStack>
                            )}
                        </MotionBox>
                    ))}
                </VStack>
            )}

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg="#1a1a1a" color="white" border="1px solid" borderColor="rgba(128,0,32,0.6)">
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
                        <Button variant="outline" color="white" borderColor="#555" mr={3} onClick={onClose}>
                            Отмена
                        </Button>
                        <Button
                            bg={primaryColor}
                            color="white"
                            _hover={{ bg: '#600018' }}
                            onClick={sendWarn}
                            isLoading={isWarning}
                            isDisabled={!warnMessage.trim()}
                        >
                            Отправить
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default ReviewsPageAdmin;
