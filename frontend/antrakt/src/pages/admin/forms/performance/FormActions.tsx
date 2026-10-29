import React from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { MotionButton, CFaTimes, CFaSave } from './presentation';
import type { FormSectionProps } from './usePerformanceForm';

export default function FormActions({ form }: FormSectionProps) {
    const { currentPerformance, isSubmitting, handleCreatePerformance, handleUpdatePerformance, onCancel } = form;
    return (
        <Flex justify="flex-end" mt={6}>
            <Button
                variant="outline"
                mr={3}
                onClick={onCancel}
                leftIcon={<CFaTimes />}
                bg="#3a3a3a"
                borderColor="#3a3a3a"
                _hover={{ bg: 'red' }}
            >
                Отмена
            </Button>
            <MotionButton
                bg="#3182CE"
                _hover={{ bg: '#4299E1' }}
                isLoading={isSubmitting}
                onClick={currentPerformance.id ? handleUpdatePerformance : handleCreatePerformance}
                leftIcon={<CFaSave />}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {currentPerformance.id ? 'Обновить' : 'Создать'}
            </MotionButton>
        </Flex>
    );
}
