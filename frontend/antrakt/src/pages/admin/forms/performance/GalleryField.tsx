import React from 'react';
import { Button, FormControl, FormLabel, Text, IconButton, Wrap, Box, Image, Center } from '@chakra-ui/react';
import { MotionBox, CFaPlus, CFaImage, CFaTrash, primaryColor } from './presentation';
import { AnimatePresence } from 'framer-motion';
import type { FormSectionProps } from './usePerformanceForm';

export default function GalleryField({ form }: FormSectionProps) {
    const { currentPerformance, isGalleryUploading, onOpen, handleRemoveGalleryImage } = form;
    return (
        <FormControl>
            <FormLabel display="flex" alignItems="center" gap={2}>
                <CFaImage color={primaryColor} />
                <Text as="span" fontWeight="semibold">Фотогалерея спектакля</Text>
            </FormLabel>

            <Box
                border="1px dashed"
                borderColor="gray.600"
                borderRadius="md"
                p={4}
                mb={4}
                bg="rgba(30, 30, 30, 0.5)"
            >
                {currentPerformance.images_list?.length ? (
                    <Wrap spacing={3} mb={4}>
                        <AnimatePresence>
                            {currentPerformance.images_list.map((url, index) => (
                                <MotionBox
                                    key={index}
                                    position="relative"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Image
                                        src={url}
                                        boxSize="100px"
                                        objectFit="cover"
                                        borderRadius="md"
                                        border="1px solid"
                                        borderColor="gray.600"
                                    />
                                    <IconButton
                                        aria-label="Удалить фото"
                                        icon={<CFaTrash />}
                                        size="xs"
                                        position="absolute"
                                        top="-8px"
                                        right="-8px"
                                        borderRadius="full"
                                        bg="red.500"
                                        color="white"
                                        _hover={{ bg: 'red.600' }}
                                        onClick={() => handleRemoveGalleryImage(index)}
                                    />
                                </MotionBox>
                            ))}
                        </AnimatePresence>
                    </Wrap>
                ) : (
                    <Center minH="100px" color="gray.500" fontSize="sm">
                        Нет загруженных фотографий
                    </Center>
                )}

                <Button
                    leftIcon={<CFaPlus />}
                    colorScheme="teal"
                    variant="outline"
                    onClick={onOpen}
                    isLoading={isGalleryUploading}
                    w="full"
                >
                    Добавить фотографию
                </Button>
            </Box>
        </FormControl>
    );
}
