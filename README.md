# April's Portfolio & April Studio

Interactive English portfolio hosted from this repository at **abrilvilla.dev**. The existing `CNAME` is preserved. No ChatGPT Sites integration is used.

## Experience

- Animated introduction and a desk scene based on the original shared Canva composition.
- Decorative camera, candle, envelope, keyring and keyboard interactions, with optional sound and reduced-motion support.
- Directional navigation to separate MacBook, journal, wall and Motorola scenes.
- MacBook with four website folders (TextHuman, MyFather, SHIFT/TRAZA FIT and SHIFT Control), Finder, Safari, a device-local Notes app and an expression calculator.
- A ring-bound journal with page turns, technical stories and available project films.
- A wire-grid wall with pinned projects and smaller photographs. Each opens a running demo or an interaction preview.
- Motorola-style phone interface containing a contact form that opens an email draft, corrected social links, credentials and three downloadable English PDF resumes with April's portrait.
- Complete content is read from `content.json`; non-published records do not appear in the interface.

Reference: https://canva.link/5yxz2vafa504gsh

## Content and demonstrations

Stories are grounded in project README files and the supplied resume. The two not-yet-received certificates remain unpublished. No completed hardware integration is claimed for Atenea.

TRAZA FIT and Entre nos demos are compiled from their existing React source with disconnected, sample-data behavior. The local router and native UI adapters let them run as static portfolio previews. They do not authenticate against institutional or editorial services. Their original repositories remain private.

SmartLibrary, SysChat, NorthPeak, sales analysis and utility previews are browser interaction studies based on the documented projects, rather than a claim that the original Java/Python backend is running in GitHub Pages. Argus includes its documented public demo and recorded film. MyFather and established Laguna Hawks open their existing websites. External hosts can restrict iframe embedding; an ordinary website link is always available.

The TextHuman preview runs the current local text editor and rejects connected account/payment API calls. Real account and payment operations belong to the original service, not the portfolio iframe.

## April Studio

Run `python studio/server.py` in a local checkout, then open `http://127.0.0.1:8765/studio/`.

The panel binds to loopback and stores SQLite records and draft media in the ignored `.april-studio/` folder. It validates Host, session, Origin and the write header; it is not an internet-accessible backend. Do not commit `.april-studio/` or private JSON exports.

Studio supports projects, MacBook websites, stories, media, CV, links, certificates, project pins, card sizes, order, drafts, uploads and JSON backup. Prepare publication writes public `content.json` and copies referenced public media; review and commit those changes to publish them on the existing domain. The three CVs also have editable HTML sources in `cv/`.

## Checks

- `node --check script.js`
- `node --check studio/studio.js`
- `node --check demos/workbench.js`
- `node --check demos/atenea.js`
- `python studio/test_server.py`

The original public archive pages have been removed. Repository history retains earlier code without displaying it in the visitor experience.
