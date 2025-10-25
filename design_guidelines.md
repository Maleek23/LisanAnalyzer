# Design Guidelines for Lisan - Quranic Arabic Linguistic Analyzer

## Design Approach
**Reference-Based with Cultural Authenticity**: Drawing inspiration from scholarly Islamic resources and manuscript traditions while incorporating modern web application patterns. The design prioritizes reverence, readability, and elegant presentation of sacred text.

## Core Design Elements

### A. Typography System

**Arabic Text (Primary)**
- Font Family: "Amiri" (Google Fonts) - elegant, traditional Islamic calligraphy aesthetic
- Large, highly readable sizes: 
  - Verses: 28px minimum (text-3xl)
  - Word Analysis Headers: 36px (text-4xl)
  - Search Results: 24px (text-2xl)
- Line height: 2.0 for Arabic text (leading-loose)
- Font weight: Regular (400) for body, Medium (500) for emphasis

**English Text (Secondary)**
- Font Family: "Inter" for UI elements, "Crimson Pro" for scholarly content
- Sizes: 16px body (text-base), 14px metadata (text-sm), 20px headings (text-xl)
- Line height: 1.6 for reading comfort
- Weight: Regular (400) for body, Semibold (600) for headings

**Bismillah Calligraphy**
- Display at 48px+ (text-5xl) at top of homepage
- Font: Amiri with ornamental styling

### B. Color Palette

**Primary Colors**
- Deep Emerald Green: #0F5F4E (backgrounds, primary actions)
- Gold Accent: #D4AF37 (highlights, important elements, word emphasis)
- Cream Background: #FAF9F6 (main background, card surfaces)

**Supporting Colors**
- Dark Text: #1F2937 for English content
- Arabic Text: #0F172A (near-black for maximum readability)
- Subtle Gray: #E5E7EB for borders and dividers
- Success Green: #059669 for checkmark animations
- Light Gold: #F3E5AB for hover states

### C. Layout System

**Spacing Primitives (Tailwind)**
- Tight spacing: p-2, gap-2 (8px)
- Standard spacing: p-4, gap-4, m-4 (16px)
- Generous spacing: p-8, py-12 (32px, 48px) for section padding
- Extra-large: py-20, py-24 (80px, 96px) for major sections

**Container Strategy**
- Maximum width: max-w-7xl (1280px) for main content
- Reading width: max-w-4xl (896px) for verse displays
- Card width: max-w-2xl for featured word cards

**RTL/LTR Handling**
- Arabic sections: dir="rtl" with text-right
- English sections: dir="ltr" with text-left
- Automatic direction switching based on content language
- Mirrored padding/margin for RTL (pr/pl swap)

### D. Component Library

**Homepage Components**
1. **Header**: Centered Bismillah in calligraphic Amiri (48px), subtle gold underline decoration
2. **Hero Search Bar**: 
   - Large centered input (h-16, text-2xl)
   - Arabic placeholder text
   - Emerald green focus ring (ring-emerald-600)
   - Search icon in gold on right side (RTL)
   - Autocomplete dropdown with Islamic border pattern
3. **Background Pattern**: Subtle Islamic geometric tessellation in light emerald (opacity-5)
4. **Tagline**: Crimson Pro, 20px, centered below search

**Featured Words Cards** (Homepage)
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Card design:
  - Cream background with soft shadow (shadow-md)
  - Rounded corners (rounded-xl)
  - Emerald green border on hover (border-emerald-600)
  - Arabic word in large Amiri (32px)
  - Root in gold badge (bg-gold, rounded-full, px-4, py-1)
  - Brief meaning in English below
  - Hover: Slight elevation (hover:shadow-xl, transition-all)

**Results Page Components**

1. **Word Analysis Card**:
   - Large Arabic word at top (text-5xl, Amiri)
   - Root displayed in geometric badge (hexagon-shaped div with gold border)
   - Tabs navigation: Root Analysis | Meanings | Quranic Occurrences | Translation Comparison
   - Tab styling: Emerald underline for active (border-b-4 border-emerald-600)

2. **Verse Cards**:
   - White/cream background (bg-cream)
   - Soft rounded corners (rounded-2xl)
   - Shadow on hover (hover:shadow-lg)
   - Structure:
     - Surah:Ayah reference (gold text, text-sm, font-semibold)
     - Full Arabic verse (text-3xl, Amiri, RTL, leading-loose)
     - Highlighted searched word (bg-gold with bg-opacity-20)
     - Transliteration (text-sm, gray, italic, toggle-able)
     - Translation divider (border-t with Islamic pattern)
     - 3 translations in columns (grid-cols-1 md:grid-cols-3, gap-6)
   - Copy button: Absolute top-right, ghost button with emerald hover

3. **Translation Comparison Table**:
   - Side-by-side layout (grid-cols-1 md:grid-cols-3)
   - Translator name headers in emerald
   - Divergent words color-coded (text-red-600 for "strike" vs text-emerald-600 for "separate")
   - Linguistic note box below (bg-emerald-50, border-l-4 border-emerald-600, p-6)

4. **Meanings Expandable Sections**:
   - Accordion-style (closed by default)
   - Arrow icon rotates on open
   - Each meaning has:
     - Arabic meaning in Amiri
     - English explanation
     - Context note (when this applies)
     - Example verse reference

### E. Microinteractions & Animations

**Keep Minimal and Purposeful**
- Search results: Fade-in (animate-fadeIn, duration-300)
- Verse card hover: Subtle lift (transform translate-y-1, shadow-lg)
- Copy action: Checkmark replaces icon (animate-bounce-once)
- Tab switching: Smooth content fade (transition-opacity)
- Search suggestions: Slide down (animate-slideDown)
- NO continuous animations, NO distracting parallax

**Islamic Pattern Decorations**
- Corner ornaments on major cards (SVG geometric patterns)
- Subtle border patterns on dividers (CSS border-image with repeating Islamic motif)
- Manuscript-style page borders (thin gold lines with corner flourishes)

## Images Section

**No Large Hero Images**: This application relies on calligraphic typography and geometric patterns rather than photographic hero images. The visual impact comes from:
- Beautiful Arabic typography at large scale
- Subtle animated Islamic geometric background patterns
- Elegant manuscript-inspired borders and ornaments
- Color and whitespace creating breathing room

**Icon Usage**
- Lucide React icons for UI actions (search, copy, book, chevrons)
- Custom SVG Islamic geometric patterns for decorative elements
- Icons in emerald green or gold depending on context

## Responsive Strategy

**Mobile (base)**
- Single column layouts
- Search bar full width with reduced height (h-14)
- Featured cards stack vertically
- Verse translations stack (no side-by-side)
- Arabic text scales down to 24px minimum
- Padding reduced (py-8 instead of py-20)

**Tablet (md:)**
- 2-column grids for featured words
- Side-by-side layout begins for translations
- Larger touch targets (min-h-12 for buttons)

**Desktop (lg:)**
- 3-column grids
- Maximum typography sizes
- Generous whitespace (py-24)
- Multi-column translation comparisons

## Critical Accessibility & Cultural Considerations

- `lang="ar"` attribute on all Arabic text containers
- Proper semantic HTML (article for verses, section for analysis)
- High contrast ratios (emerald on cream = 7:1+)
- Screen reader announcements for verse copying
- Keyboard navigation through tabs and cards
- Respectful spacing around sacred text (never cramped)
- Right-to-left reading order preserved throughout