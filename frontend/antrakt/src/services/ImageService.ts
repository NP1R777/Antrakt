import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface ImageUploadResponse {
    success: boolean;
    image_url: string;
    message: string;
}

export interface ImageDeleteResponse {
    success: boolean;
    message: string;
}

class ImageService {
    /**
     * Загрузка изображения в MinIO
     */
    async uploadImage(file: File, folder: string = 'images'): Promise<string> {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('folder', folder);

            const response: AxiosResponse<ImageUploadResponse> = await axios.post(
                `${API_BASE_URL}/upload-image/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                return response.data.image_url;
            } else {
                throw new Error(response.data.message || 'Ошибка загрузки изображения');
            }
        } catch (error) {
            console.error('Ошибка загрузки изображения:', error);
            throw error;
        }
    }

    /**
     * Удаление изображения из MinIO
     */
    async deleteImage(imageUrl: string): Promise<boolean> {
        try {
            const response: AxiosResponse<ImageDeleteResponse> = await axios.delete(
                `${API_BASE_URL}/delete-image/?image_url=${encodeURIComponent(imageUrl)}`
            );

            return response.data.success;
        } catch (error) {
            console.error('Ошибка удаления изображения:', error);
            return false;
        }
    }

    /**
     * Валидация файла изображения
     */
    validateImageFile(file: File): { isValid: boolean; error?: string } {
        // Проверка типа файла
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                error: 'Неподдерживаемый тип файла. Разрешены только изображения (JPEG, PNG, GIF, WebP).'
            };
        }

        // Проверка размера файла (10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB в байтах
        if (file.size > maxSize) {
            return {
                isValid: false,
                error: 'Размер файла превышает 10MB.'
            };
        }

        return { isValid: true };
    }

    /**
     * Создание предварительного просмотра изображения
     */
    createImagePreview(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    resolve(e.target.result as string);
                } else {
                    reject(new Error('Не удалось создать предварительный просмотр'));
                }
            };
            reader.onerror = () => reject(new Error('Ошибка чтения файла'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Получение папки для сохранения в зависимости от типа контента
     */
    getFolderByContentType(contentType: string): string {
        const folderMap: Record<string, string> = {
            'perfomances': 'perfomances',
            'actors': 'actors',
            'directors': 'directors',
            'news': 'news',
            'archive': 'archive',
            'achievements': 'achievements'
        };

        return folderMap[contentType] || 'images';
    }

    /**
     * Обработка ошибок загрузки изображения
     */
    handleUploadError(error: any): string {
        if (error.response?.data?.error) {
            return error.response.data.error;
        } else if (error.message) {
            return error.message;
        } else {
            return 'Произошла неизвестная ошибка при загрузке изображения';
        }
    }
}

export default new ImageService();