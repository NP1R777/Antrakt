import React, { useEffect, useState } from 'react';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { formatShowDatetime, ticketUrl } from '../utils/afisha';

export interface PerformanceShow {
    id?: number;
    show_datetime: string;
    ticket_url?: string | null;
}

export default function ShowTickets({ shows = [], generalUrl }: { shows?: PerformanceShow[] | null; generalUrl?: string | null }) {
    const [now, setNow] = useState(Date.now);
    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 60000);
        return () => window.clearInterval(timer);
    }, []);
    const general = ticketUrl(generalUrl);
    const schedule = [...(shows || [])].sort((a, b) => new Date(a.show_datetime).getTime() - new Date(b.show_datetime).getTime());
    return <VStack align="stretch" spacing={4} w="full">
        <Heading as="h3" size="sm" color="white">Показы и билеты</Heading>
        {schedule.length ? schedule.map((show, index) => {
            const timestamp = new Date(show.show_datetime).getTime();
            const future = Number.isFinite(timestamp) && timestamp > now;
            const own = ticketUrl(show.ticket_url);
            const href = own || general;
            const date = formatShowDatetime(show.show_datetime);
            return <Box key={show.id ?? `${show.show_datetime}-${index}`} p={3} borderWidth="1px" borderColor="whiteAlpha.300" borderRadius="md">
                <Text color="gray.300" mb={2}>{date}</Text>
                {future && href ? <>
                    <Button as="a" href={href} target="_blank" rel="noopener noreferrer" colorScheme="red" size="sm" aria-label={`Купить билет на ${date}`}>Купить билет</Button>
                    {!own && <Text color="gray.400" fontSize="xs" mt={2}>Выберите эту дату на странице продажи билетов.</Text>}
                </> : <Text color="gray.400" fontSize="sm">{Number.isFinite(timestamp) && !future ? 'Показ уже начался' : 'Покупка билетов пока недоступна'}</Text>}
            </Box>;
        }) : <>
            <Text color="gray.400">Даты показов уточняются.</Text>
            {general && <Button as="a" href={general} target="_blank" rel="noopener noreferrer" colorScheme="red">Купить билет</Button>}
        </>}
    </VStack>;
}
