---
name: NCHU Smart Car Team
description: Engineering photographs, clear reading, and paired charcoal and light themes.
colors:
  acc: "#9bd4ef"
  acc-soft: "#1c303d"
  bg: "#0c1015"
  bg-2: "#121820"
  panel: "#131a22"
  line: "#29323e"
  line-2: "#455161"
  text: "#eef3f7"
  text-2: "#bbc7d4"
  muted: "#9baabb"
  gold: "#dfbd8d"
  light-acc: "#126c95"
  light-acc-soft: "#e2f0f6"
  light-bg: "#f6f7f8"
  light-bg-2: "#e9edf0"
  light-panel: "#fff"
  light-line: "#d5dce2"
  light-line-2: "#a7b4bf"
  light-text: "#172a3a"
  light-text-2: "#405468"
  light-muted: "#53687a"
  light-gold: "#885b24"
typography:
  display:
    fontSize: "clamp(48px, 5.6vw, 80px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  headline:
    fontSize: "clamp(36px, 4vw, 54px)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  title:
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", "Segoe UI", sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontSize: "12px"
    fontWeight: 400
rounded:
  tag: "4px"
  control: "8px"
  media: "12px"
  panel: "14px"
spacing:
  compact: "12px"
  control: "16px"
  content: "24px"
  block: "32px"
components:
  button-primary:
    backgroundColor: "{colors.text}"
    textColor: "{colors.bg}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.acc}"
    textColor: "{colors.bg}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  button-ghost-hover:
    backgroundColor: "{colors.acc-soft}"
    textColor: "{colors.text}"
  field:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "14px 16px"
  navigation-link:
    textColor: "{colors.text-2}"
    padding: "12px 10px"
  project-tag:
    backgroundColor: "{colors.bg-2}"
    textColor: "{colors.text-2}"
    rounded: "{rounded.tag}"
    padding: "4px 9px"
  content-card:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    padding: "28px 0"
  archive-stage:
    backgroundColor: "{colors.bg-2}"
    textColor: "{colors.text-2}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  archive-stage-selected:
    backgroundColor: "{colors.acc-soft}"
    textColor: "{colors.acc}"
  form-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    padding: "32px"
---

# Design System: NCHU Smart Car Team

## Overview

**Creative North Star: "Engineering photography and clear reading"**

This is a record of the implemented visual system, not a new identity or an inferred user commitment. The existing charcoal and ice-blue palette remains, paired with an off-white day theme. Real team vehicles, activities, and certificates provide the main visual evidence.

Pages use left-aligned headings, readable text, generous section spacing, and thin separators. The home page combines an asymmetric introduction and engineering photograph with direct routes to projects, records, news, and joining. Detail pages use quieter text-led layouts. These are distinct page compositions within the same system.

**Key Characteristics:**

- Real engineering photography with captions and image viewing.
- Paired dark and light semantic colors.
- Flat content surfaces with thin rules and restrained accents.
- Responsive reading layouts and explicit keyboard focus.
- Short state transitions with reduced-motion support.

## Colors

The frontmatter records the final reusable values from `css/refinement.css`; its keys mirror the CSS custom properties. Unprefixed values describe the default dark theme, while `light-` values describe the same role under `html[data-theme="light"]`. Component tokens and previews record the dark baseline; runtime CSS remains authoritative for theme-specific selector precedence. The sidecar tonal ramps are synthesized preview samples, not additional source colors.

### Primary

- **Ice blue / day blue:** `acc` and `light-acc` mark interactive text, active states, focus, and the accented hero line.
- **Accent surface:** the `acc-soft` pair provides selected and hovered backgrounds.

### Secondary

- **Warm award accent:** the `gold` pair remains limited to award metadata. It is not a second general action color.

### Neutral

- **Page, inset, and panel surfaces:** the `bg`, `bg-2`, and `panel` pairs separate content and images by tone.
- **Dividers and control borders:** `line` is the quieter separator; `line-2` supports controls and stronger boundaries.
- **Reading hierarchy:** `text`, `text-2`, and `muted` distinguish headings, body copy, and metadata.

**The Theme Pair Rule.** Use semantic CSS variables for shared components so each role follows the current theme. The light palette is an explicit counterpart, not a filter applied to the dark screen.

## Typography

The body font stack is the inherited Chinese-capable platform sans stack recorded above. Headings currently inherit it too; this records source behavior without establishing an exclusive display-font commitment. No webfont download is required. The existing monospace stack remains in some utility metadata, but does not define the main reading hierarchy.

### Hierarchy

- **Display:** the frontmatter size describes the desktop home title. It changes to `clamp(42px, 5.8vw, 66px)` at 1080px and below, then `clamp(44px, 11.4vw, 70px)` at 760px and below.
- **Headline:** route titles use the recorded headline role, changing to 35px on narrow screens. Technical detail titles use `clamp(32px, 4.5vw, 52px)` and become 31px on narrow screens.
- **Title:** content-card titles use the recorded title role. Project and news titles are generally 21px at weight 500; these are separate editorial variants.
- **Body:** the root role is 16px. Route introductions and detail paragraphs commonly use 15px with a line height near 1.9–2; cards and news use 14px.
- **Label:** 12px metadata remains subordinate. Navigation is 13px on desktop and 15px in the expanded menu; controls generally use 14px.

## Layout

The main container is capped at 1240px, with 48px side gutters on large screens. At 1080px and below the gutters become 32px; at 760px and below they become 20px. The fixed header is 82px tall on desktop and 72px at 1080px and below. Route content clears that header with explicit top padding.

The home hero uses a 0.92 / 1.08 column ratio, then equal columns at intermediate sizes and a single column on narrow screens. Home projects use four columns, then two. Technical cards use two columns and collapse to one. Project, news, and activity pages become single-column at 760px. The detail reader is capped at 1000px, with 200px section-label columns that stack on narrow screens.

Home sections use 108px top spacing on desktop and 68px on narrow screens. Internal layouts use the observed compact and content intervals rather than a decorative grid. The archive also has local 800px and 480px adaptations; older base-style breakpoints remain and should be considered alongside the final cascade.

Images use explicit aspect ratios or bounded stages. Vehicle and certificate images generally use `object-fit: contain`; the home hero alone uses a 4:3 crop with `cover`. The shared footer follows the active page and contains the site notice.

## Elevation & Depth

Content depth comes primarily from tonal surfaces, image frames, spacing, and one-pixel rules. Main cards, news cards, buttons, header, join panel, and back-to-top control have no resting or hover shadows in the final refinement. Content cards do not translate on hover.

The image-viewer overlay retains a modal shadow from the base implementation; the day theme has its own softer viewer shadow. These viewer-specific effects are recorded in the sidecar and are not the general card vocabulary.

**The Flat Content Rule.** Use tonal changes and borders for ordinary content states; reserve overlay depth for image viewing.

## Shapes

Small tags have compact corners, controls are gently rounded, media frames are softer, and form or QR panels use the largest recurring panel radius. Values are recorded in the frontmatter. Reading cards instead use square, unboxed layouts with a top divider. Circular shapes are reserved for compact image and utility controls. Archive certificate thumbnails keep their portrait proportions inside framed buttons.

## Components

### Buttons

Primary buttons reverse the page text and background roles. The default dark hover switches to the accent; day-theme selector precedence preserves the inverted primary fill. Ghost and outline variants use a stronger border and a soft accent hover surface, with a local day-theme outline text treatment. Common buttons have a 50px minimum height, a 14px label, and weight 600. Their active state retains the inherited slight scale response. Narrow form buttons may fill the available width.

Keyboard focus uses a visible accent outline. The shared outline is 2px with a 5px offset; the existing theme control and archive components carry local focus dimensions.

### Chips

Project tags are compact filled metadata, not actions. General content tags are plain muted text. Archive stage filters are actual buttons with an accent border, text, and soft background when `aria-pressed="true"`.

### Cards / Containers

General content cards have a top border, no filled panel, and vertical padding. Hover changes the border color without lifting the card. Project and news cards pair a rounded image frame with an unboxed caption. Archive edition selectors remain bordered panel buttons, changing to the soft accent surface on selection. Form and QR panels retain an enclosed surface.

### Inputs / Fields

Guestbook fields use a stronger border, page-toned surface, comfortable inner padding, and muted placeholders. The textarea can resize vertically. Focus also changes the border and background using inherited rules; a visible keyboard outline is preserved. The archive search field uses a panel surface. The guestbook provides an inline error and submission note, while failed or empty public-message loading has a visible status surface.

### Navigation

The fixed header is opaque, has a thin bottom divider, and contains the team mark, links, and an icon-based theme control. The current desktop route has a short accent underline and `aria-current="page"`. At 1080px and below, a separate menu button opens a scrollable two-column list; selecting a route closes the menu. The theme control remains outside this collapsible list.

### Image Viewing and Motion

Photographs and certificates open bounded image stages with visible controls and `contain` sizing. The home photo has a small circular open affordance. Motion is limited to a brief page fade, image zoom, arrow movement, and component states. Reveal classes remain visible without a scroll entrance. `prefers-reduced-motion: reduce` disables CSS animation, transition, and smooth scrolling.

## Do's and Don'ts

### Do:

- **Do** use semantic theme variables for shared text, borders, surfaces, and focus.
- **Do** preserve complete vehicle and certificate imagery where the component uses `contain`.
- **Do** keep reading cards flat and use dividers to organize content.
- **Do** keep keyboard focus visible and respect reduced-motion preferences.
- **Do** check the final stylesheet cascade before changing inherited styles.

### Don't:

- **Don't** restore decorative backdrop grids, staggered reading cards, or card-lift shadows removed by the final refinement.
- **Don't** apply the home hero composition to every route; detail pages use a text-led layout.
- **Don't** turn plain metadata tags into apparent interactive controls.
- **Don't** treat old overridden CSS values as current design tokens.
