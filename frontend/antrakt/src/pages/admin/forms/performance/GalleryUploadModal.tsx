import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import ImageUpload from '../../../../components/ImageUpload';
import type { FormSectionProps } from './usePerformanceForm';

export default function GalleryUploadModal({ form }: FormSectionProps) {
    const { isSubmitting, isOpen, onClose, handleAddGalleryImage, handleAddGalleryImages } = form;
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent bg="gray.800" color="white">
                <ModalHeader>Добавить фотографии в галерею</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <ImageUpload
                        currentImageUrl={null}
                        multiple
                        onImageUpload={handleAddGalleryImage}
                        onImagesUpload={(imageUrls) => {
                            handleAddGalleryImages(imageUrls);
                            onClose();
                        }}
                        onImageRemove={() => { }}
                        contentType="perfomances"
                        maxSize={10}
                        disabled={isSubmitting}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={onClose}>
                        Отмена
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
