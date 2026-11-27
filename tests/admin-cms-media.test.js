import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm, unlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { randomBytes } from 'node:crypto'

test('admin can upload images and fully manage website branding, hero, about, and details', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'mubsa-cms-test-'))
  process.env.DATA_DIR = dir
  const { createApiServer, setRuntimeEnv } = await import('../server/index.js')
  const password = randomBytes(20).toString('hex')
  setRuntimeEnv({
    ADMIN_EMAIL: 'admin@example.test',
    ADMIN_PASSWORD: password,
    ADMIN_SESSION_SECRET: randomBytes(32).toString('hex')
  })
  const server = createApiServer()
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  let cookie = ''
  let uploadedUrl = ''

  async function call(path, method = 'GET', body, auth = false) {
    const response = await fetch(base + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? { Cookie: cookie } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    })
    return {
      status: response.status,
      data: await response.json().catch(() => ({})),
      cookie: response.headers.get('set-cookie')
    }
  }

  try {
    // 1. Sign in as admin
    const login = await call('/api/admin/login', 'POST', { email: 'admin@example.test', password })
    assert.equal(login.status, 200)
    cookie = login.cookie.split(';')[0]

    // 2. Upload test image to media repository
    // Tiny 1x1 transparent PNG base64
    const samplePng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    const uploadRes = await call('/api/admin/upload', 'POST', {
      filename: 'custom-hero.png',
      data: samplePng
    }, true)
    assert.equal(uploadRes.status, 201)
    assert.ok(uploadRes.data.url)
    assert.match(uploadRes.data.url, /^\/uploads\/\d+-[a-f0-9-]+-custom-hero\.png$/)
    uploadedUrl = uploadRes.data.url
    const uploadedMediaId = uploadRes.data.item.id

    // 3. Media library list contains the uploaded asset
    const mediaList = await call('/api/admin/media', 'GET', null, true)
    assert.equal(mediaList.status, 200)
    assert.ok(Array.isArray(mediaList.data.items))
    assert.ok(mediaList.data.items.some(m => m.url === uploadedUrl))

    // 4. Update website details & images via PUT /api/admin/content
    const updatePayload = {
      brand: {
        name: 'Apex Market Institute',
        shortName: 'Apex Institute',
        tagline: 'Mastering Market Dynamics',
        descriptor: 'FINANCIAL RESEARCH & EDUCATION',
        logo: uploadedUrl,
        favicon: '/favicon.svg',
        headerCtaLabel: 'EXPLORE APEX',
        headerCtaUrl: 'https://t.me/apexmarket'
      },
      hero: {
        kicker: 'STRATEGIC RISK & INTELLIGENCE',
        title: 'Master the charts.\nControl the risk.',
        text: 'Customized educational curriculum focusing on market mechanics and institutional frameworks.',
        image: uploadedUrl,
        workshopImage: uploadedUrl,
        primaryCtaText: 'Join Masterclass',
        primaryCtaLink: '/webinar',
        secondaryCtaText: 'Explore Curriculums',
        secondaryCtaLink: '/courses',
        communityCtaText: 'The VIP Desk',
        badgeText: 'INSTITUTIONAL GRADE'
      },
      about: {
        founderName: 'Ahmad Mubarak',
        founderRole: 'Chief Market Strategist',
        founderImage: uploadedUrl,
        founderMentorImage: uploadedUrl,
        founderBio: 'Over a decade of trading and instructional experience in Dubai and global equity markets.',
        founderQuote: 'Risk awareness precedes all market success.',
        visionTitle: 'OUR ASPIRATION',
        visionText: 'Empower everyday investors through disciplined market analysis.',
        missionTitle: 'OUR CHARTER',
        missionText: 'Deliver uncompromised financial education.',
        engineeringStoryTitle: 'A Decade of Precision Engineering',
        engineeringStoryText: 'Senior systems engineering foundation applied to algorithmic financial analysis.'
      },
      stats: [
        { number: '8+', label: 'Years of Trading Strategy' },
        { number: '150+', label: 'Executive Seminars' }
      ],
      stages: [
        { number: '01', title: 'Foundation', text: 'Build strong price action intuition.' },
        { number: '02', title: 'Execution', text: 'Master order blocks and liquidity.' }
      ],
      community: {
        title: 'WE SUCCEED TOGETHER.',
        text: 'Join our private trading channel for daily market prep.',
        buttonLabel: 'Join Private Channel',
        buttonUrl: 'https://t.me/apexmarket'
      },
      footer: {
        description: 'Apex Market Institute provides research-driven education.',
        disclaimer: 'Educational purposes only. No trading signals.',
        copyright: 'Apex Market Institute. All rights reserved.'
      }
    }

    const saveRes = await call('/api/admin/content', 'PUT', updatePayload, true)
    assert.equal(saveRes.status, 200)

    // 5. Fetch public site-content and verify all changes are live
    const publicSite = await call('/api/site-content', 'GET')
    assert.equal(publicSite.status, 200)
    const liveContent = publicSite.data.content

    // Verify brand
    assert.equal(liveContent.brand.name, 'Apex Market Institute')
    assert.equal(liveContent.brand.tagline, 'Mastering Market Dynamics')
    assert.equal(liveContent.brand.logo, uploadedUrl)
    assert.equal(liveContent.brand.headerCtaLabel, 'EXPLORE APEX')

    // Verify hero
    assert.equal(liveContent.hero.title, 'Master the charts.\nControl the risk.')
    assert.equal(liveContent.hero.image, uploadedUrl)
    assert.equal(liveContent.hero.primaryCtaText, 'Join Masterclass')
    assert.equal(liveContent.hero.badgeText, 'INSTITUTIONAL GRADE')

    // Verify about & founder
    assert.equal(liveContent.about.founderName, 'Ahmad Mubarak')
    assert.equal(liveContent.about.founderRole, 'Chief Market Strategist')
    assert.equal(liveContent.about.founderImage, uploadedUrl)

    // Verify stats
    assert.equal(liveContent.stats.length, 2)
    assert.equal(liveContent.stats[0].number, '8+')
    assert.equal(liveContent.stats[0].label, 'Years of Trading Strategy')

    // Verify stages
    assert.equal(liveContent.stages.length, 2)
    assert.equal(liveContent.stages[0].title, 'Foundation')

    // Verify community
    assert.equal(liveContent.community.title, 'WE SUCCEED TOGETHER.')
    assert.equal(liveContent.community.buttonLabel, 'Join Private Channel')

    // Verify footer
    assert.equal(liveContent.footer.copyright, 'Apex Market Institute. All rights reserved.')

    // 6. Delete media item
    const deleteMedia = await call(`/api/admin/media/${uploadedMediaId}`, 'DELETE', null, true)
    assert.equal(deleteMedia.status, 200)

    const updatedMediaList = await call('/api/admin/media', 'GET', null, true)
    assert.ok(!updatedMediaList.data.items.some(m => m.id === uploadedMediaId))

  } finally {
    if (uploadedUrl) {
      await unlink(resolve('public', '.' + uploadedUrl)).catch(() => {})
      await unlink(resolve('dist', '.' + uploadedUrl)).catch(() => {})
    }
    await new Promise(resolve => server.close(resolve))
    await rm(dir, { recursive: true, force: true })
  }
})
