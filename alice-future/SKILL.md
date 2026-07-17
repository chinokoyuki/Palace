---
name: "alice-future-design"
description: "Use this skill to generate well-branded interfaces and assets for Alice Future — an AI dashboard / SaaS / smart devices product built on "Pure Intelligence · Living Technology". Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping dashboard UIs with a clear-blue future feel, Apple Vision Pro glass materials, and a living AI Core."
---

# Alice Future Design Skill

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out
and create static HTML files for the user to view. If working on production code, you can
copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build
or design, ask some questions, and act as an expert designer who outputs HTML artifacts
_or_ production code, depending on the need.

## Quick map

- `README.md` — brand context, content fundamentals, visual foundations (read first)
- `colors_and_type.css` — drop-in runtime CSS variables; link it, do not read it to understand tokens when `css.json` exists
- `css.json` — structured token understanding source (primary source for token semantics)
- `components/index.json` — component index + cross-component patterns + summary
- `components/{slug}.json` — compact component contracts (intent/variants/states)
- `components.css` — aggregated component CSS extracted from preview pages
- resolved component sources — consume in priority order: `preview/component-{slug}.html` first (DOM/CSS fidelity), then `components/{slug}.json` for intent/variants/states; no `_evidence/` directory exists for this structured-spec route
- `preview/component-{slug}.html` — small HTML cards illustrating each component (preview DOM/CSS is always the first source when present)
- `library-consumption.json` — recommended downstream read order

## Essentials at a glance

- Primary `#3BA7FF` (Future Blue) — cool, intelligent blue carrying a sci-fi warmth; used for primary interaction, AI Glow, and the future gradient. No warm accents; the accent `#8FD3FF` (Alice Sky) stays within the same blue family.
- Radius is **16px / 24px / 999px** — deliberate and Apple-generous: 16px for inputs, 24px for cards/modals, 999px pills reserved for buttons and status chips only. Never soften cards below 24px.
- Control heights are explicit: **44px** buttons, **48px** inputs, **64px** navigation bar — the floating glass nav sits at the largest height to anchor the dashboard.
- Spacing base is **4px**, scale `4 / 8 / 16 / 24 / 32 / 48 / 64 / 96` — used verbatim from `--space-1..8`; gutters step 16 / 24 / 32.
- Type: **SF Pro Display** (headings) + **SF Pro Text** (body) on Apple platforms, **Inter** as web fallback (Google Fonts loaded), **PingFang SC / HarmonyOS Sans** for Chinese. Mono is **SF Mono / JetBrains Mono**. Scale: display 56, h1 48, h2 32, h3 24, body 16, caption 13.
- Shadows are 4 blue-tinted levels — `rgba(23,105,170,…)` at xs/sm/md plus a signature **AI Glow** `0 0 50px rgba(59,167,255,0.35)` reserved for the AI Core and intelligent elements. No neutral grey shadows.
- Glass material is Apple Vision Pro style: **30–40px backdrop blur**, surface opacity `0.18–0.65`, with a Light Glass (white-tinted) and a Blue Glass (`rgba(143,211,255,0.18)`) variant. Dark mode swaps to Deep Space `#061A40` — "a deep blue universe with an intelligent core."
- Brand quirk: **AI Core is a first-class component** — a glowing orb with a 2000ms breathing animation (`--duration-ai`) that acts as the visual centerpiece of the system, not a decorative accent.

## Components

| Component | Preview | Contract | CSS Source | Key Facts | Key Insight |
|---|---|---|---|---|---|
| Button | `preview/component-button.html` | `components/button.json` | `components.css` §Button | 44px height, pill 999px, hover brightness +10% & scale 1.02 | Pill shape with AI Glow shadow; the glow is what makes it feel "alive" |
| Card | `preview/component-card.html` | `components/card.json` | `components.css` §Card | 24px radius, two glass variants (Light Glass + Blue Glass), 30–40px blur | Glassmorphism is the default surface, not an option — solid cards are the exception |
| Input | `preview/component-input.html` | `components/input.json` | `components.css` §Input | 48px height, 16px radius, glass variant for AI search, focus glow ring | Focus state emits a blue glow ring rather than a plain outline |
| Navigation | `preview/component-navigation.html` | `components/navigation.json` | `components.css` §Navigation | 64px height, floating glass bar, 30px blur, 24px radius, fixed positioning | Floats as a detached glass bar — never a flush top strip |
| AI Core | `preview/component-ai-core.html` | `components/ai-core.json` | `components.css` §AI Core | Glowing orb, 2000ms breathing animation, `--shadow-ai-glow` | The system's visual centerpiece — a living element, not a logo or icon |
| Modal | `preview/component-modal.html` | `components/modal.json` | `components.css` §Modal | 24px radius, glass dialog, `--shadow-md`, blur overlay | Dialog inherits the glass material so it reads as part of the same spatial layer |