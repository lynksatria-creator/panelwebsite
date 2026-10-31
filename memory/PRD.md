# PRD — Setia Digital Creative (Company Profile)

## Original Problem Statement
"buatkan company profile setia digital creative untuk undangan digital" — Build a company profile web app for Setia Digital Creative, an Indonesian digital wedding invitation studio.

## User Choices (from ask_human)
- Language: Bahasa Indonesia
- Style: Elegant & romantic fused with modern & professional
- Sections: Hero + Tentang Kami + Layanan + Portfolio + Harga Paket + Kontak
- Contact: WhatsApp button + contact form
- Real info: none yet — placeholders (WhatsApp number, email, stats)

## User Personas
- Indonesian engaged couples researching digital invitation providers
- Wedding organizers comparing packages and reaching out via WhatsApp

## Architecture
- Frontend: React (CRA/craco) + Tailwind + shadcn/ui, single-page landing at `/`
  - framer-motion (masked line-by-line hero reveal, scroll reveals, modal, layout animations)
  - lenis 1.3.27 momentum scrolling (window.__lenis, scrollToSection helper)
  - Light/dark theme via CSS variables + toggle (gold/champagne/velvet palette, Cormorant Garamond + Plus Jakarta Sans)
  - Original SVG logo mark (S-infinity ribbon, rose gold) used in navbar/footer/favicon.svg
  - Sections: Navbar, Hero (3D tilt invitation card, parallax), Marquee (rotated ribbon), About, Services (bento grid), Portfolio (filters + spotlight hover + phone-frame preview modal), Pricing (3 packages, popular highlight), Contact (form + instant cost estimator + WhatsApp CTA), Footer (giant wordmark)
- Backend: FastAPI on 0.0.0.0:8001, routes under /api
  - GET /api (health), POST /api/contact (validate name+whatsapp, store inquiry), GET /api/contact (list)
  - MongoDB via MONGO_URL/DB_NAME env; contact_inquiries collection, uuid ids, ISO timestamps, _id projected out

## Implemented (2026-10-31)
- Full one-page company profile per design_guidelines.json, all data-testids
- Working contact form → MongoDB + sonner toast feedback
- Instant cost estimator (package base + guest surcharge)
- WhatsApp deep links with prefilled Indonesian messages (placeholder number 6281234567890)
- Admin panel (/admin): JWT cookie auth (PyJWT + bcrypt, brute-force lockout, seeded admin), dashboard with stats, inquiry cards (WhatsApp links, delete), refresh — credentials in test_credentials.md
- Demo invitations (/undangan/theme-1..theme-4): cover reveal, countdown, couple, event cards + Google Maps links, gallery, live RSVP (aggregated hadir/guest counts) & wishes guestbook stored in MongoDB
- Portfolio preview modal now has "Buka Demo Undangan" button linking to each theme demo

## Verified
- curl: health, POST /api/contact, GET /api/contact round-trip
- Screenshots: desktop 1440 hero, mobile 390 hero (no overflow), form submit toast, portfolio modal

## Backlog (P0/P1/P2)
- P0: Replace placeholder WhatsApp number/email/Instagram with real details; real portfolio shots
- P1: Live demo invitations per portfolio theme (DONE 2026-10-31); admin panel to read inquiries (DONE 2026-10-31)
- P2: SEO/meta per-theme landing pages, blog, testimonials section
