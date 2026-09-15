import { expect, test, type Page } from '@playwright/test'
import { demoService, getLeadStatus, validatePersona } from '../src/services/demoService'
import { defaultPersona, demoContents } from '../src/data/demoData'
import type { ActivityStage } from '../src/types/demo'

const widths = [1440, 1280, 1024, 768, 430, 390]

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  const escaped = await page
    .locator('.td-app main button, .td-panel, .td-platform-card, .td-content-card')
    .evaluateAll((elements) =>
      elements
        .filter((element) => {
          const rect = element.getBoundingClientRect()
          return rect.width > 0 && (rect.right > window.innerWidth + 1 || rect.left < -1)
        })
        .map((element) => element.className),
    )
  expect(escaped).toEqual([])
}
async function beginSetup(page: Page) {
  await page.goto('/test-demo')
  await expect(
    page.getByRole('heading', { name: 'Experience LeadHive AI in Action' }),
  ).toBeVisible()
  await page.getByRole('button', { name: /YouTube/ }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByText('Step 2 of 4')).toBeVisible()
  await page.getByRole('button', { name: /LeadHive Demo Channel/ }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Configure Your AI' })).toBeVisible()
}
async function launch(page: Page) {
  await beginSetup(page)
  await page.getByRole('button', { name: 'Save Persona & Continue' }).click()
  await page.getByRole('button', { name: 'Launch AI Demo' }).click()
  await expect(page.getByRole('heading', { name: 'AI Command Center', exact: true })).toBeVisible()
}
async function advance(page: Page, count: number) {
  for (let tick = 0; tick < count; tick++) {
    await page.clock.runFor(1800)
    await page.evaluate(() => new Promise<void>((resolve) => queueMicrotask(resolve)))
  }
}

test('local rules, stage-aware analytics and repeatable data', () => {
  expect([0, 54, 55, 79, 80, 100].map(getLeadStatus)).toEqual([
    'Low Intent',
    'Low Intent',
    'Nurture',
    'Nurture',
    'Qualified',
    'Qualified',
  ])
  expect(validatePersona(defaultPersona)).toEqual({})
  for (const website of ['example.com', 'javascript:alert(1)', 'https://'])
    expect(validatePersona({ ...defaultPersona, website }).website).toBeTruthy()
  expect(validatePersona({ ...defaultPersona, businessName: '  ' }).businessName).toBeTruthy()
  const interactions = demoService.getInteractions(
    demoContents.map((item) => item.id),
    defaultPersona,
  )
  expect(interactions).toHaveLength(7)
  expect(
    demoService.getInteractions(['overview'], defaultPersona).map((item) => item.name),
  ).toEqual(['John D.', 'Hassan A.'])
  const events = interactions.flatMap((item, index) =>
    Array.from({ length: 8 }, (_, stage) =>
      demoService.createEvent(item, stage as ActivityStage, index * 8 + stage),
    ),
  )
  expect(events).toEqual(
    interactions.flatMap((item, index) =>
      Array.from({ length: 8 }, (_, stage) =>
        demoService.createEvent(item, stage as ActivityStage, index * 8 + stage),
      ),
    ),
  )
  expect(demoService.getAnalytics(demoService.getLeads(interactions, events))).toEqual({
    leadsDetected: 7,
    aiResponses: 7,
    qualifiedLeads: 4,
    averageLeadScore: 72,
    qualificationRate: 57.1,
    distribution: { Qualified: 4, Nurture: 2, 'Low Intent': 1 },
  })
  expect(
    demoService.getAnalytics(demoService.getLeads(interactions, events.slice(0, 3)))
      .averageLeadScore,
  ).toBe(0)
  expect(demoService.getAnalytics([]).leadsDetected).toBe(0)
})

test('homepage CTA, direct route refresh, navigation and preserved contact form', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('#contact form')).toHaveCount(1)
  await expect(page.locator('#home')).toBeVisible()
  await page.locator('.hero-primary-cta').click()
  await expect(page).toHaveURL(/\/test-demo$/)
  await expect(page.getByText('Step 1 of 4')).toBeVisible()
  await page.reload()
  await expect(page.getByText('Step 1 of 4')).toBeVisible()
  await page.getByRole('link', { name: 'Back to Website' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.locator('#contact form')).toHaveCount(1)
})

test('validation, keyboard selection, back navigation and selected-content filtering', async ({
  page,
}) => {
  await page.goto('/test-demo')
  await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeDisabled()
  for (const platform of ['WhatsApp', 'Instagram', 'Facebook'])
    await expect(page.getByRole('button', { name: new RegExp(platform) })).toBeDisabled()
  await page.getByRole('button', { name: /YouTube/ }).focus()
  await page.keyboard.press('Space')
  await expect(page.getByRole('button', { name: /YouTube/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: /LeadHive Demo Channel/ }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByLabel('Business / Brand Name').fill('  ')
  await page.getByLabel('Website URL').fill('invalid-url')
  await page.getByRole('button', { name: 'Save Persona & Continue' }).click()
  await expect(page.getByLabel('Business / Brand Name')).toBeFocused()
  await expect(page.getByText('Please complete this field.')).toBeVisible()
  await expect(page.getByText('Enter a full website URL', { exact: false })).toBeVisible()
  await page.getByLabel('Business / Brand Name').fill('Acme Studio')
  await page.getByLabel('Website URL').fill('https://acme.example')
  await page.getByLabel('Brand Tone', { exact: true }).selectOption('Friendly')
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(page.getByRole('button', { name: /LeadHive Demo Channel/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByLabel('Business / Brand Name')).toHaveValue('Acme Studio')
  await page.getByRole('button', { name: 'Save Persona & Continue' }).click()
  await page.getByLabel('Select All', { exact: true }).uncheck()
  await expect(page.getByRole('button', { name: 'Launch AI Demo' })).toBeDisabled()
  await page.getByLabel('Select LeadHive Overview', { exact: true }).check()
  await page.getByRole('button', { name: 'Launch AI Demo' }).click()
  await page.clock.install()
  await page.getByRole('button', { name: 'Start AI Demo' }).click()
  await advance(page, 18)
  await expect(page.locator('.td-automation-status')).toHaveText('Complete')
  await expect(page.locator('.td-activity-card')).toHaveCount(2)
  await expect(page.locator('.td-activity-card').first()).toContainText('John D.')
  await expect(page.locator('.td-ai-reply').first()).toContainText('Happy to help!')
  await expect(page.locator('.td-ai-reply').first()).toContainText('Acme Studio')
  await expect(page.locator('.td-stream-viewport')).toBeVisible()
})

test('start, staged activity, pause, resume, analytics, reset and replay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const errors: string[] = []
  const apiRequests: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('request', (request) => {
    if (['fetch', 'xhr'].includes(request.resourceType())) apiRequests.push(request.url())
  })
  await launch(page)
  await page.getByRole('button', { name: 'View Analytics' }).click()
  await expect(page.getByRole('heading', { name: 'AI Engagement Analytics' })).toBeVisible()
  await expect(page.getByText('Your leads will appear here')).toBeVisible()
  await page.getByRole('button', { name: 'Command Center', exact: true }).last().click()
  await page.clock.install()
  await page.getByRole('button', { name: 'Start AI Demo' }).click()
  await page.clock.runFor(1450)
  await expect(page.locator('.td-activity-card')).toHaveCount(1)
  await expect(page.locator('.td-activity-card').first()).toContainText('Sarah M.')
  await page.getByRole('button', { name: 'Pause Automation', exact: true }).click()
  const before = await page.locator('.td-activity-card').allTextContents()
  await page.clock.runFor(10000)
  expect(await page.locator('.td-activity-card').allTextContents()).toEqual(before)
  await expect(page.locator('.td-automation-status')).toHaveText('Paused')
  await page.getByRole('button', { name: 'Resume Automation' }).click()
  await advance(page, 7)
  await expect(page.locator('.td-activity-card').first()).toContainText('86')
  await expect(page.locator('.td-activity-card').first()).toContainText('Qualified')
  await page.getByRole('button', { name: 'View Analytics' }).click()
  await expect(page.getByRole('heading', { name: 'AI Engagement Analytics' })).toBeVisible()
  await advance(page, 50)
  await expect(page.locator('.td-automation-status')).toHaveText('Complete')
  const values = await page.locator('.td-metric > strong').allTextContents()
  expect(values).toEqual(['7', '7', '4', '72/100', '57.1%'])
  await expect(page.locator('.td-lead-table tbody tr')).toHaveCount(7)
  await page.getByRole('button', { name: 'Reset Demo', exact: true }).click()
  expect(await page.locator('.td-metric > strong').allTextContents()).toEqual([
    '0',
    '0',
    '0',
    '0/100',
    '0%',
  ])
  await expect(page.locator('.td-automation-status')).toHaveText('Ready')
  await page.getByRole('button', { name: 'Command Center', exact: true }).last().click()
  await page.getByRole('button', { name: 'Start AI Demo' }).click()
  await advance(page, 1)
  await expect(page.locator('.td-activity-card').first()).toContainText('Sarah M.')
  await page.getByRole('button', { name: 'Reset Demo', exact: true }).click()
  await advance(page, 3)
  await expect(page.locator('.td-activity-card')).toHaveCount(0)
  expect(errors).toEqual([])
  expect(apiRequests).toEqual([])
})

for (const width of widths) {
  test('responsive flow at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/test-demo')
    await noOverflow(page)
    await page.screenshot({ path: 'test-results/platform-' + width + '.png', fullPage: true })
    await page.getByRole('button', { name: /YouTube/ }).click()
    await page.getByRole('button', { name: 'Continue', exact: true }).click()
    await expect(page.getByText('Step 2 of 4')).toBeVisible()
    await noOverflow(page)
    await page.getByRole('button', { name: /LeadHive Demo Channel/ }).click()
    await page.getByRole('button', { name: 'Continue', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Configure Your AI' })).toBeVisible()
    await noOverflow(page)
    await page.screenshot({ path: 'test-results/persona-' + width + '.png', fullPage: true })
    await page.getByRole('button', { name: 'Save Persona & Continue' }).click()
    await expect(page.getByText('Step 4 of 4')).toBeVisible()
    await noOverflow(page)
    await page.screenshot({ path: 'test-results/content-' + width + '.png', fullPage: true })
    await page.getByRole('button', { name: 'Launch AI Demo' }).click()
    await expect(
      page.getByRole('heading', { name: 'AI Command Center', exact: true }),
    ).toBeVisible()
    await noOverflow(page)
    await page.clock.install()
    await page.getByRole('button', { name: 'Start AI Demo' }).click()
    await advance(page, 56)
    await expect(page.locator('.td-automation-status')).toHaveText('Complete')
    await noOverflow(page)
    await page.screenshot({ path: 'test-results/command-' + width + '.png', fullPage: true })
    const gap = await page
      .locator('.td-stream-viewport')
      .evaluate((element) => element.scrollHeight - element.scrollTop - element.clientHeight)
    expect(gap).toBeLessThan(5)
    await page.getByRole('button', { name: 'View Analytics' }).click()
    await expect(page.getByRole('heading', { name: 'AI Engagement Analytics' })).toBeVisible()
    await noOverflow(page)
    await page.screenshot({ path: 'test-results/analytics-' + width + '.png', fullPage: true })
  })
}
