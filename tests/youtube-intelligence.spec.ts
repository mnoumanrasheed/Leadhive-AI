import { expect, test, type Page } from '@playwright/test'

// Test-only contract fixtures: these never ship in the application.
async function stubService(page: Page, connected = false) {
  let selected: string | null = null
  let running = false
  let selection: string[] = []
  let profile = { business_name: '', website: '', services: '', brand_tone: '', ai_rules: '' }
  const writes: { path: string; data: any }[] = []
  await page.route('**/api/youtube/**', async route => {
    const path = new URL(route.request().url()).pathname.replace('/api/youtube', '')
    const method = route.request().method()
    const data = route.request().postDataJSON()
    if (method !== 'GET') writes.push({ path, data })
    let result: unknown = {}
    if (path === '/session') result = { selected, csrf: 'fixture-csrf', channels: connected ? [{ id: 'owned-channel', title: 'Contract test channel', thumbnail: '', subscribers: '12', views: '60', videos: '1' }] : [] }
    if (path === '/channel') { selected = data.channel; result = { selected } }
    if (path === '/workspace') result = { profile, selection, schedule: { mode: 'all', target_date: '', start_time: '', end_time: '' }, running, automation_ready: true }
    if (path === '/profile') { profile = data; result = { profile } }
    if (path === '/videos') result = { videos: [{ video_id: 'owned-video', title: 'Contract test upload', thumbnail: '' }] }
    if (path === '/selection') { selection = data.video_ids; result = { selection } }
    if (path === '/analytics') result = { videos: selection.length ? [{ video_id: 'owned-video', title: 'Contract test upload', thumbnail: '', views: 60, comments: 4, likes: 7 }] : [] }
    if (path === '/activity') result = { running, logs: [] }
    if (path === '/automation') { running = data.running; result = { running } }
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
  expect(writes.filter(write => write.path === '/automation')).toHaveLength(0)
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
  expect(writes.find(write => write.path === '/profile')?.data.business_name).toBe('Contract test brand')
  expect(writes.find(write => write.path === '/selection')?.data.video_ids).toEqual(['owned-video'])
  expect(writes.find(write => write.path === '/schedule')?.data.mode).toBe('period')
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
  await page.route('**/api/youtube/session', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ detail: 'Service temporarily unavailable' }) }))
  await page.goto('/test-demo')
  await expect(page.getByRole('alert')).toContainText('Service temporarily unavailable')
  await page.unroute('**/api/youtube/session')
  await stubService(page)
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.getByRole('alert')).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Connect YouTube' })).toHaveAttribute('href', '/api/youtube/auth/login')
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
