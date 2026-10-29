import DirectorFields from './DirectorFields';
import PerformanceImageField from './PerformanceImageField';
import React from 'react';
import { FormControl, FormLabel, Input, Select, Switch, Text } from '@chakra-ui/react';
import { CFaTheaterMasks, CFaUser, CFaCalendar, CFaClock, CFaImage, CFaChild, primaryColor } from './presentation';
import { genres, ageLimits } from './options';
import type { FormSectionProps } from './usePerformanceForm';

export default function MainFields({ form }: FormSectionProps) {
    const { currentPerformance, setCurrentPerformance, handleInputChange } = form;
    return (
        <>
            <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2}>
                    <CFaTheaterMasks color={primaryColor} />
                    <Text as="span" fontWeight="semibold">Название спектакля</Text>
                </FormLabel>
                <Input
                    name="title"
                    placeholder="Название спектакля"
                    value={currentPerformance.title || ''}
                    onChange={handleInputChange}
                    focusBorderColor={primaryColor}
                    bg="#333333"
                    borderColor="#444444"
                    _hover={{ borderColor: '#555555' }}
                />
            </FormControl>
            <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2}>
                    <CFaUser color={primaryColor} />
                    <Text as="span" fontWeight="semibold">Автор спектакля</Text>
                </FormLabel>
                <Input
                    name="author"
                    placeholder="Автор пьесы"
                    value={currentPerformance.author || ''}
                    onChange={handleInputChange}
                    focusBorderColor={primaryColor}
                    bg="#333333"
                    borderColor="#444444"
                    _hover={{ borderColor: '#555555' }}
                />
            </FormControl>
            <DirectorFields form={form} />
            <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2}>
                    <CFaCalendar color={primaryColor} />
                    <Text as="span" fontWeight="semibold">Дата премьеры</Text>
                </FormLabel>
                <Input
                    name="premiere_date"
                    type="date"
                    value={currentPerformance.premiere_date || ''}
                    onChange={handleInputChange}
                    focusBorderColor={primaryColor}
                    bg="#333333"
                    borderColor="#444444"
                    _hover={{ borderColor: '#555555' }}
                />
            </FormControl>
            <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2}>
                    <CFaClock color={primaryColor} />
                    <Text as="span" fontWeight="semibold">Продолжительность (HH:MM:SS)</Text>
                </FormLabel>
                <Input
                    name="duration"
                    type="time"
                    step="1"
                    placeholder="Продолжительность (HH:MM:SS)"
                    value={currentPerformance.duration || ''}
                    onChange={handleInputChange}
                    focusBorderColor={primaryColor}
                    bg="#333333"
                    borderColor="#444444"
                    _hover={{ borderColor: '#555555' }}
                />
            </FormControl>
            <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2}>
                    <CFaTheaterMasks color={primaryColor} />
                    <Text as="span" fontWeight="semibold">Жанр</Text>
                </FormLabel>
                <Input
                    name="genre"
                    placeholder="Введите жанр"
                    value={currentPerformance.genre || ''}
                    onChange={handleInputChange}
                    list="genres"
                    focusBorderColor={primaryColor}
                    bg="#333333"
                    borderColor="#444444"
                    _hover={{ borderColor: '#555555' }}
                />
                <datalist id="genres">
                    {genres.map(genre => (
                        <option key={genre} value={genre} />
                    ))}
                </datalist>
            </FormControl>
            <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2}>
                    <CFaChild color={primaryColor} />
                    <Text as="span" fontWeight="semibold">Возрастное ограничение</Text>
                </FormLabel>
                <Select
                    name="age_limit"
                    value={currentPerformance.age_limit || ''}
                    onChange={handleInputChange}
                    focusBorderColor={primaryColor}
                    bg="#333333"
                    borderColor="#444444"
                    _hover={{ borderColor: '#555555' }}
                >
                    <option value="" style={{ backgroundColor: '#333333', color: 'white' }}>Выберите ограничение</option>
                    {ageLimits.map(limit => (
                        <option key={limit} value={limit} style={{ backgroundColor: '#333333', color: 'white' }}>{limit}</option>
                    ))}
                </Select>
            </FormControl>
            <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="afisha" mb="0" fontWeight="semibold">
                    Статус спектакля
                </FormLabel>
                <Switch
                    id="afisha"
                    isChecked={currentPerformance.afisha}
                    onChange={(e) => setCurrentPerformance(prev => ({
                        ...prev,
                        afisha: e.target.checked
                    }))}
                    colorScheme="green"
                />
                <Text ml={3} color={currentPerformance.afisha ? "green.300" : "purple.300"}>
                    {currentPerformance.afisha ? "В 'Афиша'" : "В 'Спектакли'"}
                </Text>
            </FormControl>
            {currentPerformance.afisha && (
                <FormControl>
                    <FormLabel display="flex" alignItems="center" gap={2}>
                        <CFaImage color={primaryColor} />
                        <Text as="span" fontWeight="semibold">Ссылка на покупку билетов</Text>
                    </FormLabel>
                    <Input
                        name="ticket_url"
                        type="url"
                        placeholder="https://example.com/your-ticket-link"
                        value={currentPerformance.ticket_url || ''}
                        onChange={handleInputChange}
                        focusBorderColor={primaryColor}
                        bg="#333333"
                        borderColor="#444444"
                        _hover={{ borderColor: '#555555' }}
                    />
                </FormControl>
            )}
            <PerformanceImageField form={form} field="performances_image" label="Фото спектакля" />
        </>
    );
}
