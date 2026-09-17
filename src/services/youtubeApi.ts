const ROOT = '/api/youtube'

export class YoutubeApiError extends Error {
  constructor(message: string, public status: number) { super(message) }
}

export async function youtubeRequest<T>(path: string, options: { method?: string; body?: unknown; csrf?: string; signal?: AbortSignal } = {}): Promise<T> {
  const response = await fetch(ROOT + path, {
    method: options.method || 'GET', credentials: 'same-origin', signal: options.signal,
    headers: { Accept: 'application/json', ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(options.csrf ? { 'X-Leadhive-CSRF': options.csrf } : {}) },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  })
  const json = response.headers.get('content-type')?.includes('application/json')
  const data = json ? await response.json() : null
  if (!response.ok || !json) {
    throw new YoutubeApiError(typeof data?.detail === 'string' ? data.detail : 'YouTube Intelligence is currently unavailable. Please try again.', response.status)
  }
  return data as T
}
