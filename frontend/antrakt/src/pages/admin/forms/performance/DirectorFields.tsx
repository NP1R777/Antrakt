import React from 'react';
import { Button, FormControl, FormLabel, Input, Select, Text, HStack, Box } from '@chakra-ui/react';
import { CFaUser, primaryColor } from './presentation';
import { OTHER_DIRECTOR, COLLECTIVE_OPTIONS } from './options';
import type { FormSectionProps } from './usePerformanceForm';

export default function DirectorFields({ form }: FormSectionProps) {
    const {
        currentPerformance,
        setCurrentPerformance,
        directorOptions,
        directorIsOther,
        setDirectorIsOther,
        handleInputChange,
    } = form;
    return (
        <>
            <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2}>
                    <CFaUser color={primaryColor} />
                    <Text as="span" fontWeight="semibold">Режиссёр</Text>
                </FormLabel>
                {directorIsOther ? (
                    <HStack>
                        <Input
                            placeholder="Имя режиссёра"
                            value={currentPerformance.guest_director_name || ''}
                            onChange={(e) => setCurrentPerformance(prev => ({
                                ...prev,
                                director: null,
                                guest_director_name: e.target.value,
                            }))}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        />
                        <Button
                            size="sm"
                            flexShrink={0}
                            variant="theater"
                            bg="#f2f2f2"
                            color="#0a0a0a"
                            border="1px solid #ffffff"
                            fontWeight="bold"
                            _hover={{ bg: '#ffffff', color: '#0a0a0a' }}
                            _active={{ bg: '#e0e0e0', color: '#0a0a0a' }}
                            _focusVisible={{ boxShadow: '0 0 0 2px #ffffff' }}
                            onClick={() => {
                                setDirectorIsOther(false);
                                setCurrentPerformance(prev => ({
                                    ...prev,
                                    guest_director_name: '',
                                    director: null,
                                }));
                            }}
                        >
                            Из списка
                        </Button>
                    </HStack>
                ) : (
                    <Select
                        placeholder="Выберите режиссёра"
                        value={currentPerformance.director ?? ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === OTHER_DIRECTOR) {
                                setDirectorIsOther(true);
                                setCurrentPerformance(prev => ({
                                    ...prev,
                                    director: null,
                                    guest_director_name: '',
                                }));
                                return;
                            }
                            setDirectorIsOther(false);
                            setCurrentPerformance(prev => ({
                                ...prev,
                                director: val ? parseInt(val, 10) : null,
                                guest_director_name: '',
                            }));
                        }}
                        focusBorderColor={primaryColor}
                        bg="#333333"
                        borderColor="#444444"
                        _hover={{ borderColor: '#555555' }}
                    >
                        {directorOptions.map(d => (
                            <option key={d.id} value={d.id} style={{ backgroundColor: '#333333', color: 'white' }}>
                                {d.name}
                            </option>
                        ))}
                        <option value={OTHER_DIRECTOR} style={{ backgroundColor: '#333333', color: 'white' }}>
                            Другой(-ая)…
                        </option>
                    </Select>
                )}
                <Text mt={1} fontSize="sm" color="#AAAAAA">
                    Имя режиссёра видно уже в «Афише». После завершения показов спектакль добавится на его страницу (если выбран из списка).
                </Text>
            </FormControl>
            {currentPerformance.director ? (
                <Box
                    border="1px solid"
                    borderColor="#444444"
                    borderRadius="md"
                    p={4}
                    bg="rgba(30, 30, 30, 0.5)"
                >
                    <Text fontWeight="semibold" mb={3} color="#e0e0e0">
                        Данные для страницы режиссёра
                    </Text>

                    <FormControl mb={3}>
                        <FormLabel fontSize="sm">Название постановки</FormLabel>
                        <Input
                            name="production_title"
                            placeholder="Если пусто — берётся название спектакля"
                            value={currentPerformance.production_title || ''}
                            onChange={handleInputChange}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        />
                    </FormControl>

                    <FormControl mb={3}>
                        <FormLabel fontSize="sm">Коллектив постановки</FormLabel>
                        <Input
                            name="production_collective"
                            list="collectiveOptions"
                            placeholder="Труппа норильского народного театра"
                            value={currentPerformance.production_collective || ''}
                            onChange={handleInputChange}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        />
                        <datalist id="collectiveOptions">
                            {COLLECTIVE_OPTIONS.map(c => (
                                <option key={c} value={c} />
                            ))}
                        </datalist>
                        <Text mt={1} fontSize="xs" color="#AAAAAA">
                            Если пусто — «Труппа норильского народного театра».
                        </Text>
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize="sm">Год постановки</FormLabel>
                        <Input
                            name="production_year"
                            type="number"
                            placeholder="Если пусто — год премьеры / показа"
                            value={currentPerformance.production_year ?? ''}
                            onChange={(e) => setCurrentPerformance(prev => ({
                                ...prev,
                                production_year: e.target.value ? parseInt(e.target.value, 10) : null
                            }))}
                            focusBorderColor={primaryColor}
                            bg="#333333"
                            borderColor="#444444"
                            _hover={{ borderColor: '#555555' }}
                        />
                    </FormControl>
                </Box>
            ) : null}
        </>
    );
}
