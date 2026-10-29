import React from 'react';
import { FormControl, FormLabel, Text } from '@chakra-ui/react';
import { CFaImage, primaryColor } from './presentation';
import ImageUpload from '../../../../components/ImageUpload';
import type { FormSectionProps } from './usePerformanceForm';

interface ImageFieldProps extends FormSectionProps {
    field: 'image_url' | 'performances_image';
    label: string;
}

export default function PerformanceImageField({ form, field, label }: ImageFieldProps) {
    const { currentPerformance, isSubmitting, handleImageUpload, handleImageRemove } = form;
    return (
        <FormControl>
            <FormLabel display="flex" alignItems="center" gap={2}>
                <CFaImage color={primaryColor} />
                <Text as="span" fontWeight="semibold">{label}</Text>
            </FormLabel>
            <ImageUpload
                currentImageUrl={currentPerformance[field]}
                onImageUpload={(imageUrl) => handleImageUpload(imageUrl, field)}
                onImageRemove={() => handleImageRemove(field)}
                contentType="perfomances"
                maxSize={10}
                disabled={isSubmitting}
            />
        </FormControl>
    );
}
