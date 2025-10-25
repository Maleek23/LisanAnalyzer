# Lisan - Quranic Arabic Linguistic Analyzer

## Overview

Lisan is a full-stack web application aimed at providing deep linguistic analysis of Quranic Arabic words to prevent mistranslations and restore the linguistic dignity of the Qur'an. It emphasizes context over literal meaning, grammar over root, and scholarship over opinion. The platform allows users to search for Quranic words, analyze their roots, morphological patterns, and contextual meanings, view all Quranic occurrences, compare translations, and understand different meanings within the same root. The project currently features an MVP with 406 common Quranic words and detailed analyses for 6 featured words.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React and Vite, utilizing Shadcn/ui (based on Radix UI) for components and Tailwind CSS for styling. State management is handled by TanStack Query, and Wouter is used for lightweight routing. TypeScript ensures type safety. The design system features a custom Islamic aesthetic with a deep emerald green, gold accent, and cream background, along with "Amiri" font for Arabic text and "Inter" for UI. Key pages include a search-focused Home page and a detailed WordPage with tabbed sections for linguistic analysis.

### Backend Architecture

The backend uses Express.js (Node.js) to provide RESTful API endpoints for searching and retrieving word analyses. It operates within a monorepo structure, sharing TypeScript schemas with the client. The development server integrates Vite for the frontend and Express for the backend.

### Data Storage

PostgreSQL, hosted on Neon serverless, is used for data storage with Drizzle ORM for type-safe queries. The schema includes tables for verses, translations, roots, and word occurrences. This normalized design supports multiple translators per verse, flexible storage of contextual definitions, and efficient querying.

### System Design Choices

The application supports user submissions for new word analyses, which go through a moderation queue to maintain scholarly integrity. Controversial words feature deep-dive analyses including grammar patterns, scholarly timelines, and contextual flow, highlighting linguistic nuances and the evolution of interpretations across centuries.

## External Dependencies

**Third-Party Services**:
- **Neon Database**: Serverless PostgreSQL hosting.
- **Google Fonts**: Amiri, Inter, and Crimson Pro typefaces.
- **Replit Platform Services**: Development tooling and runtime error overlay.

**UI Component Libraries**:
- **Radix UI**: Headless accessible component primitives.
- **Shadcn/ui**: Pre-styled component system built on Radix.
- **Lucide React**: Icon library.
- **Embla Carousel**: Carousel/slider functionality.

**Data & Forms**:
- **React Hook Form**: Form state management with Zod validation.
- **Drizzle-Zod**: Auto-generates Zod schemas from Drizzle.
- **TanStack Query**: Async state management and caching.

**Development Tools**:
- **tsx**: TypeScript execution for development server.
- **esbuild**: Fast JavaScript bundler.
- **PostCSS + Autoprefixer**: CSS processing.
- **Tailwind CSS**: Utility-first styling.