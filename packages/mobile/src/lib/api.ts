const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001') + '/api';

function getToken(): string | null {
  return null; // TODO: integrate with SecureStore/AsyncStorage
}

async function request(method: string, path: string, body?: unknown) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as any).message || 'Request failed');
  }
  return res.json();
}

export const api = {
  get: (path: string) => request('GET', path),
  post: (path: string, body: unknown) => request('POST', path, body),
  patch: (path: string, body: unknown) => request('PATCH', path, body),
  delete: (path: string) => request('DELETE', path),
};
