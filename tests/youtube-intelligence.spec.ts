import { expect, test, type Page } from '@playwright/test'

// Test-only contract fixtures: these never ship in the application.
async function stubService(page: Page, connected = false) {
  let running = false
  let selection: string[] = []
  let schedule = { mode: 'all', target_date: '', start_time: '', end_time: '' }
  let profile = { business_name: '', website: '', services: '', brand_tone: '', ai_rules: '' }
  const writes: { path: string; data: any }[] = []

  if (connected) {
    await page.addInitScript(() => window.localStorage.setItem('leadhive.youtube.channel_id', 'owned-channel'))
  }

  await page.route('**/*', async route => {
    const url = new URL(route.request().url())
    const path = url.pathname
    const method = route.request().method()
    const isYoutubePath = path === '/save-profile' || path === '/save-selected-videos' ||
      path.startsWith('/dashboard/') || path.startsWith('/analytics/') || path.startsWith('/api/logs/') ||
      path.startsWith('/api/update-schedule/') || path.startsWith('/api/toggle-bot/')

    if (!isYoutubePath) {
      await route.fallback()
      return
    }

    const data = method === 'GET' ? undefined : route.request().postDataJSON()
    if (method !== 'GET') writes.push({ path, data })

    let result: unknown = {}
    if (path.startsWith('/dashboard/')) {
      result = {
        channel: { id: 'owned-channel', title: 'Contract test channel', thumbnail: '', subscribers: '12', views: '60', videos: '1' },
        profile,
        selection,
        schedule,
        running,
        automation_ready: true,
        videos: [{ video_id: 'owned-video', title: 'Contract test upload', thumbnail: '' }],
      }
    }
    if (path === '/save-profile') { profile = data; result = { profile } }
    if (path === '/save-selected-videos') { selection = data.video_ids; result = { selection } }
    if (path.startsWith('/analytics/')) result = { videos: selection.length ? [{ video_id: 'owned-video', title: 'Contract test upload', thumbnail: '', views: 60, comments: 4, likes: 7 }] : [] }
    if (path.startsWith('/api/logs/')) result = { running, logs: [] }
    if (path.startsWith('/api/update-schedule/')) { schedule = data; result = { schedule } }
    if (path.startsWith('/api/toggle-bot/')) { running = data.running; result = { running } }

    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(result) })
  })
  return writes
}

test.use({ reducedMotion: 'reduce' })

test('connected workflow saves the original contracts and renders real returned metrics', async ({ page }) => {
  const writes = await stubService(page, true)
  await page.goto('/test-demo#channel')
  await page.getByRole('button', { name: 'Select', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Configure your AI persona')
  await expect(page.getByRole('button', { name: 'Save & Select Videos' })).toBeEnabled()
  await page.getByLabel('Business / Brand Name').fill('Contract test brand')
  await page.getByLabel('Website URL').fill('https://example.test')
  await page.getByLabel('Brand Tone').selectOption('Professional & Helpful')
  await page.getByLabel('Core Services').fill('Testing services')
  await page.getByLabel('Rules & Directives').fill('Testing rules')
  await page.getByRole('button', { name: 'Save & Select Videos' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Video library')
  await page.getByLabel('Select All').check()
  await page.getByRole('button', { name: 'Save & Open Dashboard' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your channel, understood.')
  await expect(page.locator('.yi-metric').filter({ hasText: 'Monitored views' }).locator('strong')).toHaveText('60')
  await page.screenshot({ path: 'test-results/youtube-dashboard-desktop.png', fullPage: true })
  await page.getByRole('button', { name: 'Open AI Command Center' }).click()
  await page.getByLabel('Automation Mode').selectOption('period')
  await page.getByLabel('Comment date (UTC)').fill('2026-09-15')
  await page.getByLabel('Start time (UTC)').fill('09:00')
  await page.getByLabel('End time (UTC)').fill('18:00')
  await page.getByRole('button', { name: 'Save mode settings' }).click()
  await expect(page.getByText('Settings saved.')).toBeVisible()
  await page.getByRole('button', { name: 'Start Automation', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  expect(writes.filter(write => write.path === '/api/toggle-bot/owned-channel')).toHaveLength(0)
  await page.getByRole('button', { name: 'Start replying' }).click()
  await expect(page.getByRole('button', { name: 'Stop Automation' })).toBeVisible()
  await page.getByRole('button', { name: 'Stop Automation' }).click()
  await expect(page.getByRole('button', { name: 'Start Automation', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'View Analytics' }).click()
  await expect(page.locator('tbody')).toContainText('Contract test upload')
  await page.getByRole('button', { name: 'Back to Overview' }).click()
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Video insights')
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Video insights')
  expect(writes.find(write => write.path === '/save-profile')?.data.business_name).toBe('Contract test brand')
  expect(writes.find(write => write.path === '/save-selected-videos')?.data.video_ids).toEqual(['owned-video'])
  expect(writes.find(write => write.path === '/api/update-schedule/owned-channel')?.data.mode).toBe('period')
})

for (const width of [1440, 1280, 1024, 768, 390, 360]) {
  test(`all module sections render without horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await stubService(page)
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    const headings: Record<string, string> = {
      platform: 'AI-PoweredYouTube Intelligence', channel: 'Your YouTube channel', persona: 'Configure your AI persona',
      content: 'Video library', dashboard: 'Your channel, understood.', 'command-center': 'Command Center', analytics: 'Video insights',
    }
    for (const [screen, heading] of Object.entries(headings)) {
      await page.goto('/test-demo#' + screen)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
      await expect(page.getByRole('link', { name: 'Exit Demo' })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
      const clipping = await page.locator('main button, main a, main input, main select').evaluateAll(elements => elements.filter(element => {
        const bounds = element.getBoundingClientRect()
        return bounds.width > 0 && (bounds.left < -1 || bounds.right > innerWidth + 1)
      }).map(element => element.textContent))
      expect(clipping).toEqual([])
      if ((width === 1440 || width === 390) && screen === 'platform') await page.screenshot({ path: `test-results/youtube-landing-${width}.png`, fullPage: true })
    }
    expect(errors).toEqual([])
  })
}

test('service errors are visible and retry recovers', async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem('leadhive.youtube.channel_id', 'owned-channel'))
  await page.route('**/dashboard/owned-channel', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ detail: 'Service temporarily unavailable' }) }))
  await page.goto('/test-demo')
  await expect(page.getByRole('alert')).toContainText('Service temporarily unavailable')
  await page.unroute('**/dashboard/owned-channel')
  await stubService(page, true)
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.getByRole('alert')).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Connect YouTube' })).toHaveAttribute('href', /\/auth\/youtube\/login$/)
})

test('homepage CTA, contact links, legal pages and exit work', async ({ page }) => {
  await stubService(page)
  await page.goto('/')
  await expect(page.locator('.hero-primary-cta')).toHaveText('Test Demo')
  await expect(page.locator('.hero-primary-cta')).toHaveAttribute('href', '/test-demo')
  await expect(page.locator('footer').getByRole('link', { name: 'Contact Us' })).toHaveAttribute('href', '/contact')
  await expect(page.locator('#contact')).toBeAttached()
  await page.locator('.hero-primary-cta').click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('AI-Powered')
  await page.getByRole('link', { name: 'Exit Demo' }).click()
  await expect(page).toHaveURL(/\/$/)
  for (const [path, title] of [['/privacy', 'Privacy Policy'], ['/terms', 'Terms of Use']]) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await expect(page.locator('#mobile-navigation').getByRole('link', { name: 'Test Demo' })).toHaveAttribute('href', '/test-demo')
})