import React from 'react';
import { FormControl, FormLabel, Input, Text, HStack, IconButton, Wrap, TagLabel, TagCloseButton } from '@chakra-ui/react';
import { MotionTag, CFaPlus, CFaUsers, accentColor } from './presentation';
import { AnimatePresence } from 'framer-motion';
import type { FormSectionProps } from './usePerformanceForm';

export default function ProductionTeamField({ form }: FormSectionProps) {
    const { currentPerformance, listInputs, handleListInputChange, handleAddToList, handleRemoveFromList } = form;
    const field = 'production_team';
    const label = 'Постановочная команда';
    const icon = <CFaUsers color={accentColor} />;
    return (
        <FormControl>
            <FormLabel display="flex" alignItems="center" gap={2} mb={2}>
                {icon}
                <Text as="span" fontWeight="semibold">{label}</Text>
            </FormLabel>

            <HStack mb={2}>
                <Input
                    value={listInputs[field] || ''}
                    onChange={(e) => handleListInputChange(field, e.target.value)}
                    placeholder={`Добавить ${label.toLowerCase()}`}
                    focusBorderColor={accentColor}
                    bg="#333333"
                    borderColor="#444444"
                    _hover={{ borderColor: '#555555' }}
                />
                <IconButton
                    aria-label={`Добавить ${label.toLowerCase()}`}
                    icon={<CFaPlus />}
                    onClick={() => handleAddToList(field)}
                    bg={accentColor}
                    _hover={{ bg: '#dedede' }}
                />
            </HStack>

            <Wrap spacing={2} minH="50px" mb={4}>
                <AnimatePresence>
                    {Array.isArray(currentPerformance[field]) && (currentPerformance[field] as string[]).map((item, index) => (
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
                            <TagLabel>{item}</TagLabel>
                            <TagCloseButton onClick={() => handleRemoveFromList(field, index)} />
                        </MotionTag>
                    ))}
                </AnimatePresence>
            </Wrap>
        </FormControl>
    );
}
