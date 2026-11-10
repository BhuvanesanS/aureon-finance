# Mubsa reference adaptation QA — 2026-11-10

final result: passed

Scope: the reference-inspired typography, navigation, hero actions, topic tiles, FAQ presentation, responsive controls and interactions in this change. This is not a certification that every Fortune Advisorz page or its private backend has been duplicated.

## Evidence

- Source: https://www.fortuneadvisorz.com/; desktop captured in normal Chrome at approximately 1518 × 724 content viewport (the saved 1518 × 810 screenshot includes browser chrome).
- Source desktop: `.wrangler/reference-desktop.jpg`.
- Source mobile: `.wrangler/reference-mobile.jpg`, 390 × 844, homepage after the site's own Reload Page action.
- Mubsa desktop: `.wrangler/mubsa-reference-desktop.jpg`; reviewed at 1518 × 724, then saved again at the restored default viewport.
- Mubsa mobile: `.wrangler/mubsa-reference-mobile.jpg`, 390 × 844.
- Mobile registration state: `.wrangler/mubsa-mobile-popup.jpg`.
- Source and implementation desktop/mobile images were viewed together for visual comparison. Screenshots are local review artifacts excluded from Git.
- Read-only DOM styles confirmed Poppins: hero 48px/55.2px, weight 800; body 18px/29.25px; large section headings 60px/66px, weight 700.
- Source sections inspected: hero, introduction, time/price, Gann tiles, services, book, gallery, team, feedback, community, FAQ and contact.

## User-directed differences

Keep the approved forest-green/lime/ivory palette, Mubsa name, supplied portraits and document copy. Keep the webinar/Telegram announcement ticker, course heading and horizontal footer requested in Website changes.docx. Source business credentials, testimonials, profit claims, founder identity and products are not presented as Mubsa facts. Empty admin-managed content stays empty until real information is published.

## Findings and fixes

1. P1: Manrope and smaller section text differed from the source. Added local Poppins font weights 400–800 and aligned the responsive type scale.
2. P1: Flat full-width navigation differed from the floating reference header. Added rounded sticky navigation, current-page states, responsive dropdowns and mobile login/community access.
3. P1: Topic cards used generic glyphs. Replaced them with locally packaged reference topic images, matched the asymmetric two-column layout, and retained functioning concept dialogs and course links.
4. P2: Font inheritance made button text too light. Added explicit CTA font weight.
5. P2: Existing topic paragraph minimum height displaced captions. Removed it for image tiles.
6. P2: Polling could replay entry animations and re-scroll hash targets. Limited entry animation to route changes and separated hash scrolling from content refreshes.
7. P2: WhatsApp opened immediately without the reference-style message panel. Added an accessible panel, Escape/close controls, draft message and explicit external handoff. Configured admin URL remains authoritative.
8. P2: Missing motion and testimonial presentation. Added entry reveals, card hovers, guide-page transition, dialog/accordion transitions and pausable learner-story rows. Reduced-motion users receive static content.
9. P2: Reference PNGs totalled about 7 MB. Converted local copies to WebP (about 209 KB total); verified all four render successfully.

## Validation

- `npm test`: passed the existing integration suite covering public forms, admin access, content publication, registrations and persistence.
- `npm run build`: passed.
- `npm run lint`: no new warnings; three pre-existing unused-code warnings remain in the unused legacy `src/MubsaApp.jsx`.
- Browser: no console errors. No horizontal overflow at tested desktop/mobile widths.
- Verified: mobile menu plus login/community links; desktop More menu; course navigation and page titles; course enquiry modal; webinar modal and Escape closing; FAQ search plus accordion; light/dark themes; topic dialogs; optimized images; WhatsApp draft URL encoding; local frontend and API running together.

## Limits and follow-up

The source intermittently displays an anti-developer-tools Access Restricted screen in the embedded browser. Normal Chrome supplied desktop evidence; the source homepage was also captured at 390px after ordinary reload. Full source interaction/page parity and source server-side business logic remain unverified. The existing working Mubsa backend is retained. Telegram/social profiles, future seminar dates and real learner feedback depend on what the administrator publishes; none are invented to fill the layout.
