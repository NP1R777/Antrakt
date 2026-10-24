import React from 'react';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export interface PerformanceCredit {
    performance_id: number | null;
    title: string | null;
    role?: string | null;
    year?: number | null;
    team?: string | null;
    legacy: boolean;
}

export default function PerformanceCredits({ credits }: { credits?: PerformanceCredit[] }) {
    if (!credits?.length) return null;
    return <Box w="full" mt={6} color="white">
        <Heading as="h3" size="sm" mb={3}>Спектакли</Heading>
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
            {credits.map((credit, index) => <Box key={`${credit.performance_id}-${index}`} p={4} borderWidth="1px" borderRadius="md" borderColor="whiteAlpha.300">
                {credit.performance_id ? <Text as={Link} to={`/performance/${credit.performance_id}`} fontWeight="bold" textDecoration="underline">
                    {credit.title || 'Без названия'}
                </Text> : <Text fontWeight="bold">{credit.title || 'Без названия'}</Text>}
                {credit.role && <Text color="gray.400">{credit.role}</Text>}
                {credit.year != null && <Text color="gray.400">Год: {credit.year}</Text>}
                {credit.team && <Text color="gray.400">Коллектив: {credit.team}</Text>}
            </Box>)}
        </SimpleGrid>
    </Box>;
}
