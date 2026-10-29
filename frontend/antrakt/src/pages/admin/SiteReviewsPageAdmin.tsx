import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Link,
    VStack,
    HStack,
    Flex,
    Input,
    Textarea,
    Button,
    IconButton,
    Switch,
    Badge,
    useToast,
    Spinner,
    Divider,
    FormControl,
    FormLabel,
    SimpleGrid,
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaSave, FaSyncAlt } from 'react-icons/fa';
import { chakra } from '@chakra-ui/react';
import axios from 'axios';
import { API_URL } from '../../config';

const CFaPlus = chakra(FaPlus as any);
const CFaTrash = chakra(FaTrash as any);
const CFaSave = chakra(FaSave as any);
const CFaSync = chakra(FaSyncAlt as any);

const primaryColor = '#f2f2f2';
const API = `${API_URL}`;

interface SiteReview {
    id: number;
    author_name: string;
    role?: string;
    text: string;
    review_date?: string | null;
    source: string;
    pinned: boolean;
    hidden: boolean;
    position: number;
    excluded: boolean;
    source_url?: string;
}

interface ImportStatus {
    configured: boolean;
    error?: string;
    last_success_at?: string;
    interval_seconds: number;
    job?: { id: number; status: string; stage: string; error: string;
        attempts: number; stats: Record<string, number | boolean> } | null;
}

const formatTime = (value?: string) => value ? new Date(value).toLocaleString('ru-RU', { timeZone: 'Asia/Krasnoyarsk' }) : 'ещё не было';

const SiteReviewsPageAdmin: React.FC = () => {
    const [reviews, setReviews] = useState<SiteReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [parsing, setParsing] = useState(false);
    const [newReview, setNewReview] = useState({ author_name: '', review_date: '', text: '' });
    const toast = useToast();
    const [importStatus, setImportStatus] = useState<ImportStatus | null>(null);
    const [statusError, setStatusError] = useState('');
    const [dirtyIds, setDirtyIds] = useState<Set<number>>(new Set());
    const dirty = useRef(new Set<number>());
    const revisions = useRef(new Map<number, number>());
    const completedJob = useRef<number | null>(null);
    const [hasUpdates, setHasUpdates] = useState(false);
    const mounted = useRef(true);
    const active = importStatus?.job && ['pending', 'running'].includes(importStatus.job.status);

    const markClean = (id: number) => {
        dirty.current.delete(id);
        setDirtyIds(new Set(dirty.current));
    };

    const load = () => {
        if (dirty.current.size) {
            setHasUpdates(true);
            return;
        }
        setLoading(true);
        axios.get(`${API}/site-reviews-admin/`)
            .then(res => {
                // Не затирать поля, изменённые пока запрос был в сети.
                if (!mounted.current) return;
                if (dirty.current.size) { setHasUpdates(true); return; }
                setReviews(res.data || []);
                setHasUpdates(false);
            })
            .catch(() => toast({ title: 'Не удалось загрузить отзывы', status: 'error', duration: 3000, isClosable: true }))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        mounted.current = true;
        let cancelled = false;
        let timer: ReturnType<typeof setTimeout>;
        load();
        const poll = async () => {
            try {
                const response = await axios.get(`${API}/vk-reviews/parse/`);
                if (cancelled) return;
                setImportStatus(response.data);
                setStatusError('');
                const job = response.data.job;
                if (job && !['pending', 'running'].includes(job.status) && completedJob.current !== job.id) {
                    const previous = completedJob.current;
                    completedJob.current = job.id;
                    if (previous !== null) load();
                } else if (job && ['pending', 'running'].includes(job.status)) {
                    completedJob.current = -1;
                }
            } catch {
                if (!cancelled) setStatusError('Не удалось получить состояние импорта. Повторим автоматически.');
            } finally {
                if (!cancelled) timer = setTimeout(poll, 5000);
            }
        };
        poll();
        const beforeUnload = (event: BeforeUnloadEvent) => {
            if (dirty.current.size) { event.preventDefault(); event.returnValue = ''; }
        };
        window.addEventListener('beforeunload', beforeUnload);
        return () => { cancelled = true; mounted.current = false; clearTimeout(timer); window.removeEventListener('beforeunload', beforeUnload); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const patchLocal = (id: number, patch: Partial<SiteReview>) => {
        revisions.current.set(id, (revisions.current.get(id) || 0) + 1);
        dirty.current.add(id);
        setDirtyIds(new Set(dirty.current));
        setReviews(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
    };

    const save = async (r: SiteReview) => {
        const revision = revisions.current.get(r.id);
        try {
            await axios.put(`${API}/site-review${r.id}/`, {
                author_name: r.author_name,
                text: r.text,
                review_date: r.review_date || null,
                pinned: r.pinned,
                hidden: r.hidden,
                position: r.position,
                excluded: r.excluded,
            });
            if (revisions.current.get(r.id) === revision) markClean(r.id);
            toast({ title: 'Сохранено', status: 'success', duration: 1500, isClosable: true });
        } catch {
            toast({ title: 'Ошибка сохранения', status: 'error', duration: 2500, isClosable: true });
        }
    };

    const remove = async (id: number) => {
        try {
            await axios.delete(`${API}/site-review${id}/`);
            markClean(id);
            setReviews(prev => prev.map(r => r.id === id && r.source === 'vk' ? { ...r, excluded: true } : r).filter(r => r.id !== id || r.source === 'vk'));
            toast({ title: 'Удалено', status: 'success', duration: 1500, isClosable: true });
            load();
        } catch {
            toast({ title: 'Ошибка удаления', status: 'error', duration: 2500, isClosable: true });
        }
    };

    const addManual = async () => {
        if (!newReview.author_name.trim() || !newReview.text.trim()) {
            toast({ title: 'Заполните имя и текст', status: 'warning', duration: 2500, isClosable: true });
            return;
        }
        try {
            await axios.post(`${API}/site-reviews-admin/`, {
                author_name: newReview.author_name.trim(),
                text: newReview.text.trim(),
                review_date: newReview.review_date || null,
            });
            setNewReview({ author_name: '', review_date: '', text: '' });
            toast({ title: 'Отзыв добавлен', status: 'success', duration: 2000, isClosable: true });
            load();
        } catch {
            toast({ title: 'Ошибка при добавлении', status: 'error', duration: 2500, isClosable: true });
        }
    };

    const runParser = async () => {
        setParsing(true);
        try {
            const res = await axios.post(`${API}/vk-reviews/parse/`, {});
            completedJob.current = -1;
            setImportStatus(prev => ({ configured: true, interval_seconds: prev?.interval_seconds || 0, ...prev, job: res.data.job }));
            toast({ title: res.data.created ? 'Импорт поставлен в очередь' : 'Импорт уже запущен',
                status: 'info', duration: 3000, isClosable: true });
        } catch (e: any) {
            toast({
                title: 'Парсер не выполнен',
                description: e?.response?.data?.error || 'Ошибка запуска парсера',
                status: 'error', duration: 5000, isClosable: true,
            });
        } finally {
            setParsing(false);
        }
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="60vh">
                <Spinner size="xl" color={primaryColor} />
            </Flex>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4} mb={2}>
                <Box>
                    <Heading size="lg" color="white">Отзывы на главной</Heading>
                    <Text color="gray.400" fontSize="sm">
                        В секцию попадает до 6 отзывов: сначала закреплённые (📌), затем самые свежие.
                        Скрытые (🚫) не показываются. Отзывы подтягиваются из группы ВК и хранятся в базе.
                    </Text>
                </Box>
                <Button leftIcon={<CFaSync />} onClick={runParser} isLoading={parsing || !!active} isDisabled={!importStatus?.configured}
                    bg={primaryColor} color="#0a0a0a" _hover={{ bg: '#ffffff' }}>
                    Обновить из ВК
                </Button>
            </Flex>

            <Box role="status" mt={4} p={4} bg="#141414" borderRadius="md" color="gray.300">
                {statusError && <Text color="orange.300">{statusError}</Text>}
                {importStatus && <>
                    <Text>{importStatus.configured ? (importStatus.interval_seconds > 0 ? 'Автоматическое обновление VK настроено.' : 'Доступен импорт из VK.') : importStatus.error || 'VK не настроен.'}</Text>
                    <Text fontSize="sm">Последний успешный импорт: {formatTime(importStatus.last_success_at)}</Text>
                    {importStatus.configured && <Text fontSize="sm">{importStatus.interval_seconds > 0
                        ? `Интервал обновления: ${importStatus.interval_seconds >= 86400 ? `${Math.round(importStatus.interval_seconds / 86400)} дн.` : `${Math.max(1, Math.round(importStatus.interval_seconds / 3600))} ч.`}`
                        : 'Расписание отключено; доступен ручной запуск.'}</Text>}
                    {importStatus.job && <>
                        <Text mt={2}>{importStatus.job.stage}{active ? '…' : ''}</Text>
                        <Text fontSize="sm">Попыток: {importStatus.job.attempts}. Проверено постов: {Number(importStatus.job.stats.scanned || 0)}, новых отзывов: {Number(importStatus.job.stats.added || 0)}, обновлено: {Number(importStatus.job.stats.updated || 0)}, пропущено: {Number(importStatus.job.stats.skipped || 0)}</Text>
                        {importStatus.job.error && <Text color="orange.300">{importStatus.job.error}</Text>}
                    </>}
                </>}
            </Box>
            {hasUpdates && <Text mt={3} color="yellow.300">{dirtyIds.size ? 'Есть обновления списка. Сохраните изменения, затем обновите список.' : 'Есть обновления списка. Нажмите «Обновить список», чтобы увидеть их.'}</Text>}
            <Button mt={3} size="sm" onClick={load} isDisabled={dirtyIds.size > 0}>Обновить список</Button>

            <Divider my={6} borderColor="#2a2a2a" />

            {/* Ручное добавление */}
            <Box bg="#141414" borderRadius="xl" border="1px solid #2a2a2a" p={6} mb={8}>
                <Heading size="md" color={primaryColor} mb={4}>Добавить отзыв вручную</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                    <FormControl>
                        <FormLabel color="gray.300">Фамилия и имя</FormLabel>
                        <Input value={newReview.author_name}
                            onChange={(e) => setNewReview(p => ({ ...p, author_name: e.target.value }))}
                            bg="#0f0f0f" borderColor="#333333" _hover={{ borderColor: '#444444' }} focusBorderColor={primaryColor} />
                    </FormControl>
                    <FormControl>
                        <FormLabel color="gray.300">Дата отзыва</FormLabel>
                        <Input type="date" value={newReview.review_date}
                            onChange={(e) => setNewReview(p => ({ ...p, review_date: e.target.value }))}
                            bg="#0f0f0f" borderColor="#333333" _hover={{ borderColor: '#444444' }} focusBorderColor={primaryColor} />
                    </FormControl>
                </SimpleGrid>
                <FormControl mb={4}>
                    <FormLabel color="gray.300">Текст отзыва</FormLabel>
                    <Textarea value={newReview.text}
                        onChange={(e) => setNewReview(p => ({ ...p, text: e.target.value }))}
                        bg="#0f0f0f" borderColor="#333333" _hover={{ borderColor: '#444444' }} focusBorderColor={primaryColor} />
                </FormControl>
                <Button leftIcon={<CFaPlus />} onClick={addManual}
                    bg={primaryColor} color="#0a0a0a" _hover={{ bg: '#ffffff' }}>
                    Добавить
                </Button>
            </Box>

            {/* Все отзывы */}
            <Heading size="md" color="white" mb={4}>Все отзывы ({reviews.length})</Heading>
            <VStack align="stretch" spacing={4}>
                {reviews.length === 0 && <Text color="gray.500">Пока нет отзывов.</Text>}
                {reviews.map(r => (
                    <Box key={r.id} bg="#141414" borderRadius="lg" border="1px solid #2a2a2a" p={4}>
                        <Flex justify="space-between" align="center" mb={3} wrap="wrap" gap={2}>
                            <HStack>
                                <Badge bg={r.source === 'vk' ? '#2b5278' : '#2a2a2a'} color="white">
                                    {r.source === 'vk' ? 'ВК' : 'вручную'}
                                </Badge>
                                {dirtyIds.has(r.id) && <Badge colorScheme="yellow">Не сохранено</Badge>}
                                {r.excluded && <Badge colorScheme="red">Исключён</Badge>}
                                {r.pinned && <Badge colorScheme="green">📌 закреплён</Badge>}
                                {r.hidden && <Badge colorScheme="red">🚫 скрыт</Badge>}
                            </HStack>
                            <HStack>
                                <HStack><Text color="gray.400" fontSize="sm">Закрепить</Text>
                                    <Switch isChecked={r.pinned} onChange={(e) => patchLocal(r.id, { pinned: e.target.checked })} /></HStack>
                                <HStack><Text color="gray.400" fontSize="sm">Скрыть</Text>
                                    <Switch isChecked={r.hidden} onChange={(e) => patchLocal(r.id, { hidden: e.target.checked })} /></HStack>
                            </HStack>
                        </Flex>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mb={3}>
                            <Input value={r.author_name} onChange={(e) => patchLocal(r.id, { author_name: e.target.value })}
                                placeholder="Фамилия и имя"
                                bg="#0f0f0f" borderColor="#333333" _hover={{ borderColor: '#444444' }} focusBorderColor={primaryColor} />
                            <Input type="date" value={r.review_date || ''} onChange={(e) => patchLocal(r.id, { review_date: e.target.value })}
                                bg="#0f0f0f" borderColor="#333333" _hover={{ borderColor: '#444444' }} focusBorderColor={primaryColor} />
                        </SimpleGrid>
                        {r.pinned && <FormControl mb={3}>
                            <FormLabel color="gray.300">Порядок закрепления (меньше — выше)</FormLabel>
                            <Input type="number" value={r.position} onChange={e => patchLocal(r.id, { position: Number(e.target.value) || 0 })} color="white" />
                        </FormControl>}
                        {r.source_url && /^https:\/\/(?:m\.)?vk\.com\//.test(r.source_url) && <Link href={r.source_url} isExternal rel="noopener noreferrer" color="yellow.300" mb={3} display="inline-block">Оригинал в VK</Link>}
                        <Textarea value={r.text} onChange={(e) => patchLocal(r.id, { text: e.target.value })} mb={3}
                            bg="#0f0f0f" borderColor="#333333" _hover={{ borderColor: '#444444' }} focusBorderColor={primaryColor} />
                        <Flex justify="flex-end" gap={2}>
                            {r.excluded && <Button size="sm" onClick={() => patchLocal(r.id, { excluded: false })}>Восстановить</Button>}
                            <Button size="sm" leftIcon={<CFaSave />} onClick={() => save(r)}
                                bg={primaryColor} color="#0a0a0a" _hover={{ bg: '#ffffff' }}>Сохранить</Button>
                            <IconButton aria-label="Удалить" icon={<CFaTrash />} size="sm" colorScheme="red" onClick={() => remove(r.id)} />
                        </Flex>
                    </Box>
                ))}
            </VStack>
        </Container>
    );
};

export default SiteReviewsPageAdmin;
