# Mubsa Fin Institute website

React and Vite public site with a private webinar management workspace and a small Node HTTP API.

## Run locally

1. Copy `.env.example` to `.env` and configure the admin credentials and session secret. Add provider credentials if Zoom, email, and WhatsApp delivery should be live.
2. In one terminal, run `npm run api` (default API port `8787`).
3. In another terminal, run `npm run dev` and open the URL Vite prints (default `http://localhost:5173`).
4. Open `/admin` to sign in and create/publish webinars. The editor can create a Zoom meeting when Zoom credentials are configured, or accept an existing Zoom join URL.

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

The instructor card is marked as a sample and uses a temporary workshop image. Replace it with the instructor's approved portrait, biography, qualifications, and name. Testimonial quotes are kept intact; the client has not supplied a verified mapping between each quote and the participant names/occupations, so the page labels those details as “Course participant / Profession not provided” instead of attributing a quote to the wrong person. Replace those labels once the client confirms pairings.

All market course content is educational and does not promise returns. Contact details and provider configuration should be verified by the institute before public launch.
