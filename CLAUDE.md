# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## What this is

**Oracle** — a bilingual (Spanish/English) daily-card web app. A user enters a name
and email, gets assigned one of 52 reflection cards for the day, can write a private
reflection note, ask "the oracle" one question per day, and see a coming-soon paywall
teaser for daily email reminders.

It is a **single-page, single-file, zero-dependency static site**. There is no build
step, no package manager, no framework, no test suite, and no CI.

```
index.html        the entire app — markup, CSS, card data, and logic
despertar.jpeg    background art for section I
soltar.jpeg       background art for section II
crecer.jpeg       background art for section III
integrar.jpeg     background art for section IV
```

That's the whole repository. Do not introduce a bundler, npm, or a framework unless
the user explicitly asks — the single-file design is intentional and the file is meant
to be droppable on any static host.

## Running it

Open `index.html` in a browser, or serve the directory:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

A plain `file://` open mostly works, but serve over HTTP when testing anything that
touches `fetch`, `navigator.share`, or `navigator.clipboard` — those are restricted on
`file://`.

The layout is designed **mobile-first / phone-portrait**. Test in a narrow viewport
(≈390×844) with device emulation; several rules depend on `100dvh`, `env(safe-area-inset-top)`,
and CSS scroll-snap, and they will not look right in a wide desktop window.

## Architecture of `index.html`

The file is one document in four consecutive regions. When editing, keep changes inside
the right region rather than scattering them.

1. **`<style>` (lines ~8–235)** — all CSS. Organized by comment banners:
   `LOGIN`, `MAIN`, `PANELS`, per-panel blocks, `Nav dots`.
2. **Markup (lines ~237–379)** — two `.screen` divs: `#loginScreen` and `#mainScreen`.
   Only one carries `.active` at a time.
3. **`CARDS` data (lines ~384–437)** — the 52 card objects, one per line.
4. **Logic (lines ~439–681)** — plain functions on the global scope, wired to markup
   via inline `onclick` attributes.

### Screens and panels

- Two **screens**: `#loginScreen` (shown first) and `#mainScreen`. Switching is done by
  toggling the `.active` class in `login()` / `logout()`.
- `#mainScreen` holds `.scroll-area`, a vertical CSS scroll-snap container with **five
  panels** `#p0`–`#p4`:

  | Panel | id  | Purpose |
  |-------|-----|---------|
  | 1 | `#p0` | Cover — section pills, roman numeral, section name, date |
  | 2 | `#p1` | Story card — title, reflection, circular SVG prompt, affirmation, share |
  | 3 | `#p2` | User's private reflection note (save / edit) |
  | 4 | `#p3` | Ask the oracle — one Q&A per day |
  | 5 | `#p4` | Daily-reminder upsell (placeholder, not wired to payments) |

- The fixed `.nav-dots` rail mirrors scroll position. `goPanel(i)` scrolls to a panel;
  a `scroll` listener on `.scroll-area` highlights the active dot.
  **If you add or remove a panel, update all three:** the `.panel` markup, the five
  `.dot` divs in `#navDots`, and any hardcoded `goPanel` indices.

### Card data model

```js
{
  id: 1,                    // 1–52, unique, stable — used as a storage key
  s: 'despertar',           // section slug
  sn: 'I',                  // section roman numeral, shown on cover and card
  es: { title, prompt, refl, aff },   // Spanish copy
  en: { title, prompt, refl, aff }    // English copy
}
```

- `title` — card name. `prompt` — the question that runs around the SVG circle.
  `refl` — multi-line reflection; `\n` becomes `<br>` at render time.
  `aff` — affirmation, written wrapped in typographic quotes inside the string.
- **Four sections, 13 cards each, 52 total.** Section order is `SORDER`:
  `despertar` → `soltar` → `crecer` → `integrar`, with numerals I–IV. Cards are grouped
  by section in source order; keep that grouping when adding cards.
- Four parallel lookup maps are keyed by section slug and must be kept in sync:
  `SLABELS` (display names per language), `SORDER`, `BGCLASS` (body gradient class),
  `GDCLASS` (story-card background-image class). **Adding a section means touching all
  four plus a `body.<slug>-bg` rule, a `.gd-<slug>` rule, and a new image file.**

### State and persistence

All user state lives in `localStorage` — there is no backend account system.

- Key: `skey(email)` → `oracle_` + lowercased email with non-alphanumerics replaced by `_`.
- Value shape:
  ```js
  { name, email, seenIds: [], lastCardId, lastDate, notes: {}, answers: {} }
  ```
- `notes` and `answers` are keyed `` `${cardId}_${YYYY-MM-DD}` ``.
- `load()` / `save()` swallow all exceptions — storage failures degrade silently by design.

**Daily card selection** (`getCard`): if `lastDate` equals today, the same card is
returned. Otherwise a card is picked at random from those not in `seenIds`; when all 52
have been seen, `seenIds` resets and the full deck becomes available again.

"Today" is always **`America/Mexico_City`**, via `cdmxDate()` returning an `en-CA`
(`YYYY-MM-DD`) string. Never call `new Date().toISOString()` or a bare `toLocaleDateString`
for day boundaries — use `cdmxDate()` so all users roll over at the same moment.

### Localization

There is no i18n library. Every user-facing string is either:

- a per-language field on the card (`c.es` / `c.en`), or
- an inline ternary at the point of use: `lang==='es' ? '…' : '…'`.

`setLang(l, isLogin)` sets the global `lang`, toggles the `.lbtn.on` pills, and — on the
main screen — calls `renderAll(card)` to re-render everything. **Any new visible string
must get both languages**, and if it lives on the main screen it must be (re)assigned
inside `renderAll` so a language switch updates it. Spanish copy uses inclusive `-x`
endings (`paradx`, `completx`, `mismx`); match that style.

### Rendering

`renderAll(card)` is the single render pass for the main screen. It sets the body
gradient class, the story-card image class, and then walks panels 1→5 assigning
`textContent` / `innerHTML` and toggling visibility of the saved-vs-edit states. It reads
from the module-level `user` and `card` globals. Adding UI to the main screen means
adding its string assignments here.

The circular prompt on panel 2 is an SVG `<textPath>` on path `#cp`. `renderAll` repeats
the prompt string until it reaches 120 characters and truncates to exactly that, so the
text fills the circle regardless of prompt length. Changing the circle radius or font size
means re-tuning that `target` constant.

## External integrations

### Google Sheets logging

`SHEETS_URL` points at a Google Apps Script web app (deployed under the
`paralellautomation.com` domain). `sendToSheets(data)` POSTs a flat record —
`{date, name, email, section, card, reflection, question, answer}` — and is **fire-and-forget**:
the promise is `.catch(()=>{})`-ed and nothing in the UI depends on it. It is called on
login, on saving a reflection, and after an oracle answer. Keep the field set and their
order stable; the Apps Script maps them to sheet columns.

### Anthropic API — currently non-functional

`askOracle()` POSTs directly from the browser to `https://api.anthropic.com/v1/messages`
with only a `Content-Type` header. **There is no API key and no `anthropic-version`
header**, so this request cannot succeed as written — it will fail auth/CORS, hit the
`catch`, and just re-enable the ASK button with no user-visible error. Treat this as a
known open item, not as working code.

If asked to make the oracle work, the fix is a **server-side proxy** (Apps Script,
Cloudflare Worker, or similar) holding the key; `askOracle` then calls that proxy.
**Never commit an Anthropic API key into `index.html`** — this file ships to the browser
and the repository is a static site.

When that proxy is built, the model id in `askOracle` (`claude-sonnet-4-20250514`) should
be reviewed against currently available models.

## Conventions

- **Formatting:** the existing code is deliberately dense — minified-ish CSS (one rule per
  line, no spaces after `:`), and JS with minimal whitespace. Match the surrounding density
  rather than reformatting. Do not run a formatter across the file; it would produce an
  unreviewable diff.
- **Card data:** exactly one card object per source line, however long. This keeps card
  diffs readable.
- **DOM access:** `document.getElementById(...)` inline at the point of use; no cached
  element registry. Handlers are inline `onclick` attributes in the markup, and the
  functions they call are top-level globals — keep them global or the buttons break.
- **Comments:** sparse `/* ── SECTION ── */` banners in CSS, short `// P3 — reflection`
  markers in JS. Follow that, don't add prose commentary.
- **No dependencies.** Google Fonts (Cormorant Garamond + Inter) is the only external
  asset. Everything else is vanilla.
- **Typography:** Cormorant Garamond (serif, often italic) for all mystical/editorial copy;
  Inter for UI chrome, labels, and buttons. Wide letter-spacing on headings and buttons.
- **Colors** are hardcoded rgba/hex inline. There are no CSS custom properties; don't
  introduce a token layer for a one-off change.
- Inputs use `font-size:16px` explicitly to stop iOS Safari from zooming on focus. Keep it.

## Working on images

Section artwork is referenced from CSS by exact filename (`.gd-despertar` etc.) and is
displayed as `center center/cover`. Files are large (35–245 KB). If replacing them, keep
the same filenames, keep portrait-friendly framing (the visible crop is a ~320px-wide
rounded card), and remember the `.story-card::before` gradient overlay darkens only the
top and bottom — art with a busy middle will hurt the reflection text's contrast.

## Git workflow

- Remote: `https://github.com/paralellauto/Oracle`, default branch `main`.
- Feature work goes on a branch; push with `git push -u origin <branch>`.
- Commit messages in this repo are short, lowercase, imperative:
  `add section images to cards`, `fix overlay and remove text shadow`.
- Do not open a pull request unless explicitly asked.

## Verifying a change

There are no automated tests. After any change, manually check:

1. The app loads and login validates (empty name → error; malformed email → error).
2. A card renders with correct section gradient, background image, roman numeral, and
   circular prompt text.
3. Toggling ES/EN re-renders **every** string on all five panels, including any you added.
4. Saving a reflection persists across reload (same email → same card, note still shown).
5. Scroll-snap still lands cleanly on each of the five panels and the nav dots track it.
6. Layout holds at ≈390px wide with no horizontal overflow and no clipped story card.
