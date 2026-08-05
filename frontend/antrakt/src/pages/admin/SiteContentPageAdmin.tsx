import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Input,
    Textarea,
    Button,
    FormControl,
    FormLabel,
    useToast,
    Spinner,
    Divider,
    Flex,
    Badge,
    Image,
    HStack,
} from '@chakra-ui/react';
import axios from 'axios';
import Footer from '../../components/Footer';
import { SiteContentContext, useSiteContent, SiteContentItem } from '../../contexts/SiteContentContext';
import { API_URL, MEDIA_URL } from '../../config';
import ImageService from '../../services/ImageService';

const primaryColor = '#f2f2f2';

/** Общая фотография главной и «О театре» — ключ в MinIO строго такой. */
const SHARED_ABOUT_IMAGE_KEY = 'Общая.png';
const sharedAboutImageUrl = () => `${MEDIA_URL}/antrakt-images/${SHARED_ABOUT_IMAGE_KEY}`;

const SiteContentPageAdmin: React.FC = () => {
    const [items, setItems] = useState<SiteContentItem[]>([]);
    const [draft, setDraft] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingShared, setUploadingShared] = useState(false);
    const [sharedPreview, setSharedPreview] = useState(() => `${sharedAboutImageUrl()}?t=${Date.now()}`);
    const sharedFileRef = useRef<HTMLInputElement>(null);
    const toast = useToast();
    const { reload } = useSiteContent();

    const load = () => {
        setLoading(true);
        axios.get(`${API_URL}/site-content/`)
            .then(res => {
                const data: SiteContentItem[] = res.data || [];
                setItems(data);
                const d: Record<string, string> = {};
                data.forEach(i => { d[i.key] = i.value; });
                setDraft(d);
            })
            .catch(() => {
                toast({ title: 'Не удалось загрузить тексты', status: 'error', duration: 3000, isClosable: true });
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Группировка полей по разделам сайта
    const sections = useMemo(() => {
        const map: Record<string, SiteContentItem[]> = {};
        items.forEach(i => {
            const key = i.section || 'Прочее';
            (map[key] = map[key] || []).push(i);
        });
        return map;
    }, [items]);

    const handleChange = (key: string, value: string) => {
        setDraft(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put(`${API_URL}/site-content/`, {
                items: items.map(i => ({ key: i.key, value: draft[i.key] ?? '' })),
            });
            toast({ title: 'Тексты сайта сохранены', status: 'success', duration: 2500, isClosable: true });
            reload(); // обновляем контекст, чтобы весь сайт увидел изменения
        } catch (e) {
            toast({ title: 'Ошибка при сохранении', status: 'error', duration: 3000, isClosable: true });
        } finally {
            setSaving(false);
        }
    };

    const handleSharedPhotoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validation = ImageService.validateImageFile(file);
        if (!validation.isValid) {
            toast({
                title: 'Ошибка файла',
                description: validation.error,
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
            if (sharedFileRef.current) sharedFileRef.current.value = '';
            return;
        }

        setUploadingShared(true);
        try {
            // Всегда перезаписываем объект «Общая.png» — иначе главная и «О театре» не увидят фото.
            await ImageService.uploadImage(file, 'images', SHARED_ABOUT_IMAGE_KEY);
            setSharedPreview(`${sharedAboutImageUrl()}?t=${Date.now()}`);
            toast({
                title: 'Общая фотография обновлена',
                description: `Файл сохранён как «${SHARED_ABOUT_IMAGE_KEY}» и используется на главной и на странице «О театре».`,
                status: 'success',
                duration: 4000,
                isClosable: true,
            });
        } catch (e) {
            toast({
                title: 'Не удалось загрузить фотографию',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setUploadingShared(false);
            if (sharedFileRef.current) sharedFileRef.current.value = '';
        }
    };

    // Контекст с черновыми значениями — для «живого» предпросмотра футера.
    const draftCtx = {
        content: draft,
        getText: (k: string, f = '') => (draft[k] !== undefined && draft[k] !== '' ? draft[k] : f),
        reload: () => { },
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
            <Flex justify="space-between" align="center" mb={2} wrap="wrap" gap={4}>
                <Box>
                    <Heading size="lg" color="white">Тексты сайта</Heading>
                    <Text color="gray.400" fontSize="sm">
                        Здесь можно редактировать надписи в шапке, футере, на главной и на странице «О театре»,
                        а также загрузить общую фотографию (блок сразу под кнопкой «Сохранить»).
                    </Text>
                </Box>
                <Button
                    bg={primaryColor}
                    color="#0a0a0a"
                    _hover={{ bg: '#ffffff' }}
                    isLoading={saving}
                    onClick={handleSave}
                >
                    Сохранить изменения
                </Button>
            </Flex>

            <Divider my={6} borderColor="#2a2a2a" />

            <VStack align="stretch" spacing={8}>
                {/* Отдельный блок сверху — всегда виден, не зависит от названия секции. */}
                <Box bg="#141414" borderRadius="xl" border="1px solid #2a2a2a" p={6}>
                    <Heading size="md" color={primaryColor} mb={2}>
                        Общая фотография
                        <Badge ml={2} bg="#2a2a2a" color="gray.400" fontWeight="normal" verticalAlign="middle">
                            {SHARED_ABOUT_IMAGE_KEY}
                        </Badge>
                    </Heading>
                    <Text color="gray.400" fontSize="sm" mb={4}>
                        Для главной страницы и раздела «О театре». Файл всегда сохраняется как «{SHARED_ABOUT_IMAGE_KEY}» —
                        иначе сайт его не покажет.
                    </Text>
                    <HStack align="start" spacing={4} flexWrap="wrap">
                        <Image
                            src={sharedPreview}
                            alt="Общая фотография"
                            maxW={{ base: '100%', md: '280px' }}
                            maxH="200px"
                            objectFit="contain"
                            borderRadius="md"
                            border="1px solid #333"
                            bg="#0f0f0f"
                            fallbackSrc=""
                        />
                        <VStack align="stretch" spacing={2}>
                            <input
                                ref={sharedFileRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                style={{ display: 'none' }}
                                onChange={handleSharedPhotoSelect}
                            />
                            <Button
                                bg={primaryColor}
                                color="#0a0a0a"
                                _hover={{ bg: '#ffffff' }}
                                isLoading={uploadingShared}
                                onClick={() => sharedFileRef.current?.click()}
                            >
                                Загрузить / заменить
                            </Button>
                            <Text color="gray.500" fontSize="xs">
                                JPEG, PNG, WebP или GIF, до 10 МБ.
                            </Text>
                        </VStack>
                    </HStack>
                </Box>

                {Object.entries(sections).map(([section, sectionItems]) => (
                    <Box key={section} bg="#141414" borderRadius="xl" border="1px solid #2a2a2a" p={6}>
                        <Heading size="md" color={primaryColor} mb={4}>{section}</Heading>
                        <VStack align="stretch" spacing={4}>
                            {sectionItems.map(item => (
                                <FormControl key={item.key}>
                                    <FormLabel color="gray.200" mb={1}>
                                        {item.label || item.key}
                                        <Badge ml={2} bg="#2a2a2a" color="gray.400" fontWeight="normal">{item.key}</Badge>
                                    </FormLabel>
                                    {item.multiline ? (
                                        <Textarea
                                            value={draft[item.key] ?? ''}
                                            onChange={(e) => handleChange(item.key, e.target.value)}
                                            bg="#0f0f0f"
                                            borderColor="#333333"
                                            _hover={{ borderColor: '#444444' }}
                                            focusBorderColor={primaryColor}
                                            minH="110px"
                                        />
                                    ) : (
                                        <Input
                                            value={draft[item.key] ?? ''}
                                            onChange={(e) => handleChange(item.key, e.target.value)}
                                            bg="#0f0f0f"
                                            borderColor="#333333"
                                            _hover={{ borderColor: '#444444' }}
                                            focusBorderColor={primaryColor}
                                        />
                                    )}
                                </FormControl>
                            ))}
                        </VStack>
                    </Box>
                ))}
            </VStack>

            <Divider my={8} borderColor="#2a2a2a" />

            {/* Живой предпросмотр футера с учётом внесённых (несохранённых) правок */}
            <Box mb={4}>
                <Heading size="md" color="white" mb={1}>Предпросмотр футера</Heading>
                <Text color="gray.400" fontSize="sm">Обновляется по мере редактирования полей выше.</Text>
            </Box>
            <Box borderRadius="xl" overflow="hidden" border="1px solid #2a2a2a">
                <SiteContentContext.Provider value={draftCtx}>
                    <Footer />
                </SiteContentContext.Provider>
            </Box>
        </Container>
    );
};

export default SiteContentPageAdmin;
