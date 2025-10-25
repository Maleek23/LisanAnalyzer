# Lisan - Quranic Arabic Linguistic Analyzer

## Overview

Lisan is a full-stack web application designed to help users understand Arabic words from the Quran through deep linguistic analysis. The platform exposes the semantic depth that Arabic words carry across grammatical, historical, theological, and contextual layers, with the goal of preventing mistranslations and restoring linguistic dignity to the Qur'an.

**Core Philosophy**: Context over literal meaning. Grammar over root. Scholarship over opinion.

**Current Status**: MVP with enhanced landing page completed (October 2025)

The application enables users to:
- ✅ Search for Quranic words using Arabic script OR English transliteration (e.g., "daraba" finds "ضرب")
- ✅ Analyze word roots, morphological patterns, and multiple contextual meanings
- ✅ View all Quranic occurrences of a word with verse context
- ✅ Compare translations from different scholars (Sahih International, Yusuf Ali, Pickthall)
- ✅ Understand different meanings within the same root across contexts

**Seeded Data**: 6 featured words with full analysis:
- ضرب (daraba) - strike/travel/set forth examples
- قوامون (qawwamun) - maintainers/supporters
- جلابيبهن (jalabibihin) - outer garments
- نشوزهن (nushuzahunn) - discord/rebellion
- بخمرهن (bikhumurihin) - head coverings
- الفتنة (alfitnah) - persecution/oppression

## Recent Updates

### October 25, 2025 - Production Features: Submissions, Moderation & Data Expansion
Scaled application from MVP demo to production-ready tool with user submissions and moderation workflow:

**Database Schema Expansion**:
- Added `scholar_profiles` table for proper scholar attribution (name, credentials, affiliation, expertise, century, isClassical)
- Added `word_submissions` table for user word requests (word, transliteration, submitterEmail, reason, status, priority, requestCount)
- Added `moderation_queue` table for content review workflow (submissionId, contentType, contentData, status, reviewerId, reviewNotes)
- Fixed Arabic search bug by enabling pg_trgm extension and using exact + partial matching (eq + ilike)
- Arabic search now works with URL-encoded queries (e.g., `?q=%D9%82%D9%88%D8%A7%D9%85%D9%88%D9%86`)

**Submission Workflow**:
- Users can request word analysis if word not in database
- Submissions tracked with priority (request count auto-increments for duplicate requests)
- Status pipeline: pending → reviewing → approved → rejected → published
- Email capture for notifying submitters when analysis is complete

**Moderation Workflow**:
- Content (word_analysis, tafsir, meaning) routed to moderation_queue before publication
- Reviewers can approve/reject with notes
- Maintains scholarly integrity and prevents misinformation
- JSONB storage for flexible content types

**Next Steps**:
- Seed database with 400-500 basic words (word + root + transliteration + verse occurrences)
- Add full analysis (tafsir + grammar patterns) for top 20-30 controversial words
- Build submission API endpoints and user-facing request form
- Implement rate limiting and caching for production usage

### October 25, 2025 - Scholarly Commentary & Contextual Analysis System
Expanded the controversial word deep-dive with scholarly interpretations and verse context analysis:

**Database Enhancements**:
- Added `tafsir` table for scholarly commentary (scholar, text, layer, century, translation)
- Seeded 5 tafsir entries for verse 4:34 spanning 9th to 21st century:
  - Classical exegetes: Al-Tabari (9th century), Ibn Kathir (14th century)
  - Modern reformists: Laleh Bakhtiar (20th century), Khaled Abou El Fadl (21st century), Asma Barlas (21st century)
- Demonstrates evolution from classical permissibility (with conditions) to modern linguistic reinterpretation

**New UI Components**:
- **ScholarlyTimeline**: Timeline visualization showing interpretation evolution across 12 centuries
  - Chronologically sorted entries with century badges and layer categorization
  - Arabic text for classical scholars with English translations
  - English-only interpretations for modern scholars
  - Proper ordinal formatting (9th, 14th, 20th, 21st Century CE/AH)
- **ContextualFlow**: Side-by-side verse sequence display (4:34 → 4:35)
  - Demonstrates Quranic flow from marital discord steps to arbitration/reconciliation
  - Highlights grammatical anomaly (no qualifier in 4:34 vs all other "strike" verses)
  - Shows how 4:35's immediate arbitration supports "separate" interpretation

**Enhanced Word Analysis Interface**:
- Controversial words now show **6 tabs** (up from 4):
  1. Grammar Analysis (default) - Usage statistics and qualifier patterns
  2. Contextual Flow - Verse sequence analysis
  3. Scholarly Timeline - Interpretation evolution
  4. Meanings - Contextual definitions
  5. Quranic Occurrences - All verses
  6. Translation Comparison - Translator differences
- Tab visibility is conditional: Grammar/Context/Scholarly tabs only appear for controversial words with tafsir data

**API Updates**:
- `/api/word/:word` now returns `tafsir` array aggregated across all verse occurrences
- Tafsir data also included per-occurrence for verse-specific commentary
- Fully typed TypeScript interfaces for tafsir data throughout the stack

**Key Scholarly Insight**:
Modern scholars increasingly challenge the "strike" translation by citing:
1. Prophetic practice (Muhammad ﷺ never struck his wives)
2. Grammar patterns (absence of qualifiers = metaphorical usage)
3. Contextual flow (verse 4:35 immediately follows with arbitration)
4. Multiple meanings of ضرب root (travel, separate, set forth examples)

### October 25, 2025 - Controversial Word Deep-Dive Feature
Implemented comprehensive grammar pattern analysis for historically mistranslated words like ضرب (daraba):

**Database Enhancements**:
- Added `hasQualifier`, `qualifier`, and `usageCategory` fields to `word_occurrences` table
- Seeded 15 daraba occurrences showing grammar patterns (6 physical with qualifiers, 8 metaphorical without, 1 controversial)
- Demonstrates the key linguistic insight: physical "strike" ALWAYS has qualifiers (instrument + location), absence indicates metaphorical meaning

**UI Components**:
- **Controversy Banner**: Alerts users to historically mistranslated words (WordAnalysis.tsx)
- **Grammar Analysis Tab**: New tab showing usage statistics and qualifier patterns (default view for controversial words)
- **Usage Statistics**: Visual cards showing physical (40%), metaphorical (53%), controversial (7%) distribution
- **Grammar Pattern Table**: Interactive table displaying qualifier presence/absence for each occurrence
- **Enhanced Typing**: Full TypeScript interfaces for new fields across frontend and backend

**API Updates**:
- Modified `/api/word/:word` to return ALL root occurrences (not just exact word match)
- Returns 15 ضرب variations when searching "daraba" (اضرب, يضرب, ضربتم, etc.)
- Includes hasQualifier, qualifier, usageCategory in API response

**Key Insight Highlighted**:
Verse 4:34 (اضربوهن) has NO qualifier - unlike ALL other "strike" verses (2:60, 2:73, 8:12, 20:77, 26:63) which specify WHAT to strike with and WHERE. This grammatical anomaly supports the "separate/leave" interpretation over "strike".

### October 25, 2025 - Enhanced Landing Page
Transformed homepage into comprehensive landing page with "Al-Azhar library illuminated by daylight" aesthetic:
- **Enhanced Hero Section**: Full-viewport with Bismillah, animated scroll indicator
- **Problem Statement Cards**: 3-card grid (Viral Misquotes, Shallow Translations, Fake Hadiths)
- **Features Showcase**: 4 interactive tabs (Linguistic, Rhetorical, Scholarly, Modern)
- **Hadith Verification Preview**: Split-screen demo of upcoming verification feature
- **Scholar Trust Section**: Profile cards + testimonial + statistics
- **Professional Footer**: Complete navigation (Product, Community, Resources)

Components added: `ProblemCards.tsx`, `FeaturesShowcase.tsx`, `HadithPreview.tsx`, `ScholarSection.tsx`, `Footer.tsx`

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with Vite build system
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for Islamic aesthetic
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Type Safety**: TypeScript throughout

**Design System**:
- Custom color palette: Deep emerald green (#0F5F4E), gold accent (#D4AF37), cream background (#FAF9F6)
- Typography: "Amiri" font for Arabic text (manuscript-inspired), "Inter" for UI, "Crimson Pro" for scholarly content
- RTL-aware layout system for seamless Arabic/English text handling
- Islamic geometric patterns as decorative background elements
- Large, highly readable font sizes for Arabic text (minimum 24-28px for verses)

**Key Pages**:
- **Home**: Search interface with featured commonly-mistranslated words
- **WordPage**: Detailed word analysis with tabbed sections for linguistic foundation, meanings, and Quranic occurrences

### Backend Architecture

**Framework**: Express.js (Node.js)
- **API Pattern**: RESTful endpoints for search and word analysis
- **Development**: Hot module replacement via Vite middleware in development mode
- **Build**: esbuild for production bundling

**API Endpoints**:
- `GET /api/search?q=<query>` - Search for words by Arabic text, transliteration, or root
- `GET /api/word/:word` - Get detailed analysis of a specific word including meanings, root, and all occurrences

**Architecture Decisions**:
- Monorepo structure with shared TypeScript schemas between client and server
- Development server integrates Vite for frontend and Express for backend in single process
- Production build generates static frontend assets and bundled backend server

### Data Storage

**Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM for type-safe database queries
- **Schema Design**:
  - `verses` - Quranic verse text in Arabic with optional transliteration
  - `translations` - Multiple translations per verse (Sahih International, Yusuf Ali, Pickthall, etc.)
  - `roots` - Arabic word roots with contextual meanings and definitions
  - `word_occurrences` - Tracks every occurrence of words in the Quran, linked to verses and roots

**Schema Rationale**:
- Normalized design separates verses from translations to support multiple translators
- JSONB column for `meanings` in roots table allows flexible storage of contextual definitions with examples
- Indexes on `(surah, ayah)` and `(verse_id, translator)` for query performance
- Word occurrences table enables semantic network analysis (co-occurrence patterns)

**Alternative Considered**: 
- MongoDB was considered for flexible schema but rejected in favor of PostgreSQL for relational integrity between verses, translations, and word occurrences

### External Dependencies

**Third-Party Services**:
- **Neon Database**: Serverless PostgreSQL hosting
- **Google Fonts**: Amiri, Inter, and Crimson Pro typefaces
- **Replit Platform Services**: 
  - Development tooling (vite-plugin-cartographer, vite-plugin-dev-banner)
  - Runtime error overlay for debugging

**UI Component Libraries**:
- **Radix UI**: Headless accessible component primitives (accordion, dialog, tabs, tooltip, etc.)
- **Shadcn/ui**: Pre-styled component system built on Radix
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel/slider functionality

**Data & Forms**:
- **React Hook Form**: Form state management with Zod schema validation
- **Drizzle-Zod**: Auto-generate Zod schemas from Drizzle database schemas
- **TanStack Query**: Async state management and caching for API calls

**Development Tools**:
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast JavaScript bundler for production builds
- **PostCSS + Autoprefixer**: CSS processing
- **Tailwind CSS**: Utility-first styling

**Design Considerations**:
- Heavy reliance on Radix UI ensures accessibility compliance (ARIA patterns, keyboard navigation)
- TanStack Query eliminates need for Redux/Zustand by handling all server state caching
- Drizzle ORM chosen over Prisma for lighter weight and better integration with serverless PostgreSQL
- Component-based architecture allows for easy expansion to hadith verification and misconception debunking features in future iterations