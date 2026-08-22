# Web Development Best Practices — Agent Instructions

This folder is a library of best-practice guides for building websites. Whenever you generate code, copy, markup, or UI **in a project that uses this folder** (or when editing these guides themselves), READ the relevant guide(s) below BEFORE producing work. The guides are deliberately kept as separate files so you load only what a task needs.

## Read these first (the on-ramp)

- `00-Quick-Start.md` — golden rules that prevent ~90% of build errors + copy-paste configs (metadata, JSON-LD, robots.txt, security headers, tsconfig, images). Start here.
- `99-Master-Checklist.md` — every guide's checklist in one ordered list. Tick Phase 1 per task, Phase 2 before commit, Phase 3 before shipping.

## For AI-assisted / vibe coding

- `10-Agent-Onboarding-Prompt.md` — copy-paste briefing to give an agent at session start.
- `12-Vibe-Coding-Playbook.md` — the fast task loop: decision lock, task prompts, verification loop, skip list.

## Guide index — read the file that matches the work

| File | Read before… |
|---|---|
| `01-SEO-AEO-GEO.md` | writing copy, metadata, or page structure; adding JSON-LD, robots.txt, llms.txt, sitemap |
| `02-Accessibility.md` | building any UI — semantic HTML, keyboard, labels, contrast, focus |
| `03-Performance.md` | adding images, fonts, or JS; checking Core Web Vitals / budgets |
| `04-UI-Implementation.md` | implementing UI — component library, tokens, loading/empty/error states, motion |
| `05-Responsive-Design.md` | any layout change — breakpoints, touch targets, no horizontal scroll |
| `06-Security.md` | any public app work — injection, auth, secrets, headers, validation |
| `07-TypeScript-and-Code-Quality.md` | writing code — strict types, lint, structure, error handling |
| `08-Testing.md` | writing or running tests; wiring CI |
| `09-Git-and-CICD.md` | committing, branching, PRs, deployment |
| `11-Avoiding-AI-Slop-Design.md` | any design/decorative decision — no pulsing dots, sparkles, purple gradients, glassmorphism, filler copy |
| `13-Conversion-Copywriting-UX.md` | writing persuasive copy, CTA design, conversion layout hierarchy, sales-focused UX |

## Non-negotiables (apply to every task)

- **Accessibility (WCAG 2.2 AA)**: semantic HTML first, keyboard-operable, labeled inputs, contrast ≥ 4.5:1, one H1, visible focus, `prefers-reduced-motion`.
- **Performance**: Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1); explicit image dimensions; code-split; lazy-load below the fold.
- **Responsive**: mobile-first; verify at 320/768/1280+; 44px touch targets; no horizontal page scroll.
- **Completeness**: every page ships all required sections for its type per the page-anatomy table in `00-Quick-Start.md` (e.g. homepage: hero, featured items, value props, testimonials/social proof, FAQ, CTA, footer) — no lorem-ipsum or "coming soon" placeholders.
- **UI**: use the project's component library (shadcnUI or equivalent) — never hand-roll `Dialog`/`Tooltip`/`Select`/`Toast`; tokens only, no hard-coded colors/spacing; loading/empty/error states on data-driven UI.
- **Design**: if the project root has a `DESIGN.md` (e.g. from `VoltAgent/awesome-design-md`), follow its colors/typography/radius/spacing/components for all UI — it overrides generic defaults but must still meet a11y, contrast, and responsive rules. If it's missing, choose a suitable reference yourself (infer the app type, pick from the mapping in `00-Quick-Start.md` template I, fetch it from the repo) and apply it — don't block on the user. See template I.
  - **Vellora `DESIGN.md`** lives at the repo root (`DESIGN.md`) — it is the design source of truth for ALL dashboard UI (admin, vendor, customer account): colors, typography, radius, spacing, components, charts, do's/don'ts, responsive. It was generated from the `VoltAgent/awesome-design-md` format and populated with Vellora's earthy brand (sand/clay/terracotta/ochre, Inter/Outfit/Space Grotesk/serif). Read and apply it before any dashboard UI work; the numbered guides (`02`/`05`/`11`) define the rules it must still satisfy.
- **Anti-slop**: no pulsing-dot/sparkle/crystal decorations, no AI purple-pink gradients, no glassmorphism-without-purpose, no superlative filler copy.
- **SEO/AEO copy**: every page targets ONE primary keyword placed in title/URL/H1/first ~100 words/meta/≥1 heading/≥1 alt, with natural semantic coverage and no filler words. **You write ALL page copy yourself, including choosing each page's primary keyword (`01` §5.5); for demo/static sites invent coherent concrete business facts (no lorem ipsum, no filler).** Verify with `seo-pipeline/seo-copy-check.mjs` after writing/editing copy (`01` §5.6).
- **Security**: never log/commit secrets; validate inputs at boundaries; escape output; parameterized queries; security headers.
- **Quality**: strict types (no `any`), lint-clean, type-check-clean, tests for logic; follow existing repo conventions; justify any new dependency.
- **Self-documenting structure**: name every UI section by what it is (`.hero`, `.benefits`, `.faq` — class/component/id all agree) and add a one-line boundary comment at each major section (`{/* Hero */}`, `// -- checkout form --`). Comments name the section at boundaries and explain the *why* for non-obvious logic — never comment every line.
- **Git**: small focused commits, clear messages, stage intentionally, never commit generated files or secrets.

## Verification before finishing any task

1. Lint + type-check + tests pass.
2. Check the change at 320px, 768px, 1280px+.
3. Tab through new UI (focus + labels); run a quick a11y sanity pass.
4. Page anatomy: look up the page type in `00-Quick-Start.md`'s anatomy table and confirm EVERY section in its row is present with real content — do not rely on assumptions about what the page needs; flag any missing section; mobile menu opens and closes.
5. For copy/metadata edits: follow the SEO/AEO/GEO audit loop in `01`.
6. Tick the relevant items in `99-Master-Checklist.md`.

---

*To use in a project: copy this whole folder to `docs/web-dev-best-practices/` and reference it from that project's `AGENTS.md`.*