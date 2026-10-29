import React from 'react';
import { FormControl, FormLabel, Textarea } from '@chakra-ui/react';
import { primaryColor } from './presentation';
import type { FormSectionProps } from './usePerformanceForm';

export default function DescriptionField({ form }: FormSectionProps) {
    const { currentPerformance, handleInputChange } = form;
    return (
        <FormControl>
            <FormLabel fontWeight="semibold">Описание спектакля</FormLabel>
            <Textarea
                name="description"
                placeholder="Описание спектакля"
                value={currentPerformance.description || ''}
                onChange={handleInputChange}
                focusBorderColor={primaryColor}
                bg="#333333"
                borderColor="#444444"
                _hover={{ borderColor: '#555555' }}
                rows={8}
            />
        </FormControl>
    );
}
