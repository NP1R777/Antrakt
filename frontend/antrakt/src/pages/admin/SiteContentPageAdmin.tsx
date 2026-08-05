import React, { useEffect, useState, useMemo } from 'react';
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
} from '@chakra-ui/react';
import axios from 'axios';
import Footer from '../../components/Footer';
import { SiteContentContext, useSiteContent, SiteContentItem } from '../../contexts/SiteContentContext';
import { API_URL, MEDIA_URL } from '../../config';
import ImageUpload from '../../components/ImageUpload';

const primaryColor = '#f2f2f2';

/** Общая фотография главной и «О театре» — ключ в MinIO строго такой. */
const SHARED_ABOUT_IMAGE_KEY = 'Общая.png';
const sharedAboutImageUrl = () => `${MEDIA_URL}/antrakt-images/${SHARED_ABOUT_IMAGE_KEY}`;

const SiteContentPageAdmin: React.FC = () => {
    const [items, setItems] = useState<SiteContentItem[]>([]);
    const [draft, setDraft] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sharedPreview, setSharedPreview] = useState(() => `${sharedAboutImageUrl()}?t=${Date.now()}`);
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
            reload();
        } catch (e) {
            toast({ title: 'Ошибка при сохранении', status: 'error', duration: 3000, isClosable: true });
        } finally {
            setSaving(false);
        }
    };

    const handleSharedUploaded = (_url: string) => {
        // URL с бэка может отличаться от фронтового MEDIA_URL — превью всегда с cache-bust.
        setSharedPreview(`${sharedAboutImageUrl()}?t=${Date.now()}`);
        toast({
            title: 'Общая фотография обновлена',
            description: `Файл сохранён как «${SHARED_ABOUT_IMAGE_KEY}». Он на главной и на странице «О театре».`,
            status: 'success',
            duration: 4000,
            isClosable: true,
        });
    };

    // Функция (не один JSX-элемент) — иначе React не может смонтировать блок дважды.
    const renderSharedPhotoBlock = (key: string) => (
        <Box
            key={key}
            bg="#1a1a1a"
            borderRadius="xl"
            border="2px solid #f2f2f2"
            p={5}
            w="100%"
        >
            <Heading size="md" color="#ffffff" mb={2}>
                Общая фотография
                <Badge ml={2} bg="#333" color="#f2f2f2" fontWeight="normal" verticalAlign="middle">
                    {SHARED_ABOUT_IMAGE_KEY}
                </Badge>
            </Heading>
            <Text color="gray.300" fontSize="sm" mb={4}>
                Эта кнопка загружает фото для главной и страницы «О театре».
                Имя файла на сервере всегда «{SHARED_ABOUT_IMAGE_KEY}».
            </Text>
            <Box maxW={{ base: '100%', md: '420px' }}>
                <ImageUpload
                    currentImageUrl={sharedPreview}
                    onImageUpload={handleSharedUploaded}
                    contentType="site"
                    fixedKey={SHARED_ABOUT_IMAGE_KEY}
                    maxSize={10}
                />
            </Box>
        </Box>
    );

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
                        Надписи сайта и общая фотография (белый блок ниже / внутри «О театре»).
                    </Text>
                </Box>
                <Button
                    variant="theater"
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
                {renderSharedPhotoBlock('shared-photo-top')}

                {Object.entries(sections).map(([section, sectionItems]) => {
                    const isAbout =
                        sectionItems.some((i) => i.key.startsWith('about.')) ||
                        section.trim().toLowerCase() === 'о театре';

                    return (
                        <Box key={section} bg="#141414" borderRadius="xl" border="1px solid #2a2a2a" p={6}>
                            <Heading size="md" color={primaryColor} mb={4}>{section}</Heading>
                            <VStack align="stretch" spacing={4}>
                                {isAbout && renderSharedPhotoBlock(`shared-photo-${section}`)}

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
                    );
                })}
            </VStack>

            <Divider my={8} borderColor="#2a2a2a" />

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
