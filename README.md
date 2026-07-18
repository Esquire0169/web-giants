# Web Giants — Studio Homepage

Cinematic, dark-themed homepage for the Web Giants digital production studio.
Built with Vite, React 19, TypeScript, Tailwind CSS v4, and Motion.

## Getting started

```bash
npm install
npm run dev
```

Dev server defaults to Vite's port. For a fixed alternate port:

```bash
npm run dev -- --port 4200 --strictPort
```

## Lead form (production)

The contact form posts JSON to whatever endpoint you configure:

```bash
# .env (copy from .env.example)
VITE_LEAD_ENDPOINT=https://formspree.io/f/<your-form-id>
```

Compatible with Formspree, Resend webhooks, a custom CRM, or any JSON `POST` API.
When unset, the form still completes locally and logs a console warning — useful for UI work, not for production.

Payload shape:

```json
{
  "name": "…",
  "email": "…",
  "projectType": "…",
  "budget": "…",
  "message": "…",
  "lang": "en"
}
```

A honeypot field (`company`) is included; bots that fill it get a fake success and nothing is sent.

## Language (EN / RU)

- Text switcher in the header (`EN` / `RU`).
- Choice persists in `localStorage` (`wg-lang`) and is reflected in the URL (`?lang=ru`).
- `<html lang>`, document title, meta description, Open Graph and Twitter tags update with the locale.
- `hreflang` alternates are declared in `index.html` and `sitemap.xml`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and produce a production build
- `npm run preview` — preview the production build
- `npm run lint` — oxlint

## Structure

- `src/i18n/` — locale dictionaries and `LocaleProvider`
- `src/lib/leads.ts` — lead submission helper
- `src/components/` — homepage sections
- `src/components/easter/` — Win98 easter egg (Konami / footer trigger)
- `public/robots.txt`, `public/sitemap.xml`, `public/og.png` — SEO assets
