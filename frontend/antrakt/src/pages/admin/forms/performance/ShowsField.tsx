import React from 'react';
import { FormControl, FormLabel, Input, Text, HStack, IconButton, Wrap, TagLabel, TagCloseButton } from '@chakra-ui/react';
import { MotionTag, CFaPlus, CFaCalendar, accentColor } from './presentation';
import { AnimatePresence } from 'framer-motion';
import type { FormSectionProps } from './usePerformanceForm';

export default function ShowsField({ form }: FormSectionProps) {
    const { currentPerformance, newShow, setNewShow, handleAddShow, handleRemoveShow, formatShowLabel } = form;
    return (
        <FormControl>
            <FormLabel display="flex" alignItems="center" gap={2} mb={2}>
                <CFaCalendar color={accentColor} />
                <Text as="span" fontWeight="semibold">Показы (дата и время)</Text>
            </FormLabel>
            <HStack mb={2} align="flex-end">
                <Input
                    type="datetime-local"
                    value={newShow.show_datetime}
                    onChange={(e) => setNewShow(prev => ({ ...prev, show_datetime: e.target.value }))}
                    focusBorderColor={accentColor}
                    bg="#333333"
                    borderColor="#444444"
                    _hover={{ borderColor: '#555555' }}
                />
                <Input
                    placeholder="Ссылка на билеты (необязательно)"
                    value={newShow.ticket_url}
                    onChange={(e) => setNewShow(prev => ({ ...prev, ticket_url: e.target.value }))}
                    focusBorderColor={accentColor}
                    bg="#333333"
                    borderColor="#444444"
                    _hover={{ borderColor: '#555555' }}
                />
                <IconButton
                    aria-label="Добавить показ"
                    icon={<CFaPlus />}
                    onClick={handleAddShow}
                    bg={accentColor}
                    _hover={{ bg: '#dedede' }}
                />
            </HStack>
            <Wrap spacing={2} minH="50px" mb={4}>
                <AnimatePresence>
                    {(currentPerformance.shows || []).map((show, index) => (
                        <MotionTag
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            size="md"
                            variant="solid"
                            bg="#444444"
                            borderRadius="full"
                            px={3}
                            py={1}
                        >
                            <TagLabel>{formatShowLabel(show.show_datetime)}</TagLabel>
                            <TagCloseButton onClick={() => handleRemoveShow(index)} />
                        </MotionTag>
                    ))}
                </AnimatePresence>
            </Wrap>
        </FormControl>
    );
}
