import { act, renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { usePerformanceForm } from './usePerformanceForm';
import { OTHER_ACTOR } from './options';

jest.mock('axios', () => ({ __esModule: true, default: { get: jest.fn(), post: jest.fn(), put: jest.fn() } }));
jest.mock('@chakra-ui/react', () => ({ useToast: () => jest.fn(), useDisclosure: () => ({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() }) }));
const get = axios.get as jest.Mock;
const post = axios.post as jest.Mock;
const put = axios.put as jest.Mock;
beforeEach(() => {
    jest.clearAllMocks();
    get.mockImplementation((url: string) => Promise.resolve({ data: url.includes('/actors/') ? [{ id: 3, name: 'Актёр' }] : [{ id: 4, name: 'Режиссёр' }] }));
    post.mockResolvedValue({ data: { id: 7 } });
    put.mockResolvedValue({ data: { id: 7 } });
});

it('creates a performance with shows/tickets, actor, director, guest, team and gallery', async () => {
    const onSuccess = jest.fn(), onCancel = jest.fn();
    const { result } = renderHook(() => usePerformanceForm({ onSuccess, onCancel }));
    await waitFor(() => expect(result.current.actorOptions).toHaveLength(1));
    act(() => {
        result.current.setCurrentPerformance(prev => ({ ...prev, title: 'Премьера', author: 'Автор', genre: 'Драма', age_limit: '12+', description: 'Описание', duration: '', premiere_date: '' }));
        result.current.setNewShow({ show_datetime: '2026-11-20T19:00', ticket_url: ' https://tickets.example/show ' });
    });
    act(() => result.current.handleAddShow());
    for (const actor of ['a:3', 'd:4', OTHER_ACTOR]) {
        act(() => result.current.setNewCast({ actor, actor_name: 'Гость', role: ' Роль ' }));
        act(() => result.current.handleAddCast());
    }
    act(() => {
        result.current.handleAddGalleryImages(['https://images.example/1', 'https://images.example/2']);
        result.current.handleImageUpload('https://images.example/poster', 'image_url');
        result.current.handleListInputChange('production_team', ' Художник ');
    });
    act(() => {
        result.current.handleRemoveGalleryImage(0);
        result.current.handleAddToList('production_team');
    });
    await act(async () => result.current.handleCreatePerformance());
    expect(post).toHaveBeenCalledWith(expect.stringContaining('/perfomances/'), expect.objectContaining({
        title: 'Премьера', afisha: true, duration: null, premiere_date: null,
        shows: [{ show_datetime: '2026-11-20T19:00', ticket_url: 'https://tickets.example/show' }],
        cast: [
            { actor: 3, director: null, actor_name: 'Актёр', role: 'Роль' },
            { actor: null, director: 4, actor_name: 'Режиссёр', role: 'Роль' },
            { actor: null, director: null, actor_name: 'Гость', role: 'Роль' },
        ],
        production_team: ['Художник'], images_list: ['https://images.example/2'], image_url: 'https://images.example/poster',
    }));
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
});

it('updates an existing record while retaining show/cast IDs and theatre local time', async () => {
    const initialData = { id: 7, title: 'Старое', shows: [{ id: 8, show_datetime: '2026-11-20T19:00:00+07:00', ticket_url: 'https://tickets.example/8' }], cast: [{ id: 9, actor: 3, actor_name: 'Актёр', role: 'Роль' }], director: 4 };
    const { result } = renderHook(() => usePerformanceForm({ initialData, onSuccess: jest.fn(), onCancel: jest.fn() }));
    expect(result.current.currentPerformance.shows?.[0].show_datetime).toBe('2026-11-20T19:00');
    act(() => result.current.setCurrentPerformance(prev => ({ ...prev, title: 'Новое', afisha: false })));
    await act(async () => result.current.handleUpdatePerformance());
    expect(put).toHaveBeenCalledWith(expect.stringContaining('/perfomance7/'), expect.objectContaining({
        title: 'Новое', afisha: false, director: 4,
        shows: [expect.objectContaining({ id: 8, show_datetime: '2026-11-20T19:00', ticket_url: 'https://tickets.example/8' })],
        cast: [expect.objectContaining({ id: 9, actor: 3, role: 'Роль' })],
    }));
    expect(initialData.shows[0].show_datetime).toBe('2026-11-20T19:00:00+07:00');
});

it('keeps entered data and leaves form open after a failed save', async () => {
    put.mockRejectedValue(new Error('test network failure'));
    const loggedError = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
        const onSuccess = jest.fn(), onCancel = jest.fn();
        const { result } = renderHook(() => usePerformanceForm({ initialData: { id: 7, title: 'Несохранённое' }, onSuccess, onCancel }));
        await act(async () => result.current.handleUpdatePerformance());
        expect(result.current.currentPerformance.title).toBe('Несохранённое');
        expect(result.current.isSubmitting).toBe(false);
        expect(onSuccess).not.toHaveBeenCalled();
        expect(onCancel).not.toHaveBeenCalled();
        expect(loggedError).toHaveBeenCalled();
    } finally { loggedError.mockRestore(); }
});
