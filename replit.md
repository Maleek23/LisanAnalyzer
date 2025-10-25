# Lisan - Quranic Arabic Linguistic Analyzer

## Overview

Lisan is a full-stack web application designed to help users understand Arabic words from the Quran through deep linguistic analysis. The platform exposes the semantic depth that Arabic words carry across grammatical, historical, theological, and contextual layers, with the goal of preventing mistranslations and restoring linguistic dignity to the Qur'an.

**Core Philosophy**: Context over literal meaning. Grammar over root. Scholarship over opinion.

The application enables users to:
- Search for Quranic words or phrases in Arabic or transliteration
- Analyze word roots, morphological patterns, and multiple contextual meanings
- View all Quranic occurrences of a word with verse context
- Compare translations from different scholars to identify divergences
- Understand rhetorical devices and linguistic nuances (Balagha)

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