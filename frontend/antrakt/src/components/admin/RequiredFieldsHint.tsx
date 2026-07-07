import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface RequiredFieldsHintProps {
    required: string[];
    note?: string;
}

/**
 * Подсказка вверху админ-формы: какие поля обязательны для заполнения.
 * Остальные поля считаются необязательными.
 */
const RequiredFieldsHint: React.FC<RequiredFieldsHintProps> = ({ required, note }) => (
    <Box
        mb={5}
        p={3}
        bg="rgba(128,0,32,0.12)"
        border="1px solid"
        borderColor="rgba(128,0,32,0.45)"
        borderRadius="md"
    >
        <Text fontSize="sm" color="gray.100">
            <Text as="span" color="#d9d9d9" fontWeight="bold">*</Text>{' '}
            <b>Обязательные поля:</b> {required.join(', ')}.
        </Text>
        <Text fontSize="xs" color="gray.400" mt={1}>
            {note || 'Остальные поля можно не заполнять — они необязательны.'}
        </Text>
    </Box>
);

export default RequiredFieldsHint;
