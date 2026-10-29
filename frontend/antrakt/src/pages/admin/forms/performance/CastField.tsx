import React from 'react';
import { FormControl, FormLabel, Input, Select, Text, HStack, IconButton, Wrap, TagLabel, TagCloseButton } from '@chakra-ui/react';
import { MotionTag, CFaPlus, CFaUser, accentColor } from './presentation';
import { OTHER_ACTOR } from './options';
import { AnimatePresence } from 'framer-motion';
import type { FormSectionProps } from './usePerformanceForm';

export default function CastField({ form }: FormSectionProps) {
    const {
        currentPerformance,
        actorOptions,
        directorOptions,
        newCast,
        setNewCast,
        actorNameById,
        handleAddCast,
        handleRemoveCast,
    } = form;
    return (
        <FormControl>
            <FormLabel display="flex" alignItems="center" gap={2} mb={2}>
                <CFaUser color={accentColor} />
                <Text as="span" fontWeight="semibold">Актёрский состав (актёр и роль)</Text>
            </FormLabel>
            <HStack mb={2} align="flex-end">
                {newCast.actor === OTHER_ACTOR ? (
                    <Input
                        autoFocus
                        placeholder="Введите имя актёра"
                        value={newCast.actor_name}
                        onChange={(e) => setNewCast(prev => ({ ...prev, actor_name: e.target.value }))}
                        onKeyDown={(e) => {
                            // Escape — вернуться к выпадающему списку
                            if (e.key === 'Escape') {
                                setNewCast(prev => ({ ...prev, actor: '', actor_name: '' }));
                            }
                        }}
                        focusBorderColor={accentColor}
                        bg="#333333"
                        borderColor="#444444"
                        _hover={{ borderColor: '#555555' }}
                    />
                ) : (
                    <Select
                        placeholder="Выберите актёра или режиссёра"
                        value={newCast.actor}
                        onChange={(e) => setNewCast(prev => ({ ...prev, actor: e.target.value, actor_name: '' }))}
                        focusBorderColor={accentColor}
                        bg="#333333"
                        borderColor="#444444"
                        _hover={{ borderColor: '#555555' }}
                    >
                        <optgroup label="Актёры" style={{ backgroundColor: '#333333', color: 'white' }}>
                            {actorOptions.map(a => (
                                <option key={`a${a.id}`} value={`a:${a.id}`} style={{ backgroundColor: '#333333', color: 'white' }}>
                                    {a.name}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="Режиссёры" style={{ backgroundColor: '#333333', color: 'white' }}>
                            {directorOptions.map(d => (
                                <option key={`d${d.id}`} value={`d:${d.id}`} style={{ backgroundColor: '#333333', color: 'white' }}>
                                    {d.name}
                                </option>
                            ))}
                        </optgroup>
                        <option value={OTHER_ACTOR} style={{ backgroundColor: '#333333', color: 'white' }}>
                            Другой(ая)…
                        </option>
                    </Select>
                )}
                <Input
                    placeholder="Роль"
                    value={newCast.role}
                    onChange={(e) => setNewCast(prev => ({ ...prev, role: e.target.value }))}
                    focusBorderColor={accentColor}
                    bg="#333333"
                    borderColor="#444444"
                    _hover={{ borderColor: '#555555' }}
                />
                <IconButton
                    aria-label="Добавить актёра в состав"
                    icon={<CFaPlus />}
                    onClick={handleAddCast}
                    bg={accentColor}
                    _hover={{ bg: '#dedede' }}
                />
            </HStack>
            <Wrap spacing={2} minH="50px" mb={4}>
                <AnimatePresence>
                    {(currentPerformance.cast || []).map((member, index) => (
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
                            <TagLabel>
                                {member.actor_name || (member.actor ? actorNameById(member.actor) : 'Актёр')} — {member.role}
                            </TagLabel>
                            <TagCloseButton onClick={() => handleRemoveCast(index)} />
                        </MotionTag>
                    ))}
                </AnimatePresence>
            </Wrap>
        </FormControl>
    );
}
