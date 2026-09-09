---
version: 2.0
name: Vellora Design System
description: The earthy, editorial design language for Vellora — storefront, dashboards (admin, vendor, customer account). Colors, typography, radius, spacing, components, do's/don'ts, and responsive behavior. This file is the design source of truth — apply its values to every UI element.
---

# Vellora Design System

Vellora is a multi-vendor marketplace for thoughtfully made products — electronics, home goods, stationery, and sustainable lifestyle essentials from independent sellers. The brand is **warm, earthy, and editorial**: a sand canvas, clay ink, and terracotta accent, with Outfit/Space Grotesk for structure.

## Brand principles

- **Earthy, not techy.** Warm neutrals (sand/clay) over cold greys. Terracotta is the only "hot" color and is used sparingly for primary actions and active states.
- **Editorial hierarchy.** Generous whitespace, large display numerals, uppercase `Space Grotesk` eyebrow labels with wide tracking, and Outfit for hero/section display.
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
```

## Typography

Fonts: `--font-sans` (Inter), `--font-heading` (Outfit), `--font-label` (Space Grotesk).

```yaml
typography:
  display-xl:   # hero / page title — Outfit 600, 40–56px, tracking -0.02em
  display-lg:   # section / card title — Outfit 600, 28–32px, tracking -0.01em
  heading-md:   # card heading — Outfit 600, 18–20px
  heading-sm:   # sub-heading — Outfit 600, 16px
  eyebrow:      # Space Grotesk 600, 11–13px, uppercase, tracking +0.2em, terracotta
  body-lg:      # Inter 400, 16px, line-height 1.6
  body-md:      # Inter 400, 14px, line-height 1.6
  body-sm:      # Inter 400, 13px, line-height 1.5
  caption:      # Inter 400, 12px, clay-mute
  stat-figure:  # Outfit 700, 28–36px, tabular-nums, clay — KPI values
  display-hero: # Outfit 600, 40–110px, tracking -0.02em — editorial display headings
  button:       # Space Grotesk 600, 11px, uppercase, tracking +0.12em
```

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

## Spacing

8px base unit. Tokens map to Tailwind defaults: `1` 4px, `2` 8px, `3` 12px, `4` 16px, `6` 24px, `8` 32px, `10` 40px, `12` 48px.

## Elevation

```yaml
elevation:
  0: flat, border only (border-clay/10)
  1: "0 1px 2px rgba(61,43,31,0.04)"          # default card rest
  2: "0 4px 16px rgba(61,43,31,0.08)"         # hover / floating panel
  3: "0 12px 32px rgba(61,43,31,0.12)"        # popovers, sticky chrome
```

---

## CRITICAL — Text Contrast & Visibility Rules

**These rules prevent invisible text. Follow them on EVERY page.**

### Background Colors Used

| Token | Hex | Used for |
|---|---|---|
| `sand` | `#F2E8CF` | Page canvas, lighter sections |
| `#F1EDE1` | `#F1EDE1` | Main page background (slightly cooler than sand) |
| `#FAF7EF` | `#FAF7EF` | Card surfaces, testimonial backgrounds |
| `white` | `#FFFFFF` | Cards, inputs, modals |
| `clay` | `#3D2B1F` | Dark sections, hero backgrounds |
| `#1a1410` | `#1a1410` | Darkest sections (seller CTA) |

### Minimum Opacity Rules for Clay Text

On **light backgrounds** (`sand`, `#F1EDE1`, `#FAF7EF`, `white`):

| Purpose | Minimum Opacity | Tailwind Class | Example |
|---|---|---|---|
| **Primary text** (headings, body) | 90–100% | `text-clay` or `text-clay/90` | Product names, descriptions |
| **Secondary text** (labels, metadata) | 50–60% | `text-clay/50` to `text-clay/60` | Store counts, "reviews", category labels |
| **Tertiary text** (captions, hints) | 45–50% | `text-clay/45` to `text-clay/50` | "Unsubscribe anytime", placeholder hints |
| **Placeholder text** (inputs) | 40–50% | `placeholder:text-clay/40` to `placeholder:text-clay/50` | "Search products...", "Enter email" |
| **Decorative only** (icons, dividers) | 20–30% | `text-clay/20` to `text-clay/30` | Star outlines, chevron icons, dot separators |

**NEVER go below `/40` for any text that needs to be read.**

### Quick Reference — Safe Opacity Values

```yaml
text-contrast:
  # SAFE — always readable
  primary:    "text-clay"           # 100% — headings, body
  secondary:  "text-clay/60"        # 60% — labels, metadata, secondary info
  muted:      "text-clay/50"        # 50% — captions, hints, support text
  placeholder:"text-clay/40"        # 40% — input placeholders only

  # DECORATIVE — non-text elements only
  icons:      "text-clay/30"        # 30% — decorative icons, chevrons
  dividers:   "text-clay/20"        # 20% — dot separators, star outlines

  # ON DARK BACKGROUNDS (clay, #1a1410)
  on-dark-primary:   "text-sand"    # 100% — headings on dark bg
  on-dark-secondary: "text-sand/60" # 60% — body on dark bg
  on-dark-muted:     "text-sand/40" # 40% — captions on dark bg
  on-dark-accent:    "text-white/30" # 30% — eyebrows on dark bg
```

### Eyebrow Labels

- Minimum size: `text-xs` (12px) on mobile, `text-sm` (14px) on desktop
- Never use `text-[10px]` or `text-[11px]` for readable labels
- Always uppercase with wide tracking: `tracking-[0.2em]` to `tracking-[0.3em]`
- Always use terracotta color: `text-terracotta`

### Section Labels / "More Stores" type labels

- Use `text-clay/50` minimum — never `text-clay/25` or `text-clay/30`
- Font size minimum: `text-xs` (12px)
- These are readable labels, not decorative elements

---

## Do's and Don'ts

### Do
- Reference tokens (CSS vars / Tailwind theme) — never hard-code hex in components.
- Use `Space Grotesk` uppercase eyebrows to label every section.
- Keep one accent (terracotta) dominant per surface; ochre is secondary.
- Respect `prefers-reduced-motion`; keep motion ≤ 250ms, transform/opacity only.

### Don't
- Don't use pulsing dots, sparkles, crystal/rocket icons, or purple-pink gradients.
- Don't use glassmorphism or floating 3D shapes without purpose.
- Don't ship superlative filler ("unleash", "seamless", "best-in-class").
- **Don't use `text-clay/25`, `text-clay/30`, or `text-clay/35` for any readable text.**
- **Don't use font sizes below 12px for any text that needs to be read.**
- Don't use `text-[10px]` or `text-[11px]` for labels, metadata, or section headers.

## Responsive behavior

| Breakpoint | Key changes |
|---|---|
| 320–480 (mobile) | KPI grid 1–2 cols; sidebar collapses to bottom nav; tables scroll-x; charts stack full-width. |
| 768 (tablet) | KPI grid 2–4 cols; sidebar becomes fixed left rail; charts side-by-side where room. |
| 1024–1280 (desktop) | Full layout: rail + content max-w-6xl; KPI 4-up; charts in 2-col panels. |

Touch targets ≥ 44px. No horizontal page scroll. `100%` not `100vw` for full-width to avoid scrollbar overflow. Verify at 320 / 768 / 1280.
