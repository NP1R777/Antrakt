import React, { useState } from 'react';
import {
    Button,
    VStack,
    FormControl,
    FormLabel,
    Flex,
    Input,
    Textarea,
    Switch,
    Box,
    Image,
    Center,
    Wrap,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    useDisclosure,
    Text,
    Select
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaArchive,
    FaImage,
    FaTimes,
    FaSave,
    FaPlus,
    FaTrash,
    FaCalendarAlt
} from 'react-icons/fa';
import axios from 'axios';
import { chakra, useToast } from '@chakra-ui/react';
import ImageUpload from '../../../components/ImageUpload';
import RequiredFieldsHint from '../../../components/admin/RequiredFieldsHint';
import { API_URL } from '../../../config';
import { emptyStringsToNull } from '../../../utils/adminPayload';

const MotionButton = motion(Button);
const MotionBox = motion(Box);
const CFaArchive = chakra(FaArchive as any);
const CFaImage = chakra(FaImage as any);
const CFaTimes = chakra(FaTimes as any);
const CFaSave = chakra(FaSave as any);
const CFaPlus = chakra(FaPlus as any);
const CFaTrash = chakra(FaTrash as any);
const CFaCalendar = chakra(FaCalendarAlt as any);

const primaryColor = '#f2f2f2';

const ageLimits = [
    '0+',
    '6+',
    '12+',
    '16+',
    '18+'
];

interface Archive {
    id: number;
    title: string;
    description: string;
    age_limit: string;
    premiere_date?: string;
    afisha: boolean;
    image_url: string;
    archive_image: string;
    images_list: string[];
}

export const ArchiveForm: React.FC<{
    initialData?: Partial<Archive>;
    onSuccess: () => void;
    onCancel: () => void;
}> = ({ initialData, onSuccess, onCancel }) => {
    const [currentArchive, setCurrentArchive] = useState<Partial<Archive>>(initialData || {
        afisha: true,
        images_list: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGalleryUploading, setIsGalleryUploading] = useState(false);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentArchive(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (field: keyof Archive) => (imageUrl: string) => {
        setCurrentArchive(prev => ({ ...prev, [field]: imageUrl }));
    };

    const handleImageRemove = (field: keyof Archive) => {
        setCurrentArchive(prev => ({ ...prev, [field]: '' }));
    };

    const handleAddGalleryImage = (imageUrl: string) => {
        if (!imageUrl) return;

        setCurrentArchive(prev => ({
            ...prev,
            images_list: [...(prev.images_list || []), imageUrl]
        }));
    };

    const handleAddGalleryImages = (imageUrls: string[]) => {
        if (!imageUrls?.length) return;
        setCurrentArchive(prev => ({
            ...prev,
            images_list: [...(prev.images_list || []), ...imageUrls]
        }));
    };

    const handleRemoveGalleryImage = (index: number) => {
        if (!currentArchive.images_list) return;

        const newImages = [...currentArchive.images_list];
        newImages.splice(index, 1);

        setCurrentArchive(prev => ({
            ...prev,
            images_list: newImages
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const method = currentArchive.id ? 'put' : 'post';
            const url = currentArchive.id
                ? `${API_URL}/archive${currentArchive.id}/`
                : `${API_URL}/archive/`;

            const payload = emptyStringsToNull(
                { ...currentArchive } as Record<string, unknown>,
                ['premiere_date', 'age_limit', 'archive_image', 'deleted_at'],
            );
            await axios[method](url, payload);

            toast({
                title: 'Успех',
                description: currentArchive.id
                    ? 'Проект обновлён'
                    : 'Проект создан',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onSuccess();
        } catch (error) {
            console.error('Ошибка:', error);
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка при сохранении',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Flex direction="column" w="full" maxW="100vw">
            <RequiredFieldsHint required={['Название', 'Описание']} />
            {/* Основной контент формы */}
            <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={{ base: 4, md: 6 }}
                mb={6}
            >
                {/* Левая колонка */}
                <VStack
                    spacing={4}
                    align="stretch"
                    flex={1}
                    minW="0" // Важно для предотвращения переполнения
                >
                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaArchive color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Название мероприятия</Text>
                        </FormLabel>
                        <Input
                            name="title"
                            placeholder="Название спектакля"
                            value={currentArchive.title || ''}
                            onChange={handleInputChange}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaCalendar color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Дата премьеры</Text>
                        </FormLabel>
                        <Input
                            name="premiere_date"
                            type="date"
                            value={currentArchive.premiere_date || ''}
                            onChange={handleInputChange}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaImage color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Возрастное ограничение</Text>
                        </FormLabel>
                        <Select
                            name="age_limit"
                            value={currentArchive.age_limit || ''}
                            onChange={handleInputChange}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        >
                            <option value="" style={{ backgroundColor: '#333333', color: 'white' }}>Выберите ограничение</option>
                            {ageLimits.map(limit => (
                                <option key={limit} value={limit} style={{ backgroundColor: '#333333', color: 'white' }}>{limit}</option>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="afisha" mb="0" fontWeight="semibold">
                            Статус
                        </FormLabel>
                        <Switch
                            id="afisha"
                            isChecked={currentArchive.afisha}
                            onChange={(e) => setCurrentArchive(prev => ({
                                ...prev,
                                afisha: e.target.checked
                            }))}
                            colorScheme="green"
                        />
                        <Text ml={3} color={currentArchive.afisha ? "green.300" : "purple.300"}>
                            {currentArchive.afisha ? "В афише" : "В проектах"}
                        </Text>
                    </FormControl>

                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaImage color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Фото мероприятия</Text>
                        </FormLabel>
                        <ImageUpload
                            currentImageUrl={currentArchive.archive_image}
                            onImageUpload={handleImageUpload('archive_image')}
                            onImageRemove={() => handleImageRemove('archive_image')}
                            contentType="archive"
                            maxSize={10}
                            disabled={isSubmitting}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel display="flex" alignItems="center" gap={2}>
                            <CFaImage color={primaryColor} />
                            <Text as="span" fontWeight="semibold">Фотогалерея</Text>
                        </FormLabel>
                        <Box
                            border="1px dashed"
                            borderColor="gray.600"
                            borderRadius="md"
                            p={4}
                            mb={4}
                            bg="rgba(30, 30, 30, 0.5)"
                        >
                            {currentArchive.images_list?.length ? (
                                <Wrap spacing={3} mb={4}>
                                    <AnimatePresence>
                                        {currentArchive.images_list.map((url, index) => (
                                            <MotionBox
                                                key={index}
                                                position="relative"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Image
                                                    src={url}
                                                    boxSize="100px"
                                                    objectFit="cover"
                                                    borderRadius="md"
                                                    border="1px solid"
                                                    borderColor="gray.600"
                                                />
                                                <IconButton
                                                    aria-label="Удалить фото"
                                                    icon={<CFaTrash />}
                                                    size="xs"
                                                    position="absolute"
                                                    top="-8px"
                                                    right="-8px"
                                                    borderRadius="full"
                                                    bg="red.500"
                                                    color="white"
                                                    _hover={{ bg: 'red.600' }}
                                                    onClick={() => handleRemoveGalleryImage(index)}
                                                />
                                            </MotionBox>
                                        ))}
                                    </AnimatePresence>
                                </Wrap>
                            ) : (
                                <Center minH="100px" color="gray.500" fontSize="sm">
                                    Нет загруженных фотографий
                                </Center>
                            )}

                            <Button
                                leftIcon={<CFaPlus />}
                                colorScheme="teal"
                                variant="outline"
                                onClick={onOpen}
                                isLoading={isGalleryUploading}
                                w="full"
                            >
                                Добавить фотографию
                            </Button>
                        </Box>
                    </FormControl>
                </VStack>

                {/* Правая колонка */}
                <VStack
                    spacing={4}
                    align="stretch"
                    flex={1}
                    minW="0" // Важно для предотвращения переполнения
                >
                    <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                        <FormControl flex={1}>
                            <FormLabel display="flex" alignItems="center" gap={2}>
                                <CFaImage color={primaryColor} />
                                <Text as="span" fontWeight="semibold">Афиша мероприятия</Text>
                            </FormLabel>
                            <ImageUpload
                                currentImageUrl={currentArchive.image_url}
                                onImageUpload={handleImageUpload('image_url')}
                                onImageRemove={() => handleImageRemove('image_url')}
                                contentType="archive"
                                maxSize={10}
                                disabled={isSubmitting}
                            />
                        </FormControl>
                    </Flex>

                    <FormControl>
                        <FormLabel fontWeight="semibold">Описание спектакля</FormLabel>
                        <Textarea
                            name="description"
                            placeholder="Полное описание спектакля"
                            value={currentArchive.description || ''}
                            onChange={handleInputChange}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                            rows={12}
                            minH="200px"
                        />
                    </FormControl>
                </VStack>
            </Flex>

            <Flex justify="flex-end" mt={6} gap={3} flexWrap="wrap">
                <Button
                    variant="outline"
                    mr={3}
                    onClick={onCancel}
                    leftIcon={<CFaTimes />}
                    bg="#3a3a3a"
                    borderColor="#3a3a3a"
                    _hover={{ bg: 'red' }}
                    flexShrink={0}
                >
                    Отмена
                </Button>
                <MotionButton
                    bg="#3182CE"
                    _hover={{ bg: '#4299E1' }}
                    isLoading={isSubmitting}
                    onClick={handleSubmit}
                    leftIcon={<CFaSave />}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    flexShrink={0}
                >
                    {currentArchive.id ? 'Обновить' : 'Создать'}
                </MotionButton>
            </Flex>

            {/* Модальное окно для загрузки фотографий в галерею */}
            <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "lg" }}>
                <ModalOverlay />
                <ModalContent bg="gray.800" color="white">
                    <ModalHeader>Добавить фотографии в галерею</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ImageUpload
                            currentImageUrl={null}
                            multiple
                            onImageUpload={(imageUrl) => {
                                handleAddGalleryImage(imageUrl);
                                onClose();
                            }}
                            onImagesUpload={(urls) => {
                                handleAddGalleryImages(urls);
                                onClose();
                            }}
                            onImageRemove={() => { }}
                            contentType="archive"
                            maxSize={10}
                            disabled={isSubmitting}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={onClose}>
                            Отмена
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};