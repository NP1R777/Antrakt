export {};

jest.mock('axios', () => ({
  __esModule: true,
  default: Object.assign(jest.fn().mockResolvedValue({ data: { ok: true } }), {
    create: jest.fn(() => ({ post: jest.fn() })),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  }),
}));

describe('revoked sessions', () => {
  let axios: any;
  let service: any;
  let refreshClient: any;
  const access = () => `header.${btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))}.signature`;

  beforeEach(async () => {
    jest.resetModules();
    jest.useFakeTimers();
    localStorage.clear();
    axios = require('axios').default;
    service = require('./AuthService').default;
    refreshClient = axios.create.mock.results[0].value;
    axios.post.mockResolvedValue({ data: { access: access(), refresh: 'refresh-one' } });
    await service.login('user@test.com', 'password');
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    localStorage.clear();
  });

  it('clears a revoked session without recursive refresh or logout requests', async () => {
    const ended = jest.fn();
    window.addEventListener('auth:logout', ended);
    const onError = axios.interceptors.response.use.mock.calls[0][1];
    const revoked = new Error('revoked');
    refreshClient.post.mockRejectedValue(revoked);
    await expect(onError({ response: { status: 401 }, config: { url: '/token/verify/' } })).rejects.toBe(revoked);
    expect(refreshClient.post).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(ended).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledTimes(1); // Only the original login.
    window.removeEventListener('auth:logout', ended);
  });

  it('does not refresh a rejected login', async () => {
    const onError = axios.interceptors.response.use.mock.calls[0][1];
    const error = { response: { status: 401 }, config: { url: 'http://localhost:8000/login/' } };
    await expect(onError(error)).rejects.toBe(error);
    expect(refreshClient.post).not.toHaveBeenCalled();
  });

  it('rotates a valid session and retries the original request with the new access token', async () => {
    const onError = axios.interceptors.response.use.mock.calls[0][1];
    const renewed = access();
    refreshClient.post.mockResolvedValue({ data: { access: renewed, refresh: 'refresh-two' } });
    const original = { url: '/my/reviews/', headers: {} };
    await expect(onError({ response: { status: 401 }, config: original })).resolves.toEqual({ data: { ok: true } });
    expect(axios).toHaveBeenCalledWith(expect.objectContaining({
      headers: { Authorization: `Bearer ${renewed}` }, _retry: true,
    }));
    expect(localStorage.getItem('refresh_token')).toBe('refresh-two');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('shares one refresh across concurrent failed requests', async () => {
    const onError = axios.interceptors.response.use.mock.calls[0][1];
    let rejectRefresh!: (error: Error) => void;
    refreshClient.post.mockReturnValue(new Promise((_, reject) => { rejectRefresh = reject; }));
    const first = onError({ response: { status: 401 }, config: { url: '/my/reviews/' } });
    const second = onError({ response: { status: 401 }, config: { url: '/token/verify/' } });
    expect(refreshClient.post).toHaveBeenCalledTimes(1);
    const results = Promise.allSettled([first, second]);
    rejectRefresh(new Error('revoked'));
    expect((await results).map(result => result.status)).toEqual(['rejected', 'rejected']);
  });

  it('does not restore a session when a pending refresh completes after logout', async () => {
    const onError = axios.interceptors.response.use.mock.calls[0][1];
    let resolveRefresh!: (value: unknown) => void;
    refreshClient.post.mockReturnValueOnce(new Promise(resolve => { resolveRefresh = resolve; }));
    const pending = onError({ response: { status: 401 }, config: { url: '/token/verify/' } });
    refreshClient.post.mockResolvedValueOnce({ data: {} });
    await service.logout();
    const result = expect(pending).rejects.toThrow('Сеанс изменился');
    resolveRefresh({ data: { access: access(), refresh: 'refresh-two' } });
    await result;
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});
