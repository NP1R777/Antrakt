import React, { useState, useEffect } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { API_URL } from '../../../../config';
import type { Performance, CastMember, ActorOption, PerformanceFormProps } from './types';
import { OTHER_ACTOR } from './options';
import { normalizeInitial, buildPerformancePayload, formatShowLabel } from './data';

// Общее состояние остаётся здесь: секции используют прежние обработчики и payload API.
export function usePerformanceForm({ initialData, onSuccess, onCancel }: PerformanceFormProps) {
    const [currentPerformance, setCurrentPerformance] = useState<Partial<Performance>>(
        normalizeInitial(initialData)
    );

    const [listInputs, setListInputs] = useState<Record<string, string>>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isGalleryUploading] = useState(false);

    const [actorOptions, setActorOptions] = useState<ActorOption[]>([]);

    const [directorOptions, setDirectorOptions] = useState<ActorOption[]>([]);

    const [newShow, setNewShow] = useState<{ show_datetime: string; ticket_url: string }>({
        show_datetime: '',
        ticket_url: ''
    });

    const [newCast, setNewCast] = useState<{ actor: string; actor_name: string; role: string }>({
        actor: '',
        actor_name: '',
        role: ''
    });

    const [directorIsOther, setDirectorIsOther] = useState(
        Boolean(initialData?.guest_director_name) && !initialData?.director
    );

    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        // active=1 — только действующие актёры (выбывшие в списке состава не нужны).
        axios.get(`${API_URL}/actors/?active=1`)
            .then(res => setActorOptions(
                (res.data || []).map((a: any) => ({ id: a.id, name: a.name }))
            ))
            .catch (err => console.error('Не удалось загрузить актёров:', err));
        axios.get(`${API_URL}/directors/`)
            .then(res => setDirectorOptions(
                (res.data || []).map((d: any) => ({ id: d.id, name: d.name }))
            ))
            .catch (err => console.error('Не удалось загрузить режиссёров:', err));
    }, []);

    const actorNameById = (id: number) =>
        actorOptions.find(a => a.id === id)?.name || `Актёр #${id}`;

    const directorNameById = (id: number) =>
        directorOptions.find(d => d.id === id)?.name || `Режиссёр #${id}`;

    const handleAddShow = () => {
        if (!newShow.show_datetime) return;
        setCurrentPerformance(prev => ({
            ...prev,
            shows: [...(prev.shows || []), {
                show_datetime: newShow.show_datetime,
                ticket_url: newShow.ticket_url.trim() || null
            }]
        }));
        setNewShow({ show_datetime: '', ticket_url: '' });
    };

    const handleRemoveShow = (index: number) => {
        setCurrentPerformance(prev => {
            const shows = [...(prev.shows || [])];
            shows.splice(index, 1);
            return { ...prev, shows };
        });
    };

    const handleAddCast = () => {
        if (!newCast.actor || !newCast.role.trim()) return;
        let member: CastMember;
        if (newCast.actor === OTHER_ACTOR) {
            const customName = newCast.actor_name.trim();
            if (!customName) return; // имя приглашённого актёра обязательно
            member = { actor: null, director: null, actor_name: customName, role: newCast.role.trim() };
        } else if (newCast.actor.startsWith('d:')) {
            const dirId = parseInt(newCast.actor.slice(2), 10);
            member = { actor: null, director: dirId, actor_name: directorNameById(dirId), role: newCast.role.trim() };
        } else {
            // формат 'a:<id>' либо просто '<id>' (совместимость)
            const actorId = parseInt(newCast.actor.replace(/^a:/, ''), 10);
            member = { actor: actorId, director: null, actor_name: actorNameById(actorId), role: newCast.role.trim() };
        }
        setCurrentPerformance(prev => ({
            ...prev,
            cast: [...(prev.cast || []), member]
        }));
        setNewCast({ actor: '', actor_name: '', role: '' });
    };

    const handleRemoveCast = (index: number) => {
        setCurrentPerformance(prev => {
            const cast = [...(prev.cast || [])];
            cast.splice(index, 1);
            return { ...prev, cast };
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentPerformance(prev => ({ ...prev, [name]: value }));
    };

    const handleListInputChange = (field: string, value: string) => {
        setListInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleAddToList = (field: keyof Performance) => {
        if (!listInputs[field]?.trim()) return;

        const currentList = Array.isArray(currentPerformance[field])
            ? [...(currentPerformance[field] as string[])]
            : [];

        const newItem = listInputs[field].trim();

        setCurrentPerformance(prev => ({
            ...prev,
            [field]: [...currentList, newItem]
        }));

        setListInputs(prev => ({ ...prev, [field]: '' }));
    };

    const handleRemoveFromList = (field: keyof Performance, index: number) => {
        const currentList = Array.isArray(currentPerformance[field])
            ? [...(currentPerformance[field] as string[])]
            : [];

        currentList.splice(index, 1);

        setCurrentPerformance(prev => ({
            ...prev,
            [field]: currentList
        }));
    };

    const handleImageUpload = (imageUrl: string, field: string) => {
        setCurrentPerformance(prev => ({
            ...prev,
            [field]: imageUrl
        }));
    };

    const handleImageRemove = (field: string) => {
        setCurrentPerformance(prev => ({
            ...prev,
            [field]: ''
        }));
    };

    const handleAddGalleryImage = (imageUrl: string) => {
        if (!imageUrl) return;

        setCurrentPerformance(prev => ({
            ...prev,
            images_list: [...(prev.images_list || []), imageUrl]
        }));
    };

    const handleAddGalleryImages = (imageUrls: string[]) => {
        if (!imageUrls?.length) return;

        setCurrentPerformance(prev => ({
            ...prev,
            images_list: [...(prev.images_list || []), ...imageUrls]
        }));
    };

    const handleRemoveGalleryImage = (index: number) => {
        if (!currentPerformance.images_list) return;

        const newImages = [...currentPerformance.images_list];
        newImages.splice(index, 1);

        setCurrentPerformance(prev => ({
            ...prev,
            images_list: newImages
        }));
    };

    const handleCreatePerformance = async () => {
        setIsSubmitting(true);
        try {
            await axios.post(`${API_URL}/perfomances/`, buildPerformancePayload(currentPerformance));
            toast({
                title: 'Успех!',
                description: 'Спектакль успешно добавлен',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            onSuccess();
        } catch (error) {
            console.error('Ошибка при создании спектакля:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось создать спектакль',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdatePerformance = async () => {
        if (!currentPerformance.id) return;

        setIsSubmitting(true);
        try {
            await axios.put(`${API_URL}/perfomance${currentPerformance.id}/`, buildPerformancePayload(currentPerformance));
            toast({
                title: 'Успех!',
                description: 'Спектакль успешно обновлён',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            onSuccess();
        } catch (error) {
            console.error('Ошибка при обновлении спектакля:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось обновить спектакль',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        currentPerformance,
        setCurrentPerformance,
        listInputs,
        isSubmitting,
        isGalleryUploading,
        actorOptions,
        directorOptions,
        newShow,
        setNewShow,
        newCast,
        setNewCast,
        directorIsOther,
        setDirectorIsOther,
        isOpen,
        onOpen,
        onClose,
        actorNameById,
        directorNameById,
        handleAddShow,
        handleRemoveShow,
        handleAddCast,
        handleRemoveCast,
        formatShowLabel,
        handleInputChange,
        handleListInputChange,
        handleAddToList,
        handleRemoveFromList,
        handleImageUpload,
        handleImageRemove,
        handleAddGalleryImage,
        handleAddGalleryImages,
        handleRemoveGalleryImage,
        handleCreatePerformance,
        handleUpdatePerformance,
        onCancel
    };
}

export type PerformanceFormState = ReturnType<typeof usePerformanceForm>;
export interface FormSectionProps { form: PerformanceFormState; }
