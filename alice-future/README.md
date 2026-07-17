---
name: "Alice Future Design System"
---

# Alice Future Design System

A design system for **Alice Future** — pure intelligence and living technology for AI products, smart hardware, SaaS platforms, desktop and mobile apps, smart robot UI, and data visualization. The system is purpose-built for dashboard-scale information density wrapped in a soft, luminous, sci-fi blue aesthetic inspired by Apple Human Interface Guidelines and the clear, future-facing sensibility of 天童爱丽丝.

> *"Pure Intelligence · Living Technology — 纯净智能，有生命的科技"* — Alice Future brand philosophy

## Source

- **Origin:** Structured design specification (`source: structured-spec`)
- **Version:** 1.0.0
- **Kit type:** `dashboard` — data-dense admin, analytics, and AI console surfaces
- **Theme:** Light and dark, with dark mode treated as the primary "deep blue universe" environment

## What this design system covers

- **Foundations** — Alice blue scale (`#F0F8FF` → `#3BA7FF`), deep space dark contrast (`#061A40` → `#020617`), Apple-style glass materials, soft diffusion shadows, an 8-step spacing scale, and a four-radius system ending in a pill.
- **Components** — 6 documented components: Button, Card, Input, Navigation, AI Core, Modal.
- **UI kit** — A self-contained dashboard kit under `ui_kits/dashboard/` demonstrating real product context.

## CONTENT FUNDAMENTALS

### Voice & tone

Alice Future speaks in a calm, confident, near-future voice — the register of an intelligent assistant that is present but never loud. Copy is bilingual by default: English leads, Chinese supports, and both carry the same measured warmth. Sentences are short and declarative; questions are gentle invitations rather than demands. The system avoids exclamation marks, urgency language, and emoji in product UI — warmth is carried by the soft blue light and glass material, not by punctuation. Technical states are named with quiet precision ("Processing 3 models", "8,492 tokens active") rather than alarm. The brand personality — Pure, Future, Alive, Elegant, Soft — should be legible in every string.

### Concrete copy examples (lifted from the specification)

- AI prompt placeholder: *"Ask Alice anything..."*
- Primary action: *"Start Analysis"*
- Dashboard heading: *"Today Intelligence"*
- Memory status: *"Memory Module — 8,492 tokens active"*
- Processing state: *"AI Analysis — Processing 3 models"*

### When generating copy

- Lead with the verb or the object of intelligence; never with a marketing adjective.
- Use sentence case for UI labels and headings. Reserve title case for proper product names.
- Quantify states with real numbers and units ("tokens active", "models") rather than vague words like "loading" or "many".
- Keep prompts open and inviting ("Ask Alice anything..."), never imperative ("Enter your query").
- Mirror the English string in Chinese when bilingual support is required; do not translate literally — match the calm, future-facing register.

## VISUAL FOUNDATIONS

### Color

Alice Future is governed by a single blue light source. The light theme runs from `#F0F8FF` (Alice Light, the page background) through `#8FD3FF` (Alice Sky, the brand primary) to `#3BA7FF` (Future Blue, the primary interaction color), with `#1769AA` (Core Blue) reserved for emphasis and hover states. The intended ratio is roughly 80% white and light blue surface, 15% future blue interaction, and 5% deep blue accent — blue is the light source, not a decorative fill.

The dark theme is not a tinted black but a deep blue universe. `#061A40` (Deep Space) is the main background, `#172554` (Night Blue) holds cards, `#0F3D66` (Ocean Shadow) sits beneath components, and `#020617` (Void Blue) provides maximum contrast for text and focused edges. Foreground text in dark mode is `#e8f4ff`, a cool off-white that reads as reflected light rather than pure white.

A single signature gradient, `linear-gradient(135deg, #F0F8FF, #8FD3FF, #3BA7FF)`, carries the "future" motion: it appears on hero surfaces, the AI Core, and loading states. Borders are hair-thin and blue-tinted — `rgba(23,105,170,0.12)` in light, `rgba(143,211,255,0.12)` in dark — never neutral gray. The overall vibe is clear, luminous, and slightly aquatic: a screen that feels like it is lit from within by soft blue light.

### Typography

The primary face is **SF Pro Display** for headings and **SF Pro Text** for body, the Apple system pair that gives the system its HIG simplicity. On web, **Inter** (loaded via Google Fonts, weights 400/500/600/700) is the named fallback and matches SF Pro's proportions closely enough for production. For Chinese content, **PingFang SC** is preferred on Apple platforms, with **HarmonyOS Sans** and **思源黑体 (Source Han Sans)** as the fallback chain — all three share the geometric, open-counters quality that keeps Chinese text legible against glass backgrounds. Code and numeric readouts use **SF Mono**, falling back to **JetBrains Mono**.

The scale is deliberately compressed and calm: display `56px`, h1 `48px`, h2 `32px`, h3 `24px`, body `16px`, caption `13px`. Line heights are tight for headings (1.2–1.4) and relaxed for body (1.5–1.6) so that information density in the dashboard never feels cramped. An eyebrow style — `13px`, weight 600, `0.08em` letter-spacing, uppercase, colored with the accent — labels sections without competing with the heading beneath it.

### Spacing

Spacing is built on a 4px base across an 8-step scale: `4 / 8 / 16 / 24 / 32 / 48 / 64 / 96`. The working rhythm is 16 and 24 for most internal padding, 32 for section gaps, and 96 for major page-level separation. Component heights are anchored to this grid: buttons are 44px, inputs 48px, and the navigation bar 64px. The 12-column grid holds a 1200px max content width with 16/24/32px gutters.

### Radius

The radius system is intentionally soft and Apple-leaning. **8px** (`--radius-sm`) is for small controls and chips. **16px** (`--radius-input` / `--radius-md`) is the default for inputs and medium surfaces. **24px** (`--radius-card` / `--radius-lg`) defines cards and large containers. **32px** (`--radius-xl`) is reserved for hero panels and modals. **999px** (`--radius-button`) is a true pill, used exclusively for buttons and status chips — never for cards or inputs. The system avoids 4px or 12px corners entirely; the smallest acceptable radius is 8px, keeping every surface gently rounded.

### Shadow / Elevation

There are four shadow layers, all using the same Core Blue tint (`rgba(23,105,170,...)`) so that elevation reads as blue light rather than gray drop-shadow. **XS** (`0 2px 8px rgba(23,105,170,0.08)`) rests under button labels and small surfaces. **SM** (`0 8px 24px rgba(23,105,170,0.12)`) is the default card shadow. **MD** (`0 16px 40px rgba(23,105,170,0.18)`) lifts floating windows and modals. The signature **AI Glow** (`0 0 50px rgba(59,167,255,0.35)`) is a wide, diffuse halo applied only to the AI Core and active intelligence states — it is the one place where shadow becomes light. Shadows are large-area and low-opacity by design; nothing in the system casts a hard edge.

### Glass material

Glass is a first-class material, inspired by Apple Vision Pro. **Light glass** uses `rgba(255,255,255,0.65)` background, a `30px` backdrop blur, and a `rgba(255,255,255,0.5)` border — it is the default surface for cards and panels over light backgrounds. **Blue glass** uses `rgba(143,211,255,0.18)` with a `40px` blur and is reserved for AI-adjacent surfaces and dark-mode overlays where the glass should read as tinted light rather than frosted white. Glass always pairs with a soft shadow and a hair-thin border; it never appears flat or opaque.

### Borders and motion

Borders are 1px, blue-tinted, and low-opacity — `rgba(23,105,170,0.12)` light / `rgba(143,211,255,0.12)` dark — and outline states step up to `rgba(23,105,170,0.2)`. Motion is slow and eased: hover `200ms`, transitions `300ms`, page transitions `500ms`, and the AI pulse `2000ms`, all on `cubic-bezier(0.16, 1, 0.3, 1)` (a dramatic ease-out) or `cubic-bezier(0.4, 0, 0.2, 1)` for symmetric moves. Animation should feel like breathing, never like snapping.

## Component Patterns

| Component | Preview | Contract | CSS Source | Key Facts | Key Insight |
|---|---|---|---|---|---|
| Button | `preview/component-button.html` | `components/button.json` | `components.css` | 44px height, pill radius, primary/ghost/ghost-glass variants, hover 200ms | Pill shape + AI glow on primary is the brand signature — never use sharp corners. |
| Card | `preview/component-card.html` | `components/card.json` | `components.css` | 24px radius, glass-light surface, SM shadow, hover lifts to MD | Cards are glass by default; elevation change, not border, signals interactivity. |
| Input | `preview/component-input.html` | `components/input.json` | `components.css` | 48px height, 16px radius, blue outline on focus, caption helper | Focus uses Core Blue outline, not a colored fill — keep fields calm. |
| Navigation | `preview/component-navigation.html` | `components/navigation.json` | `components.css` | 64px height, glass backdrop, pill active indicator | Navigation floats on glass; the active item is a soft pill, never a hard underline. |
| AI Core | `preview/component-ai-core.html` | `components/ai-core.json` | `components.css` | Future gradient surface, AI glow shadow, 2000ms pulse | The AI Core is the only element allowed to glow — it is the light source of the UI. |
| Modal | `preview/component-modal.html` | `components/modal.json` | `components.css` | 32px radius, MD shadow, glass-blue overlay, 500ms page transition | Modals use the largest radius and blue glass to feel like a focused lens, not a dialog. |
| Badge | `preview/component-badge.html` | `components/badge.json` | `components.css` | Pill-shaped status labels; 6 variants (default/success/warning/error/info/ai); AI variant uses glass-blue bg | Status chips share the button pill radius — labels are never sharp-cornered. |
| Avatar | `preview/component-avatar.html` | `components/avatar.json` | `components.css` | Circular identity markers; default gradient, AI variant with glow, group stacking; status dot | Avatars reuse the future gradient and AI glow — identity borrows the AI Core's light source. |
| Toggle | `preview/component-toggle.html` | `components/toggle.json` | `components.css` | Spring-eased switch; AI variant has ai-glow when on; disabled state uses opacity token | Knob slides on a spring ease; the AI variant glows only when on, mirroring the AI Core. |
| Progress | `preview/component-progress.html` | `components/progress.json` | `components.css` | Linear/circular/ai-pulse variants; linear uses future gradient; circular spins; ai-pulse shimmers with glow | The ai-pulse variant turns loading into light — shimmer + glow, not a bare bar. |
| Alert | `preview/component-alert.html` | `components/alert.json` | `components.css` | Glassmorphic notification banners; 5 variants (info/success/warning/error/ai); blur backdrop | Alerts inherit the glass material; the AI variant sits on blue glass, not a solid color. |
| Tooltip | `preview/component-tooltip.html` | `components/tooltip.json` | `components.css` | Contextual hints; default solid core-blue, glass variant with blur; max-width 240px; z-tooltip | Tooltips cap at 240px and sit at z-tooltip — the only surface stacked above modals. |

## Index

- `README.md` — this file, the brand narrative and visual foundations
- `SKILL.md` — agent skill entry point with quick map and essentials
- `colors_and_type.css` — single drop-in CSS file with all color, type, radius, shadow, spacing, and motion tokens
- `css.json` — structured JSON token representation for programmatic consumption
- `components.css` — aggregated component CSS extracted from preview pages
- `components/index.json` + `components/{slug}.json` — component contracts for Button, Card, Input, Navigation, AI Core, Modal, Badge, Avatar, Toggle, Progress, Alert, Tooltip
- `preview/component-button.html` · `preview/component-card.html` · `preview/component-input.html` · `preview/component-navigation.html` · `preview/component-ai-core.html` · `preview/component-modal.html` — preview cards for the 6 original components
- `preview/component-badge.html` — Badge preview card
- `preview/component-avatar.html` — Avatar preview card
- `preview/component-toggle.html` — Toggle preview card
- `preview/component-progress.html` — Progress preview card
- `preview/component-alert.html` — Alert preview card
- `preview/component-tooltip.html` — Tooltip preview card
- `ui_kits/dashboard/` — full interactive dashboard UI kit

## Caveats / known substitutions

1. **SF Pro Display / SF Pro Text** are Apple-licensed and not bundled; on non-Apple platforms we substitute **Inter** (Google Fonts, loaded in `colors_and_type.css`) for Latin text. Impact is minimal — Inter matches SF Pro's x-height and weight range closely, though display headings at 56px will render slightly narrower.
2. **SF Mono** is Apple-only; we substitute **JetBrains Mono** for code and numeric readouts on web. Numeric alignment in dashboards may differ slightly from the Apple reference.
3. Chinese fallback chain (**PingFang SC** → **HarmonyOS Sans** → **思源黑体**) is platform-dependent; only one will render on a given device. All three are geometric sans-serifs, so visual consistency is preserved, but stroke contrast varies.
4. Glass material (`backdrop-filter: blur()`) is unsupported in older browsers; surfaces will render as semi-opaque panels without blur. Acceptable degradation — do not add a polyfill.
5. Token values are inferred from the structured specification, not lifted from a Figma bundle. Component `confidence` is `high` for Button, Card, Navigation, and AI Core, and `medium` for Input and Modal — treat the medium-confidence contracts as authoritative for intent but verify exact states against `preview/*.html` before pixel-critical work.
6. The AI Glow shadow (`0 0 50px rgba(59,167,255,0.35)`) is intentionally strong; apply it only to the AI Core and active intelligence states. Reusing it on generic cards will break the "single light source" principle.
