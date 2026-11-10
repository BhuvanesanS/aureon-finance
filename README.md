# Mubsa Fin Institute website

React and Vite public site with a private webinar management workspace and a small Node HTTP API.

## Run locally

1. Run `npm run dev`, or double-click `Start-Mubsa.cmd` on Windows. Keep that terminal open.
2. Open `http://127.0.0.1:8080/`. This one process serves both the website and `/api`; a separate API terminal is not needed.
3. Open `http://127.0.0.1:8080/admin`. Without an `.env`, the localhost-only development runner prints a temporary admin email and a random session password in its terminal. These change on restart. Your records do not.
4. For stable private credentials, copy `.env.example` to `.env` and configure `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`. Add provider credentials only when delivery should be live. Never use the example password in production.
5. In **Seminars & webinars**, publish a title, future date/time, duration and optional speaker. Leave the registration URL blank to collect registrations on this website, or enter an HTTPS registration page. A Zoom meeting is optional; automatic Zoom creation is an explicit option.

## Edit the website from admin

- **Links & buttons:** save the Telegram and WhatsApp destinations; add, edit, reorder or remove social profiles; change the default registration and community button labels.
- **Seminars & webinars:** create or edit the seminar date/time, description, speaker, publication status, registration destination and button label. Times are entered in the browser’s stated time zone and stored as an absolute timestamp. Future published events appear on the home/events pages, announcement strip and registration popup. Draft and past events stay hidden.
- **FAQs:** edit questions, answers and categories; add, remove or reorder entries. Search and category filters update automatically.
- **Contact:** edit the heading, description, location, email and phone. Contact pages and footer links use these values.
- **Courses:** edit names, descriptions, introductions, learning focus, URL slugs, curriculum modules and topics. Add, reorder or remove courses (keep at least one). Enquiry choices and course announcement slides use the saved catalogue.
- Select **Publish content** in the relevant section. Each section saves independently and keeps the other sections intact. Refresh the public page to see the result immediately, or allow its 30-second refresh to run.
- Built-in seminar registrations appear in **Registrations**. Registrations submitted to an external link are managed by that service. Course enquiries appear under **Enquiries**.

Content is validated on the server and persists in the existing local JSON store or configured D1 database. Existing installations automatically receive default values for the new fields; no database migration is required.

`DEV_PORT` changes the combined server port. It binds to `127.0.0.1` by default. No scheduled task, startup entry, or firewall change is required. For separate frontend/API development use `npm run api` plus `npm run dev:frontend`.

## Website and admin behavior

The supplied `Mubsafin_Website_Content.docx` provides the hero, learning-process, course-principles and footer copy. `Website changes.docx` supplies the webinar-first popup, scrolling webinar/Telegram strip, whole-card course links, combined testimonials and horizontal footer requirements. The inventory's historical “Not Found” notes are not current site copy; working routes remain available.

The welcome popup displays name, email, phone, city and profession directly. Published webinars save registrations; when no webinar is published, the form saves a webinar-interest enquiry (including city/profession) for admin follow-up. The configured WhatsApp link overrides the contact phone's WhatsApp destination. An optional external registration link remains available alongside the built-in form. Announcement motion can be paused and respects reduced-motion preferences.

- Home: mentor hero, introductory carousel, time/price study, Gann image tiles and topic dialogs, course cards, animated study guide, event gallery with filters/lightbox, mentor section, scrolling learner stories, FAQ search/categories, and contact form.
- Welcome popup: appears once per browser tab session after its configurable delay; supports Escape, outside click, keyboard focus containment, and a footer control to reopen it.
- Theme switch, mobile navigation, More menu, deep-linked course details, learning calculator, and policy routes.
- The home-page **Join Free Webinar** and announcement **Webinar details** open `/webinar`, a dedicated landing page with a registration popup. The next published webinar supplies its title, description, date, speaker and duration. When no event is scheduled, visitors can request updates and those requests appear in **Enquiries**. The countdown shows time until the real event start, not a registration deadline.
- Poppins fonts are served locally. Reference-style floating navigation, responsive hero actions, entry animations, FAQ cards and image hover states use the approved green palette. Motion respects reduced-motion settings; learner stories and announcements can be paused.
- The WhatsApp button opens a message panel. Continue on WhatsApp passes the draft to the admin-configured WhatsApp URL; it does not claim that an operator is online or silently send a message. Social links populate the desktop social dock and footer from the admin settings.
- Admin: webinars, registrations, announcements, community links, enquiry status, popup settings, YouTube insight link, approved gallery images, testimonials, and policy copy.
- The local store remains in `server/data/records.json`. `npm test` checks the API with isolated temporary records and never writes test content into the live site.

The reference's private code is unavailable, so this is an independent implementation of its observed interaction patterns. It retains Mubsa's course content and supplied portraits. Event photos, testimonials, exact policy wording, community URL, free video, and an actual webinar schedule must be supplied/published by the client. The study guide is original introductory material, not the reference's commercial book. There is no payment checkout or learner account system; Login opens the management dashboard.

The API command loads `.env` into the Node process. Vite does not expose those values to browser code. Never put Zoom, email, WhatsApp, admin password, or session-secret values in `VITE_*` variables.

## Public API

- `GET /api/health` — API health check.
- `GET /api/site-content` — upcoming published webinar, rotating public slides, and Telegram/WhatsApp URLs.
- `POST /api/admin/spotlights`, `PATCH /api/admin/spotlights/:id`, `DELETE /api/admin/spotlights/:id` — authenticated promotion/collaboration slide management.
- `POST /api/webinar-registrations` — validates and stores a registration, then attempts email and WhatsApp confirmation.
- `POST /api/booking-requests` — validates and stores a course enquiry/booking request.

## Admin API

The dashboard uses an HttpOnly, SameSite=Strict signed session cookie. API endpoints include login/logout/session, dashboard data, link settings, webinar create/update/delete, and promotion/collaboration spotlight create/update/delete. The public site rotates published spotlights and future webinars in the announcement banner, polling for updates every 30 seconds. Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a high-entropy `ADMIN_SESSION_SECRET` before use. Sign-in attempts and public form submissions are rate-limited.

## Provider setup

- **Zoom:** Create a Server-to-Server OAuth app, grant meeting creation/edit scopes, and set `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, and `ZOOM_CLIENT_SECRET`. The API stores the attendee `join_url`; it never stores or sends the private host `start_url`.
- **Email:** Configure a verified sender in Resend and set `RESEND_API_KEY` and `MAIL_FROM`.
- **WhatsApp:** Configure the WhatsApp Cloud API and an approved template matching the four documented variables in `.env.example`; set the `WHATSAPP_*` variables.

If delivery credentials are missing, the registration is still stored and the dashboard shows the provider state as `not_configured`. A provider failure is recorded as `failed`; the registration is not discarded.

## Storage and production hosting

For local development, the API stores webinars, registrations, and bookings in `server/data/records.json`, with serialized atomic writes. This file is local application data and is ignored by Git. It is not durable storage for serverless or multi-instance hosting. Before a public deployment, move these records to a persistent database, add a migration, and deploy the Node API to a persistent Node service (or convert routes to your host's serverless function format). Do not deploy this API with JSON-file storage to Vercel serverless and expect data to persist.

The Vite build contains the public frontend only: `npm run build`. Hosting the frontend and API on different origins requires configuring CORS and using a secure cross-site session cookie strategy; same-origin hosting is recommended for this cookie-authenticated admin.

## Free deployment on Cloudflare

The project is configured for Cloudflare Workers Static Assets plus a D1 database. Static React pages and the API share the same `workers.dev` origin, and webinar, registration, and booking records live in D1 rather than the worker's ephemeral filesystem. `wrangler.jsonc` defines the Worker, SPA routes, and database binding; `migrations/0001_init.sql` creates the data tables.

Cloudflare's Workers Free plan currently includes up to 100,000 requests per day and D1 includes 5 GB storage, 5 million rows read per day, and 100,000 rows written per day. Requests stop succeeding when a free quota is exhausted until it resets. See Cloudflare's [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) and [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/).

To publish, sign into Cloudflare, create the D1 database with `npm run db:create`, copy its returned ID into `wrangler.jsonc`, set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` as Worker secrets, apply `npm run db:migrate:remote`, then run `npm run deploy`. The admin email supplied for this setup is `bhuvanesan.s10@gmail.com` and is set as a Worker variable. Set the password and secret with `npx wrangler secret put ADMIN_PASSWORD` and `npx wrangler secret put ADMIN_SESSION_SECRET`. Zoom, Resend, and WhatsApp credentials are optional Worker secrets; webinar links can be entered manually until Zoom is configured. Never commit secrets to Git.

## Content notes

The supplied client portraits are optimized in `public/client-founder.jpg` and `public/client-portrait.jpg`. No reference-site testimonials, performance figures, event photographs, or identities are attributed to Mubsa. Gallery and testimonial controls become populated when approved entries are published from admin. Policy pages show contact guidance until approved wording is published.

All market course content is educational and does not promise returns. Contact details and provider configuration should be verified by the institute before public launch.
