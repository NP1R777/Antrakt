import React from 'react';
import { Grid, VStack } from '@chakra-ui/react';
import RequiredFieldsHint from '../../../components/admin/RequiredFieldsHint';
import type { PerformanceFormProps } from './performance/types';
import { usePerformanceForm } from './performance/usePerformanceForm';
import MainFields from './performance/MainFields';
import PerformanceImageField from './performance/PerformanceImageField';
import ProductionTeamField from './performance/ProductionTeamField';
import ShowsField from './performance/ShowsField';
import CastField from './performance/CastField';
import GalleryField from './performance/GalleryField';
import DescriptionField from './performance/DescriptionField';
import FormActions from './performance/FormActions';
import GalleryUploadModal from './performance/GalleryUploadModal';

/** Компоновка прежней формы: порядок полей, стили и обработчики сохранены. */
export const PerformanceForm: React.FC<PerformanceFormProps> = (props) => {
    const form = usePerformanceForm(props);
    return (
        <>
            <RequiredFieldsHint required={['Название спектакля', 'Автор', 'Жанр', 'Возрастное ограничение', 'Описание']} />
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                <VStack spacing={4} align="stretch">
                    <MainFields form={form} />
                </VStack>
                <VStack spacing={4} align="stretch">
                    <PerformanceImageField form={form} field="image_url" label="Постер спектакля" />
                    <ProductionTeamField form={form} />
                    <ShowsField form={form} />
                    <CastField form={form} />
                    <GalleryField form={form} />
                    <DescriptionField form={form} />
                </VStack>
            </Grid>
            <FormActions form={form} />
            <GalleryUploadModal form={form} />
        </>
    );
};
