import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Flex,
    Select,
    Input,
    Button,
    IconButton,
    Textarea,
    Switch,
    useToast,
    Spinner,
    Divider,
    Badge,
    Avatar,
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import { chakra } from '@chakra-ui/react';
import axios from 'axios';
import { API_URL } from '../../config';

const CFaPlus = chakra(FaPlus as any);
const CFaTrash = chakra(FaTrash as any);
const CFaSave = chakra(FaSave as any);

const primaryColor = '#f2f2f2';
const API = `${API_URL}`;

interface ActorOption { id: number; name: string; image_url?: string; }
interface Birthday { id: number; actor: number; actor_name: string; actor_image?: string; birth_date: string; }
interface Greeting { id: number; text: string; is_active: boolean; }

const BirthdaysPageAdmin: React.FC = () => {
    const [actors, setActors] = useState<ActorOption[]>([]);
    const [directors, setDirectors] = useState<ActorOption[]>([]);
    const [birthdays, setBirthdays] = useState<Birthday[]>([]);
    const [greetings, setGreetings] = useState<Greeting[]>([]);
    const [loading, setLoading] = useState(true);

    const [newActor, setNewActor] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newGreeting, setNewGreeting] = useState('');
    const toast = useToast();

    const loadAll = () => {
        setLoading(true);
        Promise.all([
            axios.get(`${API}/actors/`),
            axios.get(`${API}/directors/`),
            axios.get(`${API}/actor-birthdays/`),
            axios.get(`${API}/birthday-greetings/`),
        ]).then(([a, d, b, g]) => {
            setActors((a.data || []).map((x: any) => ({ id: x.id, name: x.name, image_url: x.image_url })));
            setDirectors((d.data || []).map((x: any) => ({ id: x.id, name: x.name, image_url: x.image_url })));
            setBirthdays(b.data || []);
            setGreetings(g.data || []);
        }).catch(() => {
            toast({ title: 'Не удалось загрузить данные', status: 'error', duration: 3000, isClosable: true });
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addBirthday = async () => {
        if (!newActor || !newDate) {
            toast({ title: 'Выберите человека и дату', status: 'warning', duration: 2500, isClosable: true });
            return;
        }
        // Значение в формате 'a:<id>' (актёр) либо 'd:<id>' (режиссёр).
        const payload: any = { birth_date: newDate };
        if (newActor.startsWith('d:')) {
            payload.director = parseInt(newActor.slice(2), 10);
        } else {
            payload.actor = parseInt(newActor.replace(/^a:/, ''), 10);
        }
        try {
            await axios.post(`${API}/actor-birthdays/`, payload);
            setNewActor(''); setNewDate('');
            toast({ title: 'День рождения добавлен', status: 'success', duration: 2000, isClosable: true });
            loadAll();
        } catch (e: any) {
            const data = e?.response?.data;
            const msg = (data?.actor?.[0] || data?.director?.[0] || data?.non_field_errors?.[0]
                || 'Не удалось добавить (возможно, запись уже есть)');
            toast({ title: msg, status: 'error', duration: 3500, isClosable: true });
        }
    };

    const deleteBirthday = async (id: number) => {
        try {
            await axios.delete(`${API}/actor-birthday${id}/`);
            toast({ title: 'Удалено', status: 'success', duration: 1500, isClosable: true });
            loadAll();
        } catch {
            toast({ title: 'Ошибка удаления', status: 'error', duration: 2500, isClosable: true });
        }
    };

    const addGreeting = async () => {
        if (!newGreeting.trim()) return;
        try {
            await axios.post(`${API}/birthday-greetings/`, { text: newGreeting.trim(), is_active: true });
            setNewGreeting('');
            toast({ title: 'Поздравление добавлено', status: 'success', duration: 2000, isClosable: true });
            loadAll();
        } catch {
            toast({ title: 'Ошибка при добавлении', status: 'error', duration: 2500, isClosable: true });
        }
    };

    const saveGreeting = async (g: Greeting) => {
        try {
            await axios.put(`${API}/birthday-greeting${g.id}/`, { text: g.text, is_active: g.is_active });
            toast({ title: 'Сохранено', status: 'success', duration: 1500, isClosable: true });
        } catch {
            toast({ title: 'Ошибка сохранения', status: 'error', duration: 2500, isClosable: true });
        }
    };

    const deleteGreeting = async (id: number) => {
        try {
            await axios.delete(`${API}/birthday-greeting${id}/`);
            toast({ title: 'Удалено', status: 'success', duration: 1500, isClosable: true });
            loadAll();
        } catch {
            toast({ title: 'Ошибка удаления', status: 'error', duration: 2500, isClosable: true });
        }
    };

    const updateGreetingLocal = (id: number, patch: Partial<Greeting>) => {
        setGreetings(prev => prev.map(g => (g.id === id ? { ...g, ...patch } : g)));
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
            <Box mb={2}>
                <Heading size="lg" color="white">Дни рождения</Heading>
                <Text color="gray.400" fontSize="sm">
                    В день рождения актёра или режиссёра на главной странице автоматически появляется поздравительная секция.
                </Text>
            </Box>
            <Divider my={6} borderColor="#2a2a2a" />

            {/* Дни рождения актёров и режиссёров */}
            <Box bg="#141414" borderRadius="xl" border="1px solid #2a2a2a" p={6} mb={8}>
                <Heading size="md" color={primaryColor} mb={4}>Дни рождения актёров и режиссёров</Heading>

                <HStack mb={5} align="flex-end" wrap="wrap" spacing={3}>
                    <Select
                        placeholder="Выберите человека"
                        value={newActor}
                        onChange={(e) => setNewActor(e.target.value)}
                        bg="#0f0f0f" borderColor="#333333" _hover={{ borderColor: '#444444' }}
                        maxW="320px"
                    >
                        <optgroup label="Актёры" style={{ backgroundColor: '#0f0f0f', color: 'white' }}>
                            {actors.map(a => (
                                <option key={`a${a.id}`} value={`a:${a.id}`} style={{ backgroundColor: '#0f0f0f', color: 'white' }}>
                                    {a.name}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="Режиссёры" style={{ backgroundColor: '#0f0f0f', color: 'white' }}>
                            {directors.map(d => (
                                <option key={`d${d.id}`} value={`d:${d.id}`} style={{ backgroundColor: '#0f0f0f', color: 'white' }}>
                                    {d.name}
                                </option>
                            ))}
                        </optgroup>
                    </Select>
                    <Input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        bg="#0f0f0f" borderColor="#333333" _hover={{ borderColor: '#444444' }}
                        maxW="200px"
                    />
                    <Button leftIcon={<CFaPlus />} bg={primaryColor} color="#0a0a0a" _hover={{ bg: '#ffffff' }} onClick={addBirthday}>
                        Добавить
                    </Button>
                </HStack>

                <VStack align="stretch" spacing={2}>
                    {birthdays.length === 0 && <Text color="gray.500">Пока нет записей.</Text>}
                    {birthdays.map(b => (
                        <Flex key={b.id} align="center" justify="space-between"
                            bg="#0f0f0f" borderRadius="md" border="1px solid #2a2a2a" px={4} py={2}>
                            <HStack spacing={3}>
                                <Avatar size="sm" name={b.actor_name} src={b.actor_image || undefined} />
                                <Text color="white" fontWeight="semibold">{b.actor_name}</Text>
                                <Badge bg="#2a2a2a" color="gray.300">
                                    {new Date(b.birth_date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' })}
                                </Badge>
                            </HStack>
                            <IconButton aria-label="Удалить" icon={<CFaTrash />} size="sm" colorScheme="red"
                                onClick={() => deleteBirthday(b.id)} />
                        </Flex>
                    ))}
                </VStack>
            </Box>

            {/* Тексты поздравлений */}
            <Box bg="#141414" borderRadius="xl" border="1px solid #2a2a2a" p={6}>
                <Heading size="md" color={primaryColor} mb={1}>Тексты поздравлений</Heading>
                <Text color="gray.400" fontSize="sm" mb={4}>
                    Используйте <Badge bg="#2a2a2a" color="gray.200">{'{name}'}</Badge> — вместо него подставится имя актёра.
                    Показывается случайный активный вариант (стабильный в течение дня).
                </Text>

                <VStack align="stretch" spacing={4} mb={6}>
                    {greetings.map(g => (
                        <Box key={g.id} bg="#0f0f0f" borderRadius="md" border="1px solid #2a2a2a" p={3}>
                            <Textarea
                                value={g.text}
                                onChange={(e) => updateGreetingLocal(g.id, { text: e.target.value })}
                                bg="#141414" borderColor="#333333" _hover={{ borderColor: '#444444' }}
                                focusBorderColor={primaryColor}
                                mb={2}
                            />
                            <Flex justify="space-between" align="center">
                                <HStack>
                                    <Switch
                                        isChecked={g.is_active}
                                        onChange={(e) => updateGreetingLocal(g.id, { is_active: e.target.checked })}
                                    />
                                    <Text color="gray.400" fontSize="sm">Активно</Text>
                                </HStack>
                                <HStack>
                                    <Button size="sm" leftIcon={<CFaSave />} bg={primaryColor} color="#0a0a0a"
                                        _hover={{ bg: '#ffffff' }} onClick={() => saveGreeting(g)}>
                                        Сохранить
                                    </Button>
                                    <IconButton aria-label="Удалить" icon={<CFaTrash />} size="sm" colorScheme="red"
                                        onClick={() => deleteGreeting(g.id)} />
                                </HStack>
                            </Flex>
                        </Box>
                    ))}
                </VStack>

                <Divider my={4} borderColor="#2a2a2a" />
                <Text color="gray.300" mb={2} fontWeight="semibold">Новое поздравление</Text>
                <Textarea
                    value={newGreeting}
                    onChange={(e) => setNewGreeting(e.target.value)}
                    placeholder="С днём рождения, {name}! ..."
                    bg="#0f0f0f" borderColor="#333333" _hover={{ borderColor: '#444444' }}
                    focusBorderColor={primaryColor}
                    mb={3}
                />
                <Button leftIcon={<CFaPlus />} bg={primaryColor} color="#0a0a0a" _hover={{ bg: '#ffffff' }} onClick={addGreeting}>
                    Добавить поздравление
                </Button>
            </Box>
        </Container>
    );
};

export default BirthdaysPageAdmin;
