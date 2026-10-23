import axios from 'axios';
import ImageService from './ImageService';

jest.mock('axios', () => ({ __esModule: true, default: { post: jest.fn() } }));
const post = axios.post as jest.Mock;

beforeEach(() => post.mockReset());

it('shows server image validation and permission errors to the caller', async () => {
    post.mockRejectedValueOnce({ response: { data: { image: ['Файл повреждён.'] } } });
    await expect(ImageService.uploadImage(new File(['bad'], 'fake.png'))).rejects.toThrow('Файл повреждён.');
    post.mockRejectedValueOnce({ response: { data: { error: 'Можно загружать только свой аватар' } } });
    await expect(ImageService.uploadImage(new File(['bad'], 'fake.png'))).rejects.toThrow('Можно загружать только свой аватар');
});

it('returns the server-normalized URL rather than the original filename', async () => {
    post.mockResolvedValueOnce({ data: { success: true, image_url: 'https://media.example/images/normalized.webp' } });
    await expect(ImageService.uploadImage(new File(['pixels'], 'original.png'))).resolves.toBe('https://media.example/images/normalized.webp');
});
