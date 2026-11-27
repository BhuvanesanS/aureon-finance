import { useState } from 'react'

export function TextField({ label, value, onChange, multiline = false, helpText, ...props }) {
  return (
    <label>
      {label}
      {helpText && <small className="admin-help">{helpText}</small>}
      {multiline ? (
        <textarea rows="4" value={value || ''} onChange={e => onChange(e.target.value)} {...props} />
      ) : (
        <input value={value || ''} onChange={e => onChange(e.target.value)} {...props} />
      )}
    </label>
  )
}

export function ImageField({ label, value, onChange, placeholder = 'URL or /local-path.jpg', onUpload, helpText }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const reader = new FileReader()
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
      })
      reader.readAsDataURL(file)
      const dataUrl = await base64Promise

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, data: dataUrl })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Upload failed.')
      onChange(data.url)
      onUpload?.(data.item || { url: data.url, name: file.name })
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="admin-image-field">
      <label>
        {label}
        {helpText && <small className="admin-help">{helpText}</small>}
        <div className="admin-image-input-row">
          <input
            type="text"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
          />
          <label className="admin-upload-btn" title="Upload from your device">
            {uploading ? 'Uploading…' : '📁 Upload Image'}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              style={{ display: 'none' }}
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
          {value && (
            <button
              type="button"
              className="admin-secondary"
              onClick={() => onChange('')}
              title="Clear image"
            >
              Clear
            </button>
          )}
        </div>
      </label>
      {error && <small className="admin-error-text">{error}</small>}
      {value ? (
        <div className="admin-image-preview-card">
          <img
            src={value}
            alt="Preview"
            onError={e => { e.currentTarget.style.display = 'none'; if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'block' }}
            onLoad={e => { e.currentTarget.style.display = 'block'; if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'none' }}
          />
          <div className="admin-preview-error" style={{ display: 'none' }}>
            <span>⚠️ Image could not be loaded from this URL</span>
          </div>
          <span className="admin-preview-url">{value}</span>
        </div>
      ) : (
        <div className="admin-image-empty">
          <span>No image configured</span>
        </div>
      )}
    </div>
  )
}

function EntryActions({ index, count, move, remove, canRemove = true }) {
  return (
    <div className="admin-form-actions">
      <button type="button" className="admin-secondary" disabled={index === 0} onClick={() => move(-1)} aria-label="Move entry up">Move up</button>
      <button type="button" className="admin-secondary" disabled={index === count - 1} onClick={() => move(1)} aria-label="Move entry down">Move down</button>
      <button type="button" className="admin-secondary" disabled={!canRemove} onClick={remove}>Remove entry</button>
    </div>
  )
}

function shift(items, index, direction) {
  const copy = [...items], target = index + direction
  if (target < 0 || target >= copy.length) return copy
  ;[copy[index], copy[target]] = [copy[target], copy[index]]
  return copy
}

export default function ContentEditors({ section, content, field }) {
  const [expandedCourse, setExpandedCourse] = useState(0)
  const [copiedId, setCopiedId] = useState('')
  const [mediaUploading, setMediaUploading] = useState(false)

  const update = (group, index, key, value) => field(group, (content[group] || []).map((entry, i) => i === index ? { ...entry, [key]: value } : entry))
  const actions = (group, index, min = 0) => <EntryActions index={index} count={(content[group] || []).length} canRemove={(content[group] || []).length > min} move={direction => field(group, shift(content[group] || [], index, direction))} remove={() => field(group, (content[group] || []).filter((_, i) => i !== index))} />

  const brand = content.brand || {}
  const hero = content.hero || {}
  const about = content.about || {}
  const stats = content.stats || []
  const stages = content.stages || []
  const promises = content.promises || []
  const community = content.community || {}
  const footer = content.footer || {}
  const mediaLibrary = content.mediaLibrary || []

  // BRANDING & LOGO
  if (section === 'Branding & Logo') {
    return (
      <>
        <p className="admin-muted">Manage the website's brand identity, official title, descriptor, logo image, favicon, and top navigation action button.</p>
        <div className="admin-form-grid">
          <TextField label="Brand / Company name" required maxLength={100} value={brand.name} onChange={val => field('brand', { ...brand, name: val })} />
          <TextField label="Short display name" maxLength={80} value={brand.shortName} onChange={val => field('brand', { ...brand, shortName: val })} />
        </div>
        <div className="admin-form-grid">
          <TextField label="Brand tagline (e.g. We Grow Together)" maxLength={140} value={brand.tagline} onChange={val => field('brand', { ...brand, tagline: val })} />
          <TextField label="Descriptor kicker (e.g. MARKET EDUCATION)" maxLength={80} value={brand.descriptor} onChange={val => field('brand', { ...brand, descriptor: val })} />
        </div>
        <ImageField
          label="Website Logo Image"
          helpText="Displayed in the header navbar and footer across all pages."
          value={brand.logo}
          onChange={val => field('brand', { ...brand, logo: val })}
        />
        <ImageField
          label="Browser Favicon / Icon"
          helpText="Tab icon (.svg, .png, or .ico)"
          value={brand.favicon}
          onChange={val => field('brand', { ...brand, favicon: val })}
        />
        <div className="admin-form-grid">
          <TextField label="Header CTA button label" maxLength={60} value={brand.headerCtaLabel} onChange={val => field('brand', { ...brand, headerCtaLabel: val })} />
          <TextField label="Header CTA destination URL (optional, defaults to Telegram)" maxLength={500} value={brand.headerCtaUrl} onChange={val => field('brand', { ...brand, headerCtaUrl: val })} placeholder="https://t.me/mubsafin" />
        </div>
      </>
    )
  }

  // HERO SECTION
  if (section === 'Hero Section') {
    return (
      <>
        <p className="admin-muted">Customize the main hero banner on the homepage: kicker, headline, description, primary & secondary action buttons, and hero images.</p>
        <TextField label="Eyebrow / Kicker text" maxLength={200} value={hero.kicker} onChange={val => field('hero', { ...hero, kicker: val })} />
        <TextField label="Hero Main Headline" multiline rows={3} required maxLength={300} value={hero.title} onChange={val => field('hero', { ...hero, title: val })} helpText="Use newlines to split the headline into multiple lines." />
        <TextField label="Hero Description Paragraph" multiline rows={4} maxLength={2000} value={hero.text} onChange={val => field('hero', { ...hero, text: val })} />
        <ImageField
          label="Hero Main Banner Image"
          helpText="The primary market learning illustration / dashboard preview image on the homepage."
          value={hero.image}
          onChange={val => field('hero', { ...hero, image: val })}
        />
        <ImageField
          label="Workshop & Community Learning Image"
          helpText="Secondary hero visual used for interactive sessions and workshop showcases."
          value={hero.workshopImage}
          onChange={val => field('hero', { ...hero, workshopImage: val })}
        />
        <div className="admin-form-grid">
          <TextField label="Primary CTA button label" maxLength={60} value={hero.primaryCtaText} onChange={val => field('hero', { ...hero, primaryCtaText: val })} />
          <TextField label="Primary CTA link destination" maxLength={200} value={hero.primaryCtaLink} onChange={val => field('hero', { ...hero, primaryCtaLink: val })} placeholder="/webinar" />
        </div>
        <div className="admin-form-grid">
          <TextField label="Secondary CTA button label" maxLength={60} value={hero.secondaryCtaText} onChange={val => field('hero', { ...hero, secondaryCtaText: val })} />
          <TextField label="Secondary CTA link destination" maxLength={200} value={hero.secondaryCtaLink} onChange={val => field('hero', { ...hero, secondaryCtaLink: val })} placeholder="/courses" />
        </div>
        <div className="admin-form-grid">
          <TextField label="Community button text" maxLength={60} value={hero.communityCtaText} onChange={val => field('hero', { ...hero, communityCtaText: val })} />
          <TextField label="Trust badge text (e.g. STRUCTURED MARKET LEARNING)" maxLength={100} value={hero.badgeText} onChange={val => field('hero', { ...hero, badgeText: val })} />
        </div>
      </>
    )
  }

  // ABOUT & FOUNDER
  if (section === 'About & Founder') {
    return (
      <>
        <p className="admin-muted">Edit founder Mubarak Ahmad's details, titles, portraits, biography, vision, mission, and professional engineering background.</p>
        <div className="admin-form-grid">
          <TextField label="Founder Full Name" required maxLength={120} value={about.founderName} onChange={val => field('about', { ...about, founderName: val })} />
          <TextField label="Founder Title / Role" maxLength={120} value={about.founderRole} onChange={val => field('about', { ...about, founderRole: val })} />
        </div>
        <ImageField
          label="Founder Portrait Photo (About & Founder Pages)"
          helpText="Vertical portrait photograph of the founder displayed on the About and Founder pages."
          value={about.founderImage}
          onChange={val => field('about', { ...about, founderImage: val })}
        />
        <ImageField
          label="Founder Mentor Photo (Webinar & Registration Modals)"
          helpText="Square/circle mentor photograph displayed in registration panels and Market DNA overview."
          value={about.founderMentorImage}
          onChange={val => field('about', { ...about, founderMentorImage: val })}
        />
        <TextField label="Founder Quote" maxLength={500} value={about.founderQuote} onChange={val => field('about', { ...about, founderQuote: val })} />
        <TextField label="Founder Biography & Market Story" multiline rows={8} maxLength={10000} value={about.founderBio} onChange={val => field('about', { ...about, founderBio: val })} helpText="Separate paragraphs with blank lines." />
        <div className="admin-form-grid">
          <TextField label="Vision heading" maxLength={100} value={about.visionTitle} onChange={val => field('about', { ...about, visionTitle: val })} />
          <TextField label="Mission heading" maxLength={100} value={about.missionTitle} onChange={val => field('about', { ...about, missionTitle: val })} />
        </div>
        <TextField label="Our Vision description" multiline rows={4} maxLength={3000} value={about.visionText} onChange={val => field('about', { ...about, visionText: val })} />
        <TextField label="Our Mission description" multiline rows={4} maxLength={3000} value={about.missionText} onChange={val => field('about', { ...about, missionText: val })} />
        <TextField label="Engineering Story Headline" maxLength={200} value={about.engineeringStoryTitle} onChange={val => field('about', { ...about, engineeringStoryTitle: val })} />
        <TextField label="Engineering Background Story" multiline rows={6} maxLength={6000} value={about.engineeringStoryText} onChange={val => field('about', { ...about, engineeringStoryText: val })} />
      </>
    )
  }

  // KEY NUMBERS / STATS
  if (section === 'Key Numbers') {
    return (
      <>
        <p className="admin-muted">Edit the statistic cards displayed on the website (e.g. 5+ Years Market Education). Reorder or add new numbers.</p>
        {stats.map((stat, index) => (
          <fieldset className="admin-editor-entry" key={index}>
            <legend>Statistic #{index + 1}: {stat.number || ''}</legend>
            <div className="admin-form-grid">
              <TextField label="Stat Number / Metric (e.g. 5+, 100+)" required maxLength={30} value={stat.number} onChange={val => update('stats', index, 'number', val)} />
              <TextField label="Metric Label / Description" required maxLength={120} value={stat.label} onChange={val => update('stats', index, 'label', val)} />
            </div>
            {actions('stats', index, 1)}
          </fieldset>
        ))}
        <button type="button" className="admin-secondary" disabled={stats.length >= 12} onClick={() => field('stats', [...stats, { number: '10+', label: 'New Metric' }])}>
          Add Statistic Card
        </button>
      </>
    )
  }

  // ROADMAP & STAGES
  if (section === 'Roadmap & Stages') {
    return (
      <>
        <p className="admin-muted">Manage the 5 learning stages (Market DNA roadmap) and feature promises highlighted across the website.</p>
        <h3>Market DNA Stages</h3>
        {stages.map((stage, index) => (
          <fieldset className="admin-editor-entry" key={index}>
            <legend>Stage {stage.number || `0${index + 1}`}: {stage.title || 'New Stage'}</legend>
            <div className="admin-form-grid">
              <TextField label="Stage number (e.g. 01)" maxLength={10} value={stage.number} onChange={val => update('stages', index, 'number', val)} />
              <TextField label="Stage title (e.g. Learn, Analyse)" required maxLength={100} value={stage.title} onChange={val => update('stages', index, 'title', val)} />
            </div>
            <TextField label="Stage description / objective" maxLength={500} value={stage.text} onChange={val => update('stages', index, 'text', val)} />
            {actions('stages', index, 1)}
          </fieldset>
        ))}
        <button type="button" className="admin-secondary" disabled={stages.length >= 10} onClick={() => field('stages', [...stages, { number: String(stages.length + 1).padStart(2, '0'), title: '', text: '' }])}>
          Add Stage
        </button>

        <h3 style={{ marginTop: '28px' }}>Feature Promises</h3>
        {promises.map((p, index) => (
          <fieldset className="admin-editor-entry" key={index}>
            <legend>Promise #{index + 1}: {p.title || ''}</legend>
            <TextField label="Promise title" required maxLength={100} value={p.title} onChange={val => update('promises', index, 'title', val)} />
            {actions('promises', index, 1)}
          </fieldset>
        ))}
        <button type="button" className="admin-secondary" disabled={promises.length >= 10} onClick={() => field('promises', [...promises, { title: 'New learning promise' }])}>
          Add Promise
        </button>
      </>
    )
  }

  // COMMUNITY BANNER
  if (section === 'Community Banner') {
    return (
      <>
        <p className="admin-muted">Customize the community banner shown on the homepage to invite visitors to join the Telegram channel or community club.</p>
        <TextField label="Banner Headline" maxLength={140} value={community.title} onChange={val => field('community', { ...community, title: val })} />
        <TextField label="Banner Subtitle / Description" multiline rows={3} maxLength={600} value={community.text} onChange={val => field('community', { ...community, text: val })} />
        <div className="admin-form-grid">
          <TextField label="Button Label (e.g. Join our 5% CLUB)" maxLength={60} value={community.buttonLabel} onChange={val => field('community', { ...community, buttonLabel: val })} />
          <TextField label="Custom Destination URL (optional, defaults to Telegram channel)" maxLength={500} value={community.buttonUrl} onChange={val => field('community', { ...community, buttonUrl: val })} placeholder="https://t.me/..." />
        </div>
      </>
    )
  }

  // MEDIA LIBRARY & GALLERY
  if (section === 'Media Library') {
    const handleBatchUpload = async (e) => {
      const files = Array.from(e.target.files || [])
      if (!files.length) return
      setMediaUploading(true)
      try {
        const uploadedItems = []
        for (const file of files) {
          const reader = new FileReader()
          const base64Promise = new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result)
            reader.onerror = reject
          })
          reader.readAsDataURL(file)
          const dataUrl = await base64Promise
          const res = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, data: dataUrl })
          })
          const data = await res.json()
          if (res.ok && data.item) uploadedItems.push(data.item)
        }
        if (uploadedItems.length) {
          field('mediaLibrary', [...uploadedItems, ...mediaLibrary].slice(0, 100))
        }
      } catch (err) {
        alert(err.message || 'Error uploading files.')
      } finally {
        setMediaUploading(false)
        e.target.value = ''
      }
    }

    const copyToClipboard = (url, id) => {
      navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(''), 2500)
    }

    const removeMediaItem = async (item) => {
      if (!window.confirm(`Remove image ${item.name || item.url}?`)) return
      try {
        if (item.id) await fetch(`/api/admin/media/${item.id}`, { method: 'DELETE' })
      } catch {}
      field('mediaLibrary', mediaLibrary.filter(x => x.id ? x.id !== item.id : x.url !== item.url))
    }

    const gallery = content.gallery || []

    return (
      <>
        <div className="admin-media-uploader">
          <h3>Upload Images to Media Library</h3>
          <p className="admin-muted">Upload logos, banners, portraits, workshop photos, or charts. Supported formats: PNG, JPG, WEBP, SVG, GIF (up to 10 MB).</p>
          <div>
            <label className="admin-upload-btn" style={{ display: 'inline-flex' }}>
              {mediaUploading ? 'Uploading files…' : '⬆️ Select Images from Device'}
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                onChange={handleBatchUpload}
                disabled={mediaUploading}
              />
            </label>
          </div>
        </div>

        <div className="admin-panel-head">
          <div>
            <p className="eyebrow">IMAGE REPOSITORY</p>
            <h3>Uploaded Media Assets ({mediaLibrary.length})</h3>
          </div>
        </div>

        {mediaLibrary.length ? (
          <div className="admin-media-grid">
            {mediaLibrary.map((item, idx) => {
              const itemId = item.id || `media-${idx}`
              return (
                <div className="admin-media-card" key={itemId}>
                  <img src={item.url} alt={item.name} className="admin-media-thumb" />
                  <div className="admin-media-info">
                    <strong title={item.name}>{item.name || 'Untitled Image'}</strong>
                    <small>{item.size ? `${Math.round(item.size / 1024)} KB` : ''} {item.uploadedAt ? `· ${new Date(item.uploadedAt).toLocaleDateString()}` : ''}</small>
                  </div>
                  <div className="admin-media-actions">
                    <button
                      type="button"
                      className="admin-secondary"
                      onClick={() => copyToClipboard(item.url, itemId)}
                    >
                      {copiedId === itemId ? '✓ Copied' : 'Copy URL'}
                    </button>
                    <button
                      type="button"
                      className="danger-link"
                      onClick={() => removeMediaItem(item)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="admin-image-empty" style={{ margin: '16px 0 32px' }}>
            <span>No images uploaded to media library yet. Upload images above or enter URLs directly.</span>
          </div>
        )}

        <h3 style={{ marginTop: '36px' }}>Event & Workshop Gallery</h3>
        <p className="admin-muted">Manage photos shown in the event and workshop gallery section.</p>
        {gallery.map((item, index) => (
          <fieldset className="admin-editor-entry" key={index}>
            <legend>Gallery Photo #{index + 1}: {item.title || 'Untitled'}</legend>
            <div className="admin-form-grid">
              <TextField label="Photo Title" required maxLength={150} value={item.title} onChange={val => update('gallery', index, 'title', val)} />
              <TextField label="City / Category" maxLength={80} value={item.city} onChange={val => update('gallery', index, 'city', val)} />
            </div>
            <ImageField
              label="Gallery Image"
              value={item.image}
              onChange={val => update('gallery', index, 'image', val)}
            />
            {actions('gallery', index)}
          </fieldset>
        ))}
        <button type="button" className="admin-secondary" disabled={gallery.length >= 30} onClick={() => field('gallery', [...gallery, { title: '', city: 'Dubai', image: '' }])}>
          Add Gallery Photo
        </button>
      </>
    )
  }

  // FOOTER & LEGAL
  if (section === 'Footer & Legal') {
    const policies = content.policies || []
    return (
      <>
        <p className="admin-muted">Customize footer description, legal disclaimers, copyright notice, and legal policy pages.</p>
        <TextField label="Footer brand description" multiline rows={3} maxLength={1000} value={footer.description} onChange={val => field('footer', { ...footer, description: val })} />
        <TextField label="Legal Risk Disclaimer Notice" multiline rows={4} maxLength={1000} value={footer.disclaimer} onChange={val => field('footer', { ...footer, disclaimer: val })} />
        <TextField label="Copyright text (e.g. Mubsa Fin Institute. All rights reserved.)" maxLength={200} value={footer.copyright} onChange={val => field('footer', { ...footer, copyright: val })} />

        <h3 style={{ marginTop: '32px' }}>Policy Pages</h3>
        <p className="admin-muted">Manage pages such as Privacy Policy, Terms & Conditions, Risk Disclaimer, and Refund Policy.</p>
        {policies.map((item, index) => (
          <fieldset className="admin-editor-entry" key={index}>
            <legend>Policy #{index + 1}: {item.title || item.slug}</legend>
            <div className="admin-form-grid">
              <TextField label="URL Slug (e.g. privacy-policy)" required maxLength={80} pattern="[a-z0-9-]+" value={item.slug} onChange={val => update('policies', index, 'slug', val.toLowerCase().replace(/[^a-z0-9-]/g, ''))} />
              <TextField label="Page Title" required maxLength={160} value={item.title} onChange={val => update('policies', index, 'title', val)} />
            </div>
            <TextField label="Policy Body Text" multiline rows={8} maxLength={12000} value={item.body} onChange={val => update('policies', index, 'body', val)} />
            {actions('policies', index)}
          </fieldset>
        ))}
        <button type="button" className="admin-secondary" disabled={policies.length >= 20} onClick={() => field('policies', [...policies, { slug: 'privacy-policy', title: 'Privacy Policy', body: '' }])}>
          Add Policy Page
        </button>
      </>
    )
  }

  // POPUPS & BANNERS
  if (section === 'Popups & Banners' || section === 'Content') {
    return (
      <>
        <p className="admin-muted">Configure the welcome registration popup, popup display delay, headline, and video insights.</p>
        <div className="admin-form-grid">
          <label>
            Welcome popup status
            <select value={String(content.popupEnabled)} onChange={e => field('popupEnabled', e.target.value === 'true')}>
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </label>
          <label>
            Popup delay (seconds)
            <input type="number" min="1" max="60" value={content.popupDelay} onChange={e => field('popupDelay', Number(e.target.value))} />
          </label>
        </div>
        <TextField label="Popup headline" required maxLength={180} value={content.popupTitle} onChange={val => field('popupTitle', val)} />
        <TextField label="Popup description" multiline rows={3} maxLength={1000} value={content.popupText} onChange={val => field('popupText', val)} />
        <TextField label="Free insight YouTube video URL" type="url" value={content.videoUrl || ''} onChange={val => field('videoUrl', val)} placeholder="https://www.youtube.com/watch?v=..." />
      </>
    )
  }

  // CONTACT
  if (section === 'Contact') {
    return (
      <>
        <p className="admin-muted">Updates the contact page, home contact section, footer email, phone number, and official website.</p>
        {[
          ['title', 'Contact section headline', 180],
          ['description', 'Contact description text', 1000],
          ['location', 'Office address / location (e.g. Dubai · India)', 300],
          ['website', 'Official website URL / domain (e.g. mubsafin.com)', 120],
          ['email', 'Contact email address', 254],
          ['phone', 'Contact phone number (with country code)', 30]
        ].map(([key, label, max]) => (
          <TextField
            key={key}
            label={label}
            value={content.contact?.[key] || ''}
            required={key !== 'website'}
            maxLength={max}
            type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
            multiline={key === 'description'}
            onChange={value => field('contact', { ...(content.contact || {}), [key]: value })}
          />
        ))}
      </>
    )
  }

  // TESTIMONIALS
  if (section === 'Testimonials') {
    const testimonials = content.testimonials || []
    return (
      <>
        <p className="admin-muted">Add, edit, reorder or remove student reviews and ratings. Use Move up/down to change the order. The top entries appear in the featured spotlight.</p>
        {testimonials.map((item, index) => (
          <fieldset className="admin-editor-entry" key={index}>
            <legend>Review #{index + 1}: {item.name || 'New learner'}</legend>
            <div className="admin-form-grid">
              <TextField label="Learner name" required maxLength={120} value={item.name} onChange={value => update('testimonials', index, 'name', value)} />
              <TextField label="Role / Profession" maxLength={120} placeholder="e.g. MEP Senior Engineer, College Student" value={item.role || ''} onChange={value => update('testimonials', index, 'role', value)} />
            </div>
            <label>
              Class clarity rating (optional)
              <select value={item.rating ?? ''} onChange={e => update('testimonials', index, 'rating', e.target.value ? Number(e.target.value) : '')}>
                <option value="">No rating</option>
                {[5, 4, 3, 2, 1].map(n => (
                  <option key={n} value={n}>{n} / 5 Stars</option>
                ))}
              </select>
            </label>
            <TextField label="Approved student quote" multiline rows={4} maxLength={2000} placeholder="Enter student feedback..." value={item.quote || ''} onChange={value => update('testimonials', index, 'quote', value)} />
            {actions('testimonials', index)}
          </fieldset>
        ))}
        <button type="button" className="admin-secondary" disabled={testimonials.length >= 30} onClick={() => field('testimonials', [...testimonials, { name: '', role: '', quote: '', rating: 5 }])}>
          Add Testimonial
        </button>
      </>
    )
  }

  // SOCIAL LINKS & BUTTONS
  if (section === 'Social Links' || section === 'Links') {
    const socialLinks = content.socialLinks || []
    return (
      <>
        <p className="admin-muted">Social profile links appear in the website header, footer and floating social dock. Button labels customize action buttons across the site.</p>
        <div className="admin-form-grid">
          <TextField label="Default registration button label" required maxLength={60} value={content.registrationLabel} onChange={value => field('registrationLabel', value)} />
          <TextField label="Telegram / community button label" required maxLength={60} value={content.communityLabel} onChange={value => field('communityLabel', value)} />
        </div>
        {socialLinks.map((link, index) => (
          <fieldset className="admin-editor-entry" key={index}>
            <legend>Social link #{index + 1}: {link.label || 'New Platform'}</legend>
            <div className="admin-form-grid">
              <TextField label="Social platform name" required maxLength={60} value={link.label} onChange={value => update('socialLinks', index, 'label', value)} />
              <TextField label="Social profile URL" type="url" placeholder="https://www.instagram.com/yourprofile" required maxLength={500} value={link.url} onChange={value => update('socialLinks', index, 'url', value)} />
            </div>
            {actions('socialLinks', index)}
          </fieldset>
        ))}
        <button type="button" className="admin-secondary" disabled={socialLinks.length >= 12} onClick={() => field('socialLinks', [...socialLinks, { label: '', url: '' }])}>
          Add Social Link
        </button>
      </>
    )
  }

  // FAQS
  if (section === 'FAQs') {
    const faqs = content.faqs || []
    return (
      <>
        <p className="admin-muted">Add, edit, reorder or remove questions. Categories automatically appear in the website FAQ filter.</p>
        {faqs.map((faq, index) => (
          <fieldset className="admin-editor-entry" key={index}>
            <legend>FAQ #{index + 1}: {faq.question || 'New Question'}</legend>
            <TextField label="Category" required maxLength={60} value={faq.category} onChange={value => update('faqs', index, 'category', value)} />
            <TextField label="Question" required maxLength={300} value={faq.question} onChange={value => update('faqs', index, 'question', value)} />
            <TextField label="Answer" required multiline rows={4} maxLength={4000} value={faq.answer} onChange={value => update('faqs', index, 'answer', value)} />
            {actions('faqs', index)}
          </fieldset>
        ))}
        <button type="button" className="admin-secondary" disabled={faqs.length >= 60} onClick={() => field('faqs', [...faqs, { category: 'Support', question: '', answer: '' }])}>
          Add FAQ
        </button>
      </>
    )
  }

  // COURSES
  if (section === 'Courses') {
    const courses = content.courses || []
    return (
      <>
        <p className="admin-muted">Changes update course cards, curriculum outlines, detail pages, course spotlights and enquiry options. Keep at least one course available.</p>
        {courses.map((course, index) => {
          const moduleChange = (moduleIndex, part, value) => update('courses', index, 'modules', course.modules.map((module, i) => i === moduleIndex ? module.map((item, j) => j === part ? value : item) : module))
          return (
            <details className="admin-editor-entry" key={index} open={expandedCourse === index} onInvalidCapture={() => setExpandedCourse(index)}>
              <summary onClick={event => { event.preventDefault(); setExpandedCourse(expandedCourse === index ? -1 : index) }}>
                {index + 1}. {course.name || 'New course'}
              </summary>
              <div className="admin-editor-fields">
                {[
                  ['name', 'Course name', 100],
                  ['slug', 'URL slug (e.g. basic, intermediate, advanced)', 80],
                  ['tagline', 'Course Tagline', 200],
                  ['ctaLabel', 'Card CTA button label (e.g. Explore the Basic Course)', 120],
                  ['description', 'Card description summary', 2000],
                  ['intro', 'Full introduction narrative', 8000],
                  ['focusTitle', 'Learning focus heading', 200],
                  ['focus', 'Learning focus description', 4000]
                ].map(([key, label, max]) => (
                  <TextField
                    key={key}
                    label={label}
                    required={['name', 'slug', 'description'].includes(key)}
                    maxLength={max}
                    pattern={key === 'slug' ? '[a-z0-9]+(-[a-z0-9]+)*' : undefined}
                    multiline={['description', 'intro', 'focus'].includes(key)}
                    value={course[key]}
                    onChange={value => update('courses', index, key, value)}
                  />
                ))}

                <h3>Curriculum modules</h3>
                {(course.modules || []).map(([title, description, topics], moduleIndex) => (
                  <fieldset className="admin-editor-entry" key={moduleIndex}>
                    <legend>Module {moduleIndex + 1}: {title || 'Untitled'}</legend>
                    <TextField label="Module title" required maxLength={200} value={title} onChange={value => moduleChange(moduleIndex, 0, value)} />
                    <TextField label="Module description" multiline rows={3} maxLength={4000} value={description} onChange={value => moduleChange(moduleIndex, 1, value)} />
                    <TextField label="Topics — one per line" multiline rows={5} value={Array.isArray(topics) ? topics.join('\n') : ''} onChange={value => moduleChange(moduleIndex, 2, value.split('\n'))} />
                    <EntryActions
                      index={moduleIndex}
                      count={course.modules.length}
                      move={direction => update('courses', index, 'modules', shift(course.modules, moduleIndex, direction))}
                      remove={() => update('courses', index, 'modules', course.modules.filter((_, i) => i !== moduleIndex))}
                    />
                  </fieldset>
                ))}
                <button type="button" className="admin-secondary" disabled={(course.modules || []).length >= 40} onClick={() => update('courses', index, 'modules', [...(course.modules || []), ['', '', []]])}>
                  Add Curriculum Module
                </button>
                {actions('courses', index, 1)}
              </div>
            </details>
          )
        })}
        <button
          type="button"
          className="admin-secondary"
          disabled={courses.length >= 12}
          onClick={() => {
            setExpandedCourse(courses.length)
            field('courses', [...courses, { slug: '', name: '', tagline: '', ctaLabel: '', description: '', intro: '', focusTitle: '', focus: '', modules: [] }])
          }}
        >
          Add Course
        </button>
      </>
    )
  }

  return null
}
