const ROOT = '/api/youtube'
const YOUTUBE_API_BASE_URL = import.meta.env.VITE_YOUTUBE_API_URL?.replace(/\/$/, '') || ''

export class YoutubeApiError extends Error {
  constructor(message: string, public status: number) { super(message) }
}

function isChatPath(path: string) {
  return path === '/chat' || path.startsWith('/chat?')
}

function youtubeUrl(path: string) {
  if (isChatPath(path)) return YOUTUBE_API_BASE_URL ? YOUTUBE_API_BASE_URL + path : path
  return ROOT + path
}

async function responseBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null
  if (!response.headers.get('content-type')?.includes('application/json')) return text
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function detailMessage(data: unknown) {
  if (data && typeof data === 'object' && 'detail' in data) {
    const detail = (data as { detail: unknown }).detail
    if (typeof detail === 'string') return detail
  }
  return 'YouTube Intelligence is currently unavailable. Please try again.'
}

export async function youtubeRequest<T>(path: string, options: { method?: string; body?: unknown; csrf?: string; signal?: AbortSignal } = {}): Promise<T> {
  const url = youtubeUrl(path)
  let response: Response
  try {
    response = await fetch(url, {
      method: options.method || 'GET', credentials: isChatPath(path) ? 'omit' : 'same-origin', signal: options.signal,
      headers: { Accept: 'application/json', ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(options.csrf ? { 'X-Leadhive-CSRF': options.csrf } : {}) },
      ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    })
  } catch (error) {
    if (!options.signal?.aborted) console.error('[YouTube API] Request failed', { url, error })
    throw error
  }
  const data = await responseBody(response)
  if (!response.ok || data === null || typeof data === 'string') {
    console.error('[YouTube API] Unsuccessful response', { url, status: response.status, body: data })
    throw new YoutubeApiError(detailMessage(data), response.status)
  }
  return data as T
}
