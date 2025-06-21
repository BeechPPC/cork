# Wine Recommendation Application (cork)

## Overview

cork is a full-stack web application that provides AI-powered wine recommendations and analysis. The application focuses on Australian wines and offers both recommendation services and wine image analysis capabilities. It features a freemium model with subscription-based premium features powered by Stripe.

## System Architecture

### Frontend Architecture
- **React + TypeScript**: Modern React application with TypeScript for type safety
- **Vite**: Fast build tool and development server
- **Wouter**: Lightweight client-side routing
- **TanStack Query**: Server state management and data fetching
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Pre-built UI component library with Radix UI primitives

### Backend Architecture
- **Express.js**: Node.js web framework for API endpoints
- **TypeScript**: Full type safety across the backend
- **Replit Auth**: Authentication system with session management
- **OpenAI API**: AI-powered wine recommendations and image analysis
- **Stripe**: Payment processing for premium subscriptions
- **Multer**: File upload handling for wine images

### Database
- **PostgreSQL**: Primary database using Neon serverless
- **Drizzle ORM**: Type-safe database queries and schema management
- **Session Storage**: PostgreSQL-based session management for authentication

## Key Components

### Authentication System
- Replit-based OIDC authentication with automatic user provisioning
- Session management using PostgreSQL with connect-pg-simple
- Protected routes with authentication middleware
- User profile management with Stripe integration

### Wine Recommendation Engine
- OpenAI GPT-4 integration for intelligent wine suggestions
- Natural language processing of user preferences
- Focus on Australian wine regions and producers
- Detailed wine information including tasting notes and food pairings

### Image Analysis Service
- Wine bottle/label image upload and analysis
- AI-powered wine identification and valuation
- Optimal drinking window predictions
- Image storage and processing with file validation

### Subscription Management
- Freemium model with usage limits (3 saved wines, 2 uploads for free users)
- Stripe integration for premium subscriptions
- Plan limit enforcement and upgrade prompts
- Payment processing with webhook handling

### Data Management
- Wine cellar functionality for saving favorite wines
- Upload history tracking for analyzed wines
- Recommendation history storage
- Usage tracking for plan limit enforcement

## Data Flow

1. **User Authentication**: Users log in via Replit Auth, creating/updating user records
2. **Wine Recommendations**: Users input preferences → OpenAI processes request → recommendations saved to history
3. **Image Analysis**: Users upload wine images → OpenAI Vision analyzes → results stored in database
4. **Subscription Flow**: Users upgrade → Stripe processes payment → database updated with subscription status
5. **Data Access**: All user data accessed through Drizzle ORM with type-safe queries

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL hosting
- **OpenAI API**: GPT-4 for recommendations and GPT-4 Vision for image analysis
- **Stripe**: Payment processing and subscription management
- **Replit Auth**: Authentication provider

### Development Tools
- **Vite**: Development server and build tool
- **ESBuild**: Production build compilation
- **PostCSS/Autoprefixer**: CSS processing
- **TypeScript**: Type checking and compilation

## Deployment Strategy

### Development Environment
- Replit-hosted development with hot module replacement
- PostgreSQL module provisioned automatically
- Environment variables for API keys and database connections
- Cartographer integration for development monitoring

### Production Build
- Vite builds client-side React application
- ESBuild compiles server-side Express application
- Static assets served from dist/public directory
- Single-process deployment with built-in static file serving

### Configuration Management
- Environment-based configuration (NODE_ENV)
- Separate development and production database connections
- API key management through environment variables
- Session secret and Stripe key configuration

## Changelog

- June 17, 2025: Initial setup
- June 17, 2025: Fixed wine saving functionality - resolved data type validation errors for vintage, ABV, and rating fields
- June 17, 2025: Updated Stripe API integration to latest version for subscription handling
- June 17, 2025: Enhanced error handling and debugging for wine operations
- June 18, 2025: Improved text color contrast across all components for better readability
- June 18, 2025: Added red wine gradient to hero section "Perfect Wine Match" text and darkened hero text colors
- June 18, 2025: Redesigned hero section with modern full-screen layout, glassmorphism effects, and enhanced visual elements
- June 18, 2025: Updated pricing structure to $4.99/month or $49.99/year for Premium plan
- June 18, 2025: Enhanced premium features with food pairing suggestions and cellar analytics
- June 18, 2025: Implemented authentic data integration for premium features - removed all mock data and integrated real wine collection analytics
- June 18, 2025: Removed investment tracking feature per user request
- June 18, 2025: Added AI meal & menu photo analysis feature - users can upload photos of food or wine menus for intelligent pairing recommendations
- June 18, 2025: Integrated meal pairing feature into main Dashboard interface using tabs for better UX
- June 19, 2025: Implemented complete Stripe payment system for premium subscriptions with 7-day free trial
- June 19, 2025: Added monthly ($4.99) and yearly ($49.99) subscription plans with proper Stripe Price ID integration
- June 19, 2025: Fixed routing issues causing occasional 404 pages during navigation
- June 19, 2025: Configured production Stripe integration with live keys - real payments are now processed
- June 19, 2025: Implemented Stripe Checkout flow with proper monthly/yearly subscription options and success handling
- June 19, 2025: Added comprehensive Stripe webhook handling for subscription lifecycle management
- June 19, 2025: Implemented voice-to-text wine search as premium feature using Web Speech API
- June 19, 2025: Added seamless profile setup with age verification (18+) and wine preferences collection
- June 20, 2025: Implemented email capture modal for pre-launch marketing on landing page
- June 20, 2025: Updated all branding to lowercase "cork" as per brand guidelines
- June 20, 2025: Updated all text to use Australian English spelling and grammar
- June 20, 2025: Implemented email confirmation system with SendGrid for email capture signups
- June 20, 2025: Added social media icons and links (Facebook, Instagram, Threads, LinkedIn) to landing page footer
- June 20, 2025: Created comprehensive Contact Us page with contact form, social media links, FAQ section, and email functionality
- June 21, 2025: Built Help Centre page with comprehensive FAQ covering app usage, data privacy, and subscription management
- June 21, 2025: Created comprehensive Wine Education page covering Australian wine regions, grape varieties, famous wineries, and wine basics
- June 21, 2025: Expanded Wine Education page to include all major Australian wine regions organized by state (SA, NSW, VIC, WA, TAS) with detailed information on varieties, wineries, and food pairings

## User Preferences

Preferred communication style: Simple, everyday language.