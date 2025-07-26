# CodeGenie - AI Programming Assistant

## Overview

CodeGenie is a full-stack web application that serves as an AI-powered programming assistant. Users can submit programming questions and receive AI-generated code solutions with explanations. The application features a live feed where users can see recent questions and answers from the community, creating an interactive programming help platform.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with a clear separation between client and server:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware with structured error responses

### Database Strategy
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Development Storage**: In-memory storage implementation for rapid prototyping
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Data Persistence**: Questions automatically expire after 3 hours to maintain fresh content

## Key Components

### AI Integration
- **Service**: Google Gemini AI (Gemini 2.5 Pro model)
- **Functionality**: Generates code solutions with explanations for programming questions
- **Response Format**: Structured JSON with code, explanation, and programming language detection
- **Error Handling**: Graceful fallback for AI service failures

### Form Management
- **Validation**: Zod schemas for type-safe form validation
- **Form Library**: React Hook Form with Radix UI integration
- **User Input**: Name and question fields with character limits and validation rules

### Live Feed System
- **Real-time Updates**: Polling-based refresh every 30 seconds
- **Data Expiration**: Automatic cleanup of questions older than 3 hours
- **User Interface**: Expandable cards showing questions, answers, and code snippets
- **Copy Functionality**: One-click code copying with toast notifications

### UI/UX Features
- **Dark Theme**: Consistent dark mode design with CSS variables
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Spinner indicators during AI processing
- **Toast Notifications**: User feedback for actions like copying code
- **Floating Animations**: Decorative particle effects for visual appeal

## Data Flow

### Question Submission Flow
1. User fills out form with name and programming question
2. Client-side validation using Zod schemas
3. Form submission triggers React Query mutation
4. Server validates input and calls Gemini AI service
5. AI generates code solution with explanation
6. Response stored in memory with expiration timestamp
7. Client receives structured response and updates UI
8. Live feed automatically refreshes to show new content

### Live Feed Updates
1. React Query polls `/api/questions` endpoint every 30 seconds
2. Server returns active questions (not expired)
3. Client renders updated list with expand/collapse functionality
4. Users can copy code snippets with clipboard API
5. Background cleanup removes expired questions from memory

## External Dependencies

### AI Services
- **Google Gemini AI**: Primary AI service for code generation
- **API Key Management**: Environment variable configuration
- **Structured Output**: JSON schema enforcement for consistent responses

### UI Libraries
- **Radix UI**: Accessible component primitives for complex UI patterns
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variant management
- **CLSX/Tailwind Merge**: Conditional CSS class handling

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit environment
- **TypeScript**: Strict type checking with path mapping
- **ESBuild**: Fast production builds for server code

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR support
- **API Proxy**: Integrated Express server serving both API and static files
- **Environment Variables**: Separate configuration for development and production
- **Replit Optimization**: Special handling for Replit development environment

### Production Build
- **Client Build**: Vite production build with code splitting and optimization
- **Server Build**: ESBuild bundle for Node.js deployment
- **Static Assets**: Client files served from Express static middleware
- **Process Management**: Single Node.js process handling both API and static content

### Configuration Management
- **Database**: PostgreSQL connection via environment variables
- **AI Service**: Gemini API key configuration
- **Build Scripts**: Separate commands for development, build, and production
- **Type Safety**: Shared TypeScript configuration across client and server

The application is designed for easy deployment on platforms like Replit, with environment-specific optimizations and a streamlined build process that bundles everything into a single deployable unit.