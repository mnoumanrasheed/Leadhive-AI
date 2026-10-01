import { useEffect } from 'react'

/**
 * Compatibility component for handling OAuth return redirects from the backend.
 * Backend redirects to /dashboard/:channelId?auth=success or /dashboard?auth=failed.
 * This component immediately replaces the URL with /test-demo?auth=...&channel_id=...
 * so the user lands seamlessly in Test Demo without seeing the homepage.
 */
export function YouTubeOAuthReturn() {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const auth = searchParams.get('auth')
    const pathname = window.location.pathname

    // Extract channelId if present: /dashboard/:channelId
    let channelId: string | null = null
    const match = pathname.match(/\/dashboard\/([^/]+)/)
    if (match && match[1]) {
      channelId = decodeURIComponent(match[1])
    }

    const targetParams = new URLSearchParams()
    if (auth) {
      targetParams.set('auth', auth)
    }
    if (channelId) {
      targetParams.set('channel_id', channelId)
    }

    const queryString = targetParams.toString()
    const targetUrl = `/test-demo${queryString ? `?${queryString}` : ''}${window.location.hash}`

    // Immediately replace location entry so browser Back button does not loop on /dashboard
    window.location.replace(targetUrl)
  }, [])

  return null
}
