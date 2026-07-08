import React, { useEffect, useState, useMemo } from 'react';
import {
    Box,
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

const primaryColor = '#f2f2f2';

const SiteContentPageAdmin: React.FC = () => {
    const [items, setItems] = useState<SiteContentItem[]>([]);
    const [draft, setDraft] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const toast = useToast();
    const { reload } = useSiteContent();

    const load = () => {
        setLoading(true);
        axios.get('http://localhost:8000/site-content/')
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
            await axios.put('http://localhost:8000/site-content/', {
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
        <Box>
            <Flex justify="space-between" align="center" mb={2} wrap="wrap" gap={4}>
                <Box>
                    <Heading size="lg" color="white">Тексты сайта</Heading>
                    <Text color="gray.400" fontSize="sm">
                        Здесь можно редактировать надписи в шапке, футере, на главной и на странице «О театре».
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
        </Box>
    );
};

export default SiteContentPageAdmin;
