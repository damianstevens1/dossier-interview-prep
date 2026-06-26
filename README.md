# Dossier

A premium mobile-first interview-prep concept built as a clinical confidential dossier. The app now opens on a white glass start page with a restrained custom Lottie scan, then moves into three simple areas: Mission, Deck, and People. Paste the recruiter message, interview time, people, links, and prep materials, build a mission brief, collect profile screenshots, gather PDFs/pre-reads, attach evidence, then use the dossier deck as the study output. It includes seeded Ascension CHM interview evidence, person files, source chips, a stamped evidence drawer, a roster view, local mock import, swipe navigation, SVG card export, and an optional original in-browser ambient signal.

## Run It

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal, usually:

```text
http://127.0.0.1:5173/
```

Use `?fresh=1` to force the opening case-file screen during testing:

```text
http://127.0.0.1:5173/?fresh=1
```

For a production check:

```bash
npm run build
```

## Mock Data

The seeded deck contains 8 interview people:

- Stephanie Gross
- Colene Daniel
- Mary Clabeaux
- Shalon Robinson
- Lisa Stockdale
- Judi Buchanan
- Jennifer Morris
- Maria Iniguez

Every person dossier points to source evidence IDs from `src/data.ts`. Colene's VP role is sourced to user-provided prep material plus public profile evidence. Stephanie's Talent Advisor role is sourced to the supplied email signature evidence plus public profile evidence. Public profile/search evidence added on Jun 22, 2026 is represented as explicit source cards, not hidden enrichment.

Colene, Shalon, Lisa, Mary, and Judi include user-provided profile screenshot packets added on Jun 23, 2026. The app crops supplied screenshots into local portrait/header assets in `public/assets/profile-packets/` where a usable image is visible, then stores visible profile header, about, experience, education/certification, skills, volunteering, recommendations, and activity details as separate `screenshot` evidence records. Those claims are labeled `USER PROVIDED` / `SCREENSHOT`; the app did not scrape LinkedIn or pull profile media from LinkedIn directly.

The revealed person file renders LinkedIn/profile evidence as separate packet files, so one person can have multiple sourced slips: profile header, current role, prior experience, education, certifications, skills, recommendations, or any later screenshots the user provides.

The CHM Briefing screen also uses user-provided pre-read screenshots as source records. It converts the screenshots into mission, values, ministry identity, FY24 scale, market map, CHM sites, clinical services, social resources, org-structure, and leadership-matrix strategy cards while preserving visible `PRE-READ` and `USER PROVIDED` source chips.

The Provenance screen summarizes what was received, what was extracted, what was not performed, and the profile/role policy for each person. It intentionally says that no LinkedIn connector lookup was performed in this demo.

## Import Mock

The Import Interview Intel screen is local-only:

- Paste interview email/calendar/job text to extract simple names and emails.
- Paste public profile text you have permission to use.
- Upload or paste profile photos/background images you have permission to use.
- Add a short note describing what the profile background suggests.
- Parsed temporary dossiers are stored in `localStorage`.
- Profile text/media is marked as `User-provided`.
- The reset button restores the original 8-person seeded deck.
- Local demo storage is versioned, so major seed/style changes can wipe stale browser data and reload the clean seeded dossier.

No backend, live Gmail, live Calendar, logged-in LinkedIn scraping, or LinkedIn photo extraction is included.

## First Interview Intake

The first screen after opening the file asks for the raw interview intel: recruiter message or calendar invite, target role, organization, date/time, people mentioned, attachments/pre-reads, and any website/news research targets. `Build Mission` converts that pasted text into a local `manual` evidence record, creates temporary person files from names/emails it can parse, and marks those claims as `USER PROVIDED`.

Nothing is sent to a backend. The mission brief and any temporary dossiers are stored in `localStorage`.

## Case Assignments

The Casework screen is the primary starting point and turns prep into quiet fieldwork while keeping every claim sourced:

- Profile Recon: manually open a public profile/search result, capture screenshots of the photo, headline, company, current role, and previous-role evidence, then attach the screenshots through Intake.
- Document Sweep: collect PDFs, pre-reads, calendar attachments, email-linked files, metrics, org charts, and unclear claims that should become interview questions.
- Interview Debrief: paste a permitted voice memo transcript, rough notes, or after-action summary. The app analyzes the pasted text locally for study targets and follow-up file updates.

The board tracks 12 checkpoints across profile, document, and debrief phases. It also shows the active target file, evidence count, pending profile count, and quick routes into Intake, Roster, Briefing, Source Trail, and Study Cards.

The app does not record audio. Recording laws and company policies vary, so the debrief flow requires permission/consent confirmation before using an interview recording. Notes or transcripts should only be added when the user is allowed to retain and use them.

## Screenshot-Derived Cards

The supplied pre-read screenshots were incorporated as user-provided evidence. Legible slide material now appears as additional flashcards for:

- Ascension mission, vision, and values.
- Ministry identity principles: human dignity, justice, and common good.
- FY24 scale facts and national footprint context.
- CHM locations and Ascension market map context.
- Clinical services and social services/resources scope.
- Community Impact organizational structure and Colene's CHM VP source.
- Partially legible CHM leadership matrix context, with unclear columns explicitly treated as non-exact.

## Future Enrichment

Safe future integrations should preserve the same source-first model:

- Gmail API: user-authorized email search, explicit source cards, no hidden claims.
- Google Calendar API: authorized guest lists, invite titles, dates, and attendance evidence.
- Profile enrichment: approved APIs or user-provided text/screenshots only.
- Screenshots: OCR can create `screenshot` evidence, but claims should stay `user-provided` until verified.
- Voice memo/transcript enrichment: a future version can accept user-uploaded audio or transcripts, transcribe with explicit consent, and create debrief flashcards with source chips.

Live LinkedIn scraping is not implemented and should not be added. Use approved APIs, exports, public text snippets with source URLs, or user-provided profile text/media with clear confidence labels. LinkedIn-hosted profile photos/backgrounds should not be pulled into the app unless supplied by the user or through an approved API/permissioned workflow.

## Audio And Visual Boundary

The app does not use GoldenEye, Bond, 007, Rare, Nintendo, screenshots, logos, character names, copied UI, or copied music. The optional `Ambient On` control generates an original WebAudio ambient loop in the browser.

The visual direction is sophisticated spy dossier and intelligence briefing, not a retro game recreation. Motion should stay subtle: premium paper, radar artifacts, source evidence, restrained scan effects, and readable live text.

## Theme Assets

User-provided generated images are stored in `public/assets/dossier-theme/` and used only as visual texture/backdrop layers:

- `folder-set.jpg`: original four-up folder contact sheet.
- `folder-variant-a.jpg` through `folder-variant-d.jpg`: four separate crops from the contact sheet, rotated across the deck, ghost cards, and roster.
- `folder-clean.jpg`: legacy single-folder crop retained as fallback.
- `folder-stamped.jpg`: briefing console texture.
- `radar-sheet.jpg`: original four-up radar contact sheet.
- `radar-variant-a.jpg` through `radar-variant-d.jpg`: four separate crops from the radar sheet, rotated across briefing tabs.
- `paper-grid.jpg`: old paper/grid texture for evidence, import, metadata, and panels.
- `confidential-stack.jpg`: subtle page background atmosphere.

All readable app labels, source chips, person names, evidence text, and buttons remain live React/CSS text for accessibility and clarity.
