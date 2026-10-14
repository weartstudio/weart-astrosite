---
version: alpha
name: Weart Night Tide
description: Design system for weart.hu — a two-person Hungarian web and WordPress studio whose site has to convince small business owners, in one scroll, that a developer (not a template) is behind the work.

colors:
  primary: "#00C2CB"
  secondary: "#AEDFDC"
  tertiary: "#006870"
  abyss: "#051A2D"
  trench: "#050F19"
  on-dark: "#C0EBF1"
  surface: "#F3F9FA"
  raised: "#FCFEFF"
  on-surface: "#051A2D"
  muted: "#465864"
  footer-text: "#76868D"
  border: "#D3E1E3"
  line-on-dark: "#233544"
  error: "#B63B32"

typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.35
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-button:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.2
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.12em
  stat-figure:
    fontFamily: JetBrains Mono
    fontSize: 44px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.03em
    fontFeature: "'tnum' 1"
  data-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.02em

rounded:
  sm: 4px
  md: 8px
  lg: 16px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  section: 96px
  gutter: 32px
  measure: 600px
  container: 1440px

components:
  page:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  section-dark:
    backgroundColor: "{colors.abyss}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
  section-dark-heading:
    backgroundColor: "{colors.abyss}"
    textColor: "{colors.raised}"
    typography: "{typography.headline-lg}"
  site-header:
    backgroundColor: "{colors.abyss}"
    textColor: "{colors.raised}"
    typography: "{typography.body-md}"
    height: 80px
  site-footer:
    backgroundColor: "{colors.trench}"
    textColor: "{colors.footer-text}"
    typography: "{typography.body-sm}"
  footer-heading:
    backgroundColor: "{colors.trench}"
    textColor: "{colors.on-dark}"
    typography: "{typography.headline-sm}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.abyss}"
    typography: "{typography.label-button}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.abyss}"
  link-arrow-dark:
    backgroundColor: "{colors.abyss}"
    textColor: "{colors.raised}"
    typography: "{typography.label-button}"
  link-arrow-light:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-button}"
  link-inline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.tertiary}"
    typography: "{typography.body-md}"
  eyebrow-dark:
    backgroundColor: "{colors.abyss}"
    textColor: "{colors.primary}"
    typography: "{typography.label-caps}"
  eyebrow-light:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.tertiary}"
    typography: "{typography.label-caps}"
  card:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  card-icon:
    backgroundColor: "{colors.abyss}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    size: 60px
  testimonial-quote:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.muted}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  stat-figure:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.stat-figure}"
  stat-label:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
  portfolio-frame:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.abyss}"
    rounded: "{rounded.md}"
  carousel-control:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.abyss}"
    rounded: "{rounded.full}"
    size: 48px
  contact-panel:
    backgroundColor: "{colors.trench}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.md}"
    padding: 20px
  input:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px
  input-error:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.error}"
    typography: "{typography.body-sm}"
  mobile-menu:
    backgroundColor: "{colors.abyss}"
    textColor: "{colors.raised}"
    typography: "{typography.headline-sm}"
  divider-light:
    backgroundColor: "{colors.border}"
    height: 1px
  divider-dark:
    backgroundColor: "{colors.line-on-dark}"
    height: 1px
---

# Weart Night Tide

## Overview

Weart is two people, a developer and a project manager, building custom WordPress sites and WooCommerce shops for Hungarian small businesses. The homepage has one job: in a single scroll, convince a business owner who has been burned by template agencies that this site was **built by a programmer, not assembled**. The register is *competent and calm*: deep water at night, with a few points of teal light in it.

The system is a **tide**: dark "abyss" sections (hero, portfolio, services, contact) alternate with pale "surface" sections (testimonials, about, FAQ, client logos). The dark sections carry the persuasion and the glowing dot field; the light sections carry proof and reading. That alternation is the main source of rhythm on the page, more than any spacing value.

The signature is the **animated dot field** on the hero: blurred points of teal, sea-glass and pale aqua drifting on near-black, which looks like bioluminescent plankton seen from a boat. Every color in the palette is sampled from that image, which is why the palette has one hue family and no second accent.

**What it gives up:** color range and warmth. There is no warm color anywhere except the error state, so the site will never feel playful or homey. Personality comes from the copy (first person, direct, Hungarian) and from the monospace figures, not from decoration.

## Colors

One hue family, teal through petrol, with every neutral tinted toward it. No neutral in the system has R=G=B.

- **Glow teal (`primary`):** the light in the water. It fills primary buttons and portfolio frames, and colors eyebrow labels and link underlines **on dark sections only**. It is 2.1:1 on the light surface, so **never set teal text on light backgrounds**; use Tide ink instead.
- **Sea glass (`secondary`):** the hover state of every teal fill, and the carousel controls. It is never used as text on light backgrounds (1.4:1).
- **Tide ink (`tertiary`):** a deepened teal made for text on light surfaces: inline links and eyebrow labels in light sections (6.1:1). It replaces the live site's `var(--primary)` links, which fail contrast on the near-white page.
- **Abyss (`abyss` / `on-surface`):** the deep-water petrol behind every dark section, and the ink for headings and body text on light ones. It is a deliberate shift from the live `#0D172E`, which sat almost on Tailwind's slate-900. The hue moved from 265° to 248° in OKLCH (lightness unchanged), so the navy now leans toward the teal instead of toward violet.
- **Trench (`trench`):** the darker water under the abyss, for the footer and the contact panel. It is one step down, so the footer reads as the page's floor rather than another section.
- **Shallows (`on-dark`):** pale aqua body text on dark sections. Headings on dark use Raised white so they sit one step above the paragraph text.
- **Surface / Raised:** the light sections sit on a faintly aqua off-white (`surface`); cards and form fields sit one step lighter (`raised`). These replace Bootstrap's `#F8F9FA` and pure `#FFFFFF`.
- **Driftwood (`muted`):** secondary text on light surfaces, such as testimonial quotes, stat captions and meta. It replaces Tailwind's `#374151` and the 40%-opacity navy used for stat labels (which failed contrast).
- **Error (`error`):** a brick red, the complement of the teal. It is the only warm color in the system, so an error stands out from everything else on the page.
- **Hairlines (`border`, `line-on-dark`):** tinted rules for light and dark sections respectively.

Decorative glow only: the dot field mixes `primary`, `secondary`, `on-dark` and a muted aqua at 22–40% opacity with 7px blur. Those translucent values are part of the illustration, not tokens, and must not leak into UI.

## Typography

**Plus Jakarta Sans** does the talking: headings, body, buttons. It is already the brand face, and its slightly geometric, open forms suit friendly-but-technical copy. Self-hosted, OFL licensed. Fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`.

**JetBrains Mono** is the new second face, and it does the labeling: the uppercase eyebrows ("SZOLGÁLTATÁSAINK", "VÉLEMÉNYEK"), the stat figures (150+, 90+, 10+) and small metadata. It is a developer's typeface on a developer's site. It differs from Jakarta by classification (monospace vs. geometric sans), so the labels read as notes on the content rather than smaller headings. OFL licensed; self-host weight 500 only. Fallback: `ui-monospace, "SF Mono", Menlo, monospace`.

- **Weights:** Jakarta 400 and 700 only; mono 500 only. The live site loads 14 Jakarta files (100–800, upright and italic) and mostly uses 600; drop to three files total. Buttons move from 600 to 700.
- **Scale:** roughly 1.25 from a 16px body, hand-tuned at the top. The hero headline is 48px on desktop, a real jump from the 32px section headings (the live hero sits at 36px, too close to the h2). On mobile, step display to 34px and headline-lg to 26px.
- **Tracking:** negative on display and stat figures (−0.025em, −0.03em); +0.12em on the uppercase mono eyebrows; none on body.
- **Line height:** 1.7 on body (a live value worth keeping for Hungarian's long compound words), tightening to 1.1 on display and 1.0 on stat figures.
- **Measure:** intro paragraphs under section headings cap at 600px (about 70 characters).
- Hungarian accented capitals (Á, É, Ő, Ű) must render in both faces; both include them.

## Layout

- **Container:** max 1440px, with 20px side padding on mobile.
- **Spacing:** 8px base with a 4px half-step. Section padding is 96px desktop / 64px mobile (the live 100px rounds onto the grid). Card padding is 32px; the gutter between cards is 32px.
- **Section heads:** eyebrow → heading → one intro paragraph. Centered within the 600px measure, because the section heads act as signposts on a long page. **Body copy inside sections is always left-aligned.**
- **Hero:** split, not centered: copy on the left, overlapping portfolio frames on the right. Keep that asymmetry; do not collapse it into a centered headline block on desktop.
- **Breakpoint:** 991px. Below it, split layouts stack copy-first, and the hero's portfolio frames shrink to a 360px-tall band.
- **Rhythm:** dark and light sections must alternate. Two dark sections in a row lose the tide; if content forces it, separate them with a 1px `line-on-dark` divider and at least 64px of space.

## Elevation & Depth

Depth comes from **tone, not shadow**: abyss → trench goes down, surface → raised comes up. Cards on light sections are separated from the page by the one-step lightness difference, with no border and no shadow.

There is exactly **one shadow**, and it belongs to the portfolio frames, the screenshots that overlap in the hero and project cards: `0 26px 50px -22px rgba(5, 26, 45, 0.45)`. The light is overhead, the shadow falls long and narrow below, and it is tinted with abyss rather than black. Nothing else casts a shadow. Modals and the slide-out menu use a 20% abyss overlay with a 3px backdrop blur instead.

The glowing dot field is the only decoration, and it is allowed on **at most two dark sections per page** (the hero and the final contact section). It must stop animating under `prefers-reduced-motion`; the live CSS already includes a static fallback.

## Shapes

Radius tracks the size and role of each element:

- `sm` (4px): inputs and small chips, the precise, form-like elements.
- `md` (8px): buttons, the contact panel, and the top corners of portfolio frames (bottom corners stay square, so screenshots look like they rise out of the section).
- `lg` (16px): cards and testimonial blocks, the large soft containers.
- `full`: only for things that are actually circular controls or badges: carousel arrows (48px), the service icon disc (60px), avatars.

There are **no pill buttons**. The unused `.weart-hero-section__button` (black, 999px radius) in the child theme contradicts this and should be deleted.

Borders appear only as single 1px hairlines: dividers, and the teal underline under arrow links (`border-bottom: 1px solid primary`, 5px below the text). No boxed outlines around cards.

## Components

- **Primary button:** glow teal fill, abyss text, 8px radius, 12px × 36px padding (32px horizontal in the header). On hover, the fill becomes sea glass over 150ms. It is the same on dark and light sections. **One primary button per section**; the whole homepage uses the same label ("Beszélgessünk").
- **Arrow link:** the secondary action, not a button. Text plus a trailing arrow icon in teal, with a 1px teal underline. White text on dark sections, abyss on light. Use it for "see more" links with neutral, menu-like labels, not instructions ("Munkáink", "Esettanulmány", "Rólunk bővebben").
- **Eyebrow:** a mono, uppercase, tracked label above every section heading, in teal on dark and Tide ink on light. It names the section in two or three words, all lowercase in the source (the CSS uppercases it).
- **Service card:** raised white, 16px radius, 32px padding, with a 60px abyss disc holding a line icon in shallows. **Services is the only section with icon cards.**
- **Testimonial:** raised card, quote in driftwood body text, name in Jakarta 700 and role in `body-sm`. No quote-mark glyph art.
- **Stat row:** mono figures in abyss over driftwood `body-sm` captions, laid out in a row of five with no card around them. The "1 sikertelen projekt" stat stays; it is the most persuasive number on the page.
- **Portfolio frame:** a site screenshot on a teal background, 8px top radius, with the single system shadow. On hover it shifts up 8px over 500ms ease-out; no other card hover animates position.
- **Form (Gravity Forms):** raised fields, 4px radius, a 1px `border` hairline that becomes Tide ink on focus, labels in `body-sm` 700, and errors in brick red `body-sm` below the field.
- **Mobile menu:** a full-screen abyss panel with links in `headline-sm`. Replaces the live `#000` panel.

**Motion:** state changes (hover color, focus) take 150ms ease. Portfolio frames and carousel slides move over 500ms ease-out. The hero copy may fade up once on load. **Nothing else animates on scroll**: section headings, cards, stats and FAQ items appear in place. Accordion panels open with a 200ms height transition and no fade.

## Do's and Don'ts

- Do use Tide ink (`tertiary`) for any teal text on a light section. Glow teal text on `surface` is 2.1:1 and is the most likely regression.
- Don't introduce a second accent hue (no orange badges, no purple highlights). If something needs emphasis, use weight, the mono face, or a dark section.
- Do alternate dark and light sections down the page; plan new pages as a sequence of tides before designing any section.
- Don't use pure `#000` or `#FFF` anywhere, including the mobile menu, carousel arrows and the hero title in the old child-theme CSS. Use abyss and raised.
- Don't add shadows to cards, buttons or the header. The portfolio frame owns the only shadow.
- Do set every number a client should remember (counts, years, prices, durations) in JetBrains Mono with tabular figures.
- Don't put the dot-field animation on more than two sections, or behind body text longer than one sentence.
- Don't use pill-shaped buttons or 999px radii on anything rectangular.
- Don't load Jakarta weights other than 400 and 700, or mono weights other than 500.
- Don't add scroll-triggered fade-ups to new sections; the hero's load-in animation is the only entrance effect.
- Do write the copy in direct first-person plural Hungarian ("építünk", "segítünk"). The design leaves personality to the copy.
- Don't use dashes (– or —) as sentence punctuation in page copy; they read as machine-written. Use a period, comma or colon instead. Number ranges (2–4 hét) stay.
