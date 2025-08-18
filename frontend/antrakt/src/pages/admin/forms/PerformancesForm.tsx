import React, { useState } from 'react';
import {
    Button,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Grid,
    Flex
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ImageUpload from '../../../components/ImageUpload';

const MotionButton = motion(Button);

interface Performance {
    id: number;
    title: string;
    author: string;
    description: string;
    image_url: string;
}

export const PerformanceForm: React.FC<{
    initialData?: Partial<Performance>;
    onSuccess: () => void;
    onCancel: () => void;
}> = ({ initialData, onSuccess, onCancel }) => {
    const [current, setCurrent] = useState<Partial<Performance>>(initialData || {});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrent(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (imageUrl: string) => setCurrent(prev => ({ ...prev, image_url: imageUrl }));
    const handleImageRemove = () => setCurrent(prev => ({ ...prev, image_url: '' }));

    const handleCreate = async () => {
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:8000/perfomances/', current);
            onSuccess();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!current.id) return;
        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:8000/perfomance${current.id}/`, current);
            onSuccess();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                <VStack spacing={4} align="stretch">
                    <FormControl>
                        <FormLabel>Название</FormLabel>
                        <Input name="title" value={current.title || ''} onChange={handleInputChange} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Автор</FormLabel>
                        <Input name="author" value={current.author || ''} onChange={handleInputChange} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Изображение</FormLabel>
                        <ImageUpload
                            currentImageUrl={current.image_url}
                            onImageUpload={handleImageUpload}
                            onImageRemove={handleImageRemove}
                            contentType="perfomances"
                            maxSize={10}
                            disabled={isSubmitting}
                        />
                    </FormControl>
                </VStack>
                <VStack spacing={4} align="stretch">
                    <FormControl>
                        <FormLabel>Описание</FormLabel>
                        <Textarea name="description" rows={10} value={current.description || ''} onChange={handleInputChange} />
                    </FormControl>
                </VStack>
            </Grid>
            <Flex justify="flex-end" mt={6} gap={3}>
                <Button variant="outline" onClick={onCancel}>Отмена</Button>
                <MotionButton isLoading={isSubmitting} onClick={current.id ? handleUpdate : handleCreate}>
                    {current.id ? 'Обновить' : 'Создать'}
                </MotionButton>
            </Flex>
        </>
    );
};