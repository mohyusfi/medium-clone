# DESIGN.md

## Product Design Direction

### Reference

The primary visual reference is the supplied Medium homepage screenshot.

The design should capture the **editorial reading experience** of Medium
without becoming a pixel-perfect clone. The goal is a calm,
content-first publishing interface with strong typography, thin
structural rules, restrained color, and high information density.

### Design thesis

> **Editorial clarity over decoration.**

The interface should feel like a digital magazine/newspaper rather than
a dashboard or SaaS application. Content hierarchy, typography,
whitespace, and alignment do most of the visual work.

---

# 1. Visual Character

The visual language is:

- Editorial
- Minimal
- Content-first
- Monochromatic with a restrained accent
- Dense but breathable
- Desktop-oriented while remaining responsive
- Quiet, confident, and functional

Avoid:

- Excessive gradients
- Glassmorphism
- Large decorative illustrations
- Heavy shadows
- Excessive rounded cards
- Generic SaaS dashboard patterns
- Giant hero sections when the content does not require them
- Decorative UI elements that do not improve navigation

The page should look intentionally designed even when stripped of
images.

---

# 2. Color System

Use a mostly neutral palette.

Token Hex Usage

---

`--color-bg` `#FFFFFF` Main page background
`--color-surface` `#FAFAFA` Secondary surfaces
`--color-text` `#171717` Primary text
`--color-text-secondary` `#6B6B6B` Metadata and supporting text
`--color-text-muted` `#A8A8A8` Low-priority information
`--color-border` `#E6E6E6` Dividers and structural rules
`--color-accent` `#FFC017` Promotional/accent actions
`--color-accent-soft` `#FFF4CC` Very subtle accent backgrounds
`--color-inverse` `#000000` High-contrast controls

### Color rules

1.  White should dominate the page.
2.  Black should carry the strongest hierarchy.
3.  Gray should communicate secondary information, not decoration.
4.  Yellow is an accent, not a general-purpose brand background.
5.  Borders should be subtle and usually `1px`.
6.  Do not introduce additional colors unless content semantics require
    them.

---

# 3. Typography

Typography is the primary visual identity.

### Font roles

#### Display / Brand

Use a strong editorial serif for the logo and selected editorial
headlines.

Preferred stack:

```css
font-family: Georgia, 'Times New Roman', serif;
```

The Medium-style wordmark should have a recognizable serif character and
strong contrast.

#### Interface / Body

Use a neutral sans-serif for navigation, metadata, controls, and
supporting copy.

Preferred stack:

```css
font-family:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
```

### Type scale

Role Size Weight Line Height

---

Brand `30px` `700` `1`
Page heading `32px` `700` `1.15`
Article title `22px` `700` `1.2`
Article title mobile `18px` `700` `1.25`
Article subtitle `15px` `400` `1.4`
Navigation `14px` `400` `1.4`
Metadata `12px` `400` `1.35`
Small label `11px` `500` `1.3`

### Typography rules

- Headlines should be compact and highly legible.
- Avoid overly wide text blocks.
- Metadata should remain visually quiet.
- Use sentence case for interface labels.
- Avoid all-caps except for very small editorial labels where
  appropriate.
- Do not use more than two font families.

---

# 4. Layout

The page uses a **three-zone editorial layout** on desktop:

```text
┌──────────────────────────────────────────────────────────────────────┐
│ ☰   MEDIUM                 Search              Get app  Write  ○     |
├──────────────────────────────────────────────────────────────────────┤
│                    PROMOTIONAL / NOTICE BAR                          │
├───────────────┬──────────────────────────────────┬───────────────────┤
│               │                                  │                   │
│   SIDEBAR     │         ARTICLE FEED             │   DISCOVERY       │
│               │                                  │                   │
│   Home        │   For you   Featured             │   Staff Picks     │
│   Library     │                                  │                   │
│   Profile     │   Article                        │   Recommended     │
│   Stories     │   ───────────────────────        │   topics          │
│   Stats       │   Article                        │                   │
│               │                                  │   Who to follow   │
│   Following   │   Article                        │                   │
│               │                                  │                   │
└───────────────┴──────────────────────────────────┴───────────────────┘
```

### Desktop dimensions

- Header: `44–48px`
- Notice bar: `36–40px`
- Left sidebar: `192px`
- Main content: `545–600px`
- Right rail: `300–340px`
- Main horizontal gap: `32–48px`
- Page max width: approximately `1280–1400px`

The central article feed is the visual anchor.

### Responsive behavior

At tablet width:

```text
┌───────────────────────────────┐
│ Header                        │
├───────────────────────────────┤
│ Notice                        │
├───────────────────────────────┤
│ Article feed                  │
│                               │
│ Article                       │
│ Article                       │
└───────────────────────────────┘
```

- Hide the right discovery rail first.
- Reduce sidebar width or convert it into compact navigation.
- Keep article content readable.

At mobile width:

```text
┌───────────────────────┐
│ ☰   Brand       ◯     │
├───────────────────────┤
│ Article feed          │
│                       │
│ Article               │
│                       │
│ Article               │
└───────────────────────┘
```

- Remove the desktop sidebar.
- Remove the right rail.
- Keep only essential header actions.
- Article thumbnails become smaller or disappear depending on
  available width.
- Preserve generous vertical rhythm.

---

# 5. Header

The header is deliberately compact.

### Structure

```text
☰   MEDIUM        [ Search ]             Get app   Write   ◯
```

### Rules

- Fixed or sticky behavior may be used if useful.
- Keep the header visually light.
- Use a subtle bottom border.
- Search should resemble an input/pill without looking like a large
  application search system.
- Primary actions should be text-first.
- Icons should be simple line icons.

### Header spacing

- Horizontal padding: `20–32px`
- Icon size: `18–20px`
- Header height: approximately `48px`

---

# 6. Promotional Bar

The screenshot contains a narrow yellow promotional strip.

Use it as an optional global announcement component.

```text
[ Welcome Offer ]   Access to everything. Now 30% off.   Upgrade now
```

### Rules

- Height: `36–40px`
- Background: `--color-accent`
- Text: black
- Keep copy concise.
- The CTA may be underlined or slightly heavier.
- Do not turn this into a large marketing hero.

If no promotion exists, the bar should be removed entirely rather than
left empty.

---

# 7. Sidebar Navigation

The left rail is navigation, not a decorative panel.

### Primary navigation

```text
⌂  Home
▢  Library
♙  Profile
▤  Stories
▥  Stats
```

### Secondary section

```text
Following

○  Person
○  Publication
＋  Find writers and
   publications to follow
```

### Rules

- Use icons consistently.
- Active navigation should have stronger text contrast.
- Inactive items use muted gray.
- Avoid filled cards around navigation items.
- Keep vertical spacing generous enough for scanning.
- The sidebar may remain visually static while the article feed
  scrolls.

---

# 8. Article Feed

The feed is the core component.

Each article row should contain:

```text
Author metadata                         Thumbnail
──────────────────────────────────────────────────
Title
Supporting description
Engagement metadata
```

Example:

```text
David  ·  Aug 12                       [ IMAGE ]

I Tested Claude Code Skills Until I Struck Gold

Your AI is bloated, and it's killing your performance

★ 825   💬 18   ↗ 4
```

### Article row

Recommended dimensions:

- Vertical padding: `28–32px`
- Thumbnail: approximately `128 × 86px`
- Thumbnail gap: `24px`
- Divider: `1px solid var(--color-border)`

### Article title

The title should dominate the row.

- Font size: `20–22px`
- Weight: `700`
- Line height: `1.2`
- Maximum width should encourage approximately 2 lines.

### Description

- Smaller than title
- Gray
- Maximum 2 lines
- Never compete with the headline

### Metadata

Metadata includes:

- Author
- Publication
- Date
- Reading/engagement signals
- Small interaction controls

Use small type and muted contrast.

---

# 9. Article Thumbnail

Images are supporting elements.

### Rules

- Use consistent aspect ratio.
- Recommended ratio: approximately `3:2`.
- Avoid excessive rounded corners.
- A subtle `border-radius: 2–4px` is acceptable.
- Images should visually support the article topic.
- Do not allow thumbnails to overpower titles.

If no image exists, preserve the text layout rather than inserting a
generic placeholder.

---

# 10. Feed Tabs

The main feed uses a lightweight tab treatment.

```text
For you       Featured
────────
```

### Active state

- Dark text
- Thin bottom indicator
- Slightly stronger weight

### Inactive state

- Gray text
- No strong container

Avoid pill-style tabs. This is an editorial publication interface, not a
settings dashboard pretending to be a newspaper.

---

# 11. Right Discovery Rail

The right rail contains secondary discovery content.

Sections:

```text
Staff Picks

[Publication]  Article title
                Date

[Publication]  Article title
                Date

See the full list


Recommended topics

[ Data Science ] +
[ Self Improvement ] +
[ Writing ] +
[ Relationships ] +
[ Politics ] +
[ Productivity ] +


Who to follow

Avatar  Person
        Description             Follow

Avatar  Publication
        Description             Follow
```

### Rules

- Secondary to the main feed.
- Use smaller typography.
- Keep sections clearly separated by whitespace.
- Topic chips should have thin borders.
- Avoid colorful category badges.
- Follow buttons should be outlined and compact.

---

# 12. Buttons

### Primary

```text
Upgrade now
```

Use:

- Black or accent background depending on context
- White or black text
- Compact dimensions
- Moderate radius

### Secondary

```text
Follow
```

Use:

- Transparent background
- `1px` black/gray border
- Compact padding
- Small radius

### General button rule

Buttons should look like controls, not cards.

Avoid:

- Large pill buttons everywhere
- Heavy shadows
- Gradient fills
- Excessively rounded rectangles

---

# 13. Cards and Borders

The interface should not be built from a grid of floating cards.

Prefer:

```text
Content
────────────────────────────
Content
────────────────────────────
Content
```

over:

```text
┌───────────────┐
│ Content       │
└───────────────┘
```

### Border rules

- Use borders primarily as structural separators.
- Use `#E6E6E6` or similar light gray.
- Avoid double borders.
- Avoid thick outlines.

---

# 14. Icons

Use one coherent icon set.

Recommended visual characteristics:

- 18--20px
- Stroke-based
- Minimal detail
- Neutral gray/black
- Consistent stroke width

Possible implementation:

- Lucide
- Radix Icons
- Another consistent SVG icon system

Do not mix several icon families.

---

# 15. Spacing System

Use a 4px base unit.

```text
4   xs
8   sm
12  md-small
16  md
24  lg
32  xl
48  2xl
64  3xl
```

Common usage:

Context Spacing

---

Icon ↔ text `8px`
Metadata ↔ title `8–12px`
Title ↔ description `6–8px`
Article rows `28–32px` vertical
Major sections `40–56px`
Page margins `24–48px`

Whitespace is part of the hierarchy. Do not fill it merely because CSS
allows you to.

---

# 16. Border Radius

Use restrained rounding.

```css
--radius-sm: 2px;
--radius-md: 4px;
--radius-lg: 8px;
--radius-pill: 999px;
```

Recommended:

- Article thumbnails: `2–4px`
- Buttons: `4px`
- Search: `999px`
- Topic chips: `999px`

Do not make every component pill-shaped.

---

# 17. Shadows

Default:

```css
box-shadow: none;
```

The reference relies on borders, spacing, and contrast rather than
floating elevation.

If a modal or overlay requires elevation, use a subtle shadow only for
that interaction.

---

# 18. Interaction

Interactions should be quiet.

### Hover

- Slightly darker text
- Subtle background change
- Underline where semantically appropriate

### Focus

Every keyboard-accessible control must have a visible focus state.

Example:

```css
:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
```

### Article hover

A small change in title contrast or background is enough.

Do not:

- Scale article cards
- Add dramatic transforms
- Animate every icon
- Add decorative hover effects

---

# 19. Motion

Motion should reinforce navigation and state changes.

Use:

- `150–220ms` for small interactions
- `200–300ms` for content transitions
- Ease-out for entering UI

Respect reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

The interface should remain fully understandable with animations
disabled.

---

# 20. Content Hierarchy

Every page should answer these questions visually:

1.  Where am I?
2.  What content should I read?
3.  What is the most important article?
4.  What can I discover next?
5.  What navigation options are available?

Hierarchy should generally follow:

```text
Article title
    ↓
Article description
    ↓
Author/date
    ↓
Engagement metadata
```

For discovery content:

```text
Section heading
    ↓
Item title
    ↓
Metadata
```

---

# 21. Accessibility

Minimum requirements:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Proper button/link semantics
- Alt text for meaningful images
- Empty alt attributes for decorative images
- Sufficient text contrast
- Minimum practical touch target around `44px`
- Respect `prefers-reduced-motion`
- Do not communicate state through color alone

The visual minimalism must not become accessibility minimalism.

---

# 22. Responsive Breakpoints

Use content-driven breakpoints rather than blindly copying framework
defaults.

Suggested starting points:

```css
--breakpoint-mobile: 640px;
--breakpoint-tablet: 900px;
--breakpoint-desktop: 1200px;
```

### Desktop `≥ 1200px`

Show:

- Header
- Left sidebar
- Main feed
- Right discovery rail

### Tablet `900px–1199px`

Show:

- Header
- Compact sidebar/navigation
- Main feed
- Hide or reduce right rail

### Mobile `< 900px`

Show:

- Compact header
- Main feed
- No persistent sidebar
- No right rail

---

# 23. Component Architecture

Recommended components:

```text
AppShell
├── Header
│   ├── MenuButton
│   ├── Brand
│   ├── Search
│   ├── GetAppButton
│   ├── WriteButton
│   └── NotificationButton
│
├── AnnouncementBar
│
├── Sidebar
│   ├── PrimaryNavigation
│   └── FollowingList
│
├── MainContent
│   ├── FeedTabs
│   └── ArticleFeed
│       └── ArticleListItem
│
└── DiscoveryRail
    ├── StaffPicks
    ├── RecommendedTopics
    └── WhoToFollow
```

Components should be composable and content-driven.

Do not create separate components merely because an element appears
visually complex.

---

# 24. Signature Element

## The editorial rail

The defining design decision is the **strong vertical editorial
structure**:

```text
SIDEBAR       ARTICLE FEED              DISCOVERY
   │               │                        │
   │               │                        │
   │          ─────┼─────                   │
   │               │                        │
   │          ─────┼─────                   │
   │               │                        │
```

The page should feel organized by columns and typographic rhythm rather
than cards.

This is the main aesthetic risk worth preserving: **make the layout feel
like a living publication index rather than a conventional web
application.**

---

# 25. Anti-Patterns

Do not introduce these unless a product requirement explicitly demands
them:

- Generic dashboard cards
- Huge gradient hero
- Glassmorphism
- Excessive rounded containers
- Excessive shadows
- Floating action buttons
- Neon accent colors
- Decorative blobs
- Random illustrations
- Dense icon-only navigation
- Over-animated article lists
- Multiple competing accent colors
- Full-width centered text for every section

---

# 26. Implementation Checklist

Before considering the UI complete:

### Layout

- [ ] Desktop uses three editorial zones.
- [ ] Main article feed is the visual center.
- [ ] Right rail is clearly secondary.
- [ ] Sidebar does not overpower content.
- [ ] Mobile removes secondary rails cleanly.

### Typography

- [ ] Headlines have clear visual authority.
- [ ] Metadata is quieter than article content.
- [ ] Serif is used deliberately, not everywhere.
- [ ] Text widths remain comfortable for reading.

### Color

- [ ] White/neutral background dominates.
- [ ] Black provides primary hierarchy.
- [ ] Gray handles secondary information.
- [ ] Yellow is used only as an accent/announcement color.

### Components

- [ ] Article rows use dividers rather than heavy cards.
- [ ] Buttons are compact.
- [ ] Topic chips remain restrained.
- [ ] Icons use one consistent family.

### Interaction

- [ ] Hover states are subtle.
- [ ] Focus states are visible.
- [ ] Motion is restrained.
- [ ] Reduced motion is supported.

### Quality

- [ ] No unnecessary decorative elements.
- [ ] No generic SaaS visual patterns.
- [ ] Responsive behavior is intentional.
- [ ] The design still feels coherent without images.

---

# 27. One-Line Design Rule

> **Design it like a publication people happen to use as an application,
> not an application that happens to contain articles.**
