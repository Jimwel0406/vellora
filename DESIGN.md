---
version: 1.0
name: Vellora Dashboard Design System
description: The earthy, editorial design language for Vellora's dashboards (admin, vendor, customer account). Colors, typography, radius, spacing, components, do's/don'ts, and responsive behavior. This file is the design source of truth — apply its values to every dashboard UI element.
---

# Vellora Dashboard Design System

Vellora is a multi-vendor marketplace for thoughtfully made products — electronics, home goods, stationery, and sustainable lifestyle essentials from independent sellers. The storefront brand is **warm, earthy, and editorial**: a sand canvas, clay ink, and terracotta accent, with a serif display face for character and `Outfit`/`Space Grotesk` for structure. The dashboards inherit that brand so the internal tools feel like the same product, not a separate app.

This `DESIGN.md` follows the `VoltAgent/awesome-design-md` format. The guides (`02` a11y, `05` responsive, `11` anti-slop) define the *rules*; this file defines the *values*. If any value here conflicts with a rule (e.g. low contrast), keep the brand intent but fix the violation.

## Brand principles

- **Earthy, not techy.** Warm neutrals (sand/clay) over cold greys. Terracotta is the only "hot" color and is used sparingly for primary actions and active states.
- **Editorial hierarchy.** Generous whitespace, large display numerals, uppercase `Space Grotesk` eyebrow labels with wide tracking, and a serif used for hero/section display.
- **Calm data.** Dashboards are dense but quiet: white cards on a sand field, hairline borders, one accent per surface. Charts use the brand palette, not a rainbow.
- **No AI-slop.** No pulsing dots, sparkles, purple-pink gradients, glassmorphism, or superlative filler. Icons are `lucide-react`, one set, consistent 1.75px stroke.

## Colors

```yaml
colors:
  # Brand base
  sand:        "#F2E8CF"   # page canvas — warm, never pure white
  sand-deep:   "#EADFC4"   # slightly deeper sand for inset wells
  clay:        "#3D2B1F"   # primary ink — headings, body, never pure black
  clay-soft:   "#5C4636"   # secondary ink
  clay-mute:   "#8A7565"   # muted ink — captions, labels (≥ 4.5:1 on sand/white)
  terracotta:  "#A6634B"   # primary accent — CTAs, active nav, focus ring
  terracotta-deep: "#8B4513" # rust-dark — pressed/hover state of terracotta
  ochre:       "#C89B5F"   # warm secondary accent — highlights, charts

  # Semantic surfaces
  canvas:      "#FFFFFF"   # card surface
  canvas-sand: "#FBF6EC"   # faint warm tint for alt rows / wells
  hairline:    "#E4D9C3"   # 1px borders (clay at low alpha also used: border-clay/10)
  hairline-strong: "#D8C9AC"

  # Text on accent
  on-accent:   "#FFFFFF"

  # Semantic status (orders, payouts)
  success:     "#15803D"   # paid / completed
  success-bg:  "#ECFDF3"
  warning:     "#B45309"   # pending / processing (amber-700)
  warning-bg:  "#FEF6E7"
  info:        "#1D4ED8"   # shipped (blue)
  info-bg:     "#EFF4FF"
  danger:      "#B91C1C"   # cancelled / failed
  danger-bg:   "#FDECEC"
```

Contrast notes:
- `clay #3D2B1F` on `white` / `sand` → > 10:1 (AAA body). `clay-mute #8A7565` on white → ~4.6:1 (AA). `terracotta` on white text → use white text on terracotta fills (7:1+).
- Status pills use 700-weight text on 50-weight tinted backgrounds (≥ 4.5:1). Never put status text color alone as the only signal — pair with a dot.

## Typography

Fonts are loaded in `src/app/layout.tsx` via `next/font`: `--font-sans` (Inter), `--font-heading` (Outfit), `--font-label` (Space Grotesk). Outfit is used for both headings and editorial display — no serif font.

```yaml
typography:
  display-xl:   # hero / page title — Outfit 600, 40–56px, tracking -0.02em
  display-lg:   # section / card title — Outfit 600, 28–32px, tracking -0.01em
  heading-md:   # card heading — Outfit 600, 18–20px
  heading-sm:   # sub-heading — Outfit 600, 16px
  eyebrow:      # Space Grotesk 600, 10–11px, uppercase, tracking +0.2em, terracotta
  body-lg:      # Inter 400, 16px, line-height 1.6
  body-md:      # Inter 400, 14px, line-height 1.6
  body-sm:      # Inter 400, 13px, line-height 1.5
  caption:      # Inter 400, 12px, clay-mute
  stat-figure:  # Outfit 700, 28–36px, tabular-nums, clay — KPI values
  display-hero: # Outfit 600, 40–110px, tracking -0.02em — editorial display headings
  button:       # Space Grotesk 600, 11px, uppercase, tracking +0.12em
```

Principles:
- Headings and display text always `Outfit`; body always `Inter`; eyebrows/labels/buttons always `Space Grotesk` uppercase. One type scale, no ad-hoc sizes. No serif fonts.
- KPI figures use `font-variant-numeric: tabular-nums` so columns align.
- Body line-height 1.5–1.7; headings 1.1–1.3. Display tracking tighter, eyebrow tracking wider.

## Radius

```yaml
rounded:
  xs: 4px    # tags, table chrome
  sm: 6px    # inputs, chips
  md: 8px    # compact cards, alerts
  lg: 12px   # buttons, standard cards
  xl: 16px   # panels, media
  "2xl": 20px # large panels, hero wells
```

Buttons are `rounded-lg` (12px) — not pills. Cards `rounded-xl` (16px). One consistent scale; no arbitrary radii.

## Spacing

8px base unit. Tokens map to Tailwind defaults: `1` 4px, `2` 8px, `3` 12px, `4` 16px, `6` 24px, `8` 32px, `10` 40px, `12` 48px. Section gaps lean generous (32–48px); card padding 20–24px; panel header padding 16–20px.

## Elevation

```yaml
elevation:
  0: flat, border only (border-clay/10)
  1: "0 1px 2px rgba(61,43,31,0.04)"          # default card rest
  2: "0 4px 16px rgba(61,43,31,0.08)"         # hover / floating panel
  3: "0 12px 32px rgba(61,43,31,0.12)"        # popovers, sticky chrome
```

Depth comes from subtle clay-tinted shadow + border, not from blur or color washes. No drop shadows in brand colors.

## Components

```yaml
button-primary:
  background: terracotta; color: on-accent
  typography: button; padding: "0 20px"; height: 40px; radius: lg
  hover: terracotta-deep; active: terracotta-deep
button-secondary:
  background: canvas; color: clay
  border: 1px hairline-strong; typography: button; radius: lg; height: 40px
  hover: bg canvas-sand, border terracotta/40
chip:
  background: terracotta/10; color: terracotta
  typography: caption (uppercase); radius: xs; padding: "4px 8px"
kpi-card:
  background: canvas; border: 1px hairline; radius: xl
  padding: 20px; shadow: elevation 1; hover: elevation 2
panel:
  background: canvas; border: 1px hairline; radius: xl
  header: eyebrow/title row, border-b hairline, padding 16–20px
  body: padding 20px
table:
  header: eyebrow style, clay-mute, uppercase, tracking +0.2em
  row: border-b hairline; hover bg canvas-sand
  cell: body-md, clay
status-pill:
  radius: 9999px; typography: caption uppercase; ring 1px inset
  # success / warning / info / danger per color tokens, paired with a dot
input:
  background: canvas; color: clay; radius: sm; border: 1px hairline-strong
  padding: "10px 14px"; height: 44px (touch target)
  focus: border terracotta, ring 2px terracotta/20
```

## Chart conventions (hand-built SVG, no deps)

- **Sparkline** — single thin line (1.75px) in the accent, optional soft area fill (accent at 10% alpha). No axes, no gridlines. Used inside KPI cards.
- **Area chart** — brand-safe trend (e.g. revenue over months). Line in `terracotta`, gradient fill `terracotta` 18%→0%. Hairline gridlines `hairline`, axis labels `clay-mute` caption. Hover dots use `<title>` for accessibility. Animate path draw only if `prefers-reduced-motion` is off.
- **Donut chart** — order-status breakdown. Segments use `success` / `warning` / `info` / `clay-mute`; center shows total; legend lists segments with values. Segments must remain distinguishable (do not use terracotta + ochre + amber together — keep ≤ 4 sequential, high-contrast hues).

## Do's and Don'ts

### Do
- Reference tokens (CSS vars / Tailwind theme) — never hard-code hex in components.
- Use `Space Grotesk` uppercase eyebrows to label every section.
- Pair every status with a dot, not color alone.
- Keep one accent (terracotta) dominant per surface; ochre is secondary.
- Provide loading (skeleton), empty (icon + action), and error states for every data-driven view.
- Respect `prefers-reduced-motion`; keep motion ≤ 250ms, transform/opacity only.

### Don't
- Don't use pulsing dots, sparkles, crystal/rocket icons, or purple-pink gradients.
- Don't put raw system font stack as the design font — Inter/Outfit/Space Grotesk are deliberate.
- Don't use glassmorphism or floating 3D shapes without purpose.
- Don't ship superlative filler ("unleash", "seamless", "best-in-class").
- Don't mix the dashboard palette with cold greys or the storefront's teal `--primary` token — dashboards use the earthy tokens above.

## Responsive behavior

| Breakpoint | Key changes |
|---|---|
| 320–480 (mobile) | KPI grid 1–2 cols; sidebar collapses to bottom nav; tables scroll-x; charts stack full-width. |
| 768 (tablet) | KPI grid 2–4 cols; sidebar becomes fixed left rail; charts side-by-side where room. |
| 1024–1280 (desktop) | Full layout: rail + content max-w-6xl; KPI 4-up; charts in 2-col panels. |

Touch targets ≥ 44px. No horizontal page scroll. `100%` not `100vw` for full-width to avoid scrollbar overflow. Verify at 320 / 768 / 1280.
