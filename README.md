# 🍷 cork - AI-Powered Australian Wine Discovery

[![Deploy to Replit](https://repl.it/badge/github/getcork/cork)](https://replit.com/@getcork/cork)

**cork** is a premium Australian wine discovery platform that combines AI-powered recommendations with expert sommelier knowledge to help wine enthusiasts discover their perfect match.

## 🌟 Features

### Core Functionality
- **AI Wine Recommendations** - Natural language wine suggestions powered by OpenAI GPT-4
- **Wine Image Analysis** - Upload wine bottle photos for AI-powered identification and valuation
- **Personal Wine Cellar** - Save and manage your favourite wine discoveries
- **Australian Wine Focus** - Specialised knowledge of Australian wine regions and producers

### Premium Features
- **Voice-to-Text Search** - Speak your wine preferences using Web Speech API
- **Meal Photo Pairing** - Upload food photos for intelligent wine pairing suggestions
- **Wine Menu Analysis** - Upload restaurant wine menus and ask specific questions
- **Advanced Cellar Analytics** - Detailed insights into your wine collection
- **Food Pairing Suggestions** - Expert sommelier recommendations for each wine

### Educational Content
- **Comprehensive Wine Education** - Learn about Australian wine regions, grape varieties, and wineries
- **Interactive Wine Map** - Explore wine regions across all Australian states
- **Winery Explorer** - Discover Australian wineries with contact details and specialties

## 🎨 Brand Guidelines

### Visual Identity
- **Primary Color**: "Grape" purple (`#6B46C1`)
- **Secondary Colors**: Cream (`#FFFBEB`), Slate (`#1E293B`)
- **Typography**: Poppins (headings), Inter (body text)
- **Brand Name**: Always lowercase "cork" - never "Cork" or "CORK"

### Language & Tone
- **Australian English** spelling and grammar throughout
- **Premium but approachable** - sophisticated without being intimidating
- **Educational focus** - helping users learn about wine
- **Respectful of responsible drinking** - includes age verification and drinking guidelines

### Design Principles
- **Mobile-first responsive design**
- **Clean, minimal aesthetic** with generous white space
- **Card-based layouts** for easy scanning
- **Consistent use of badges and icons** for visual hierarchy
- **Accessibility-focused** with proper contrast and screen reader support

## 🏗️ Technical Architecture

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and builds
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management
- **Tailwind CSS** with Shadcn/ui components
- **Framer Motion** for smooth animations

### Backend
- **Express.js** with TypeScript
- **Replit Auth** for secure authentication
- **PostgreSQL** with Neon serverless hosting
- **Drizzle ORM** for type-safe database operations
- **OpenAI API** (GPT-4 and GPT-4 Vision) for AI features

### Infrastructure
- **Replit** hosting and development environment
- **Stripe** for subscription management and payments
- **SendGrid** for transactional emails
- **Multer** for file upload handling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- Required API keys (see Environment Variables)

### Environment Variables
```env
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Installation
```bash
# Clone the repository
git clone https://github.com/getcork/cork.git
cd cork

# Install dependencies
npm install

# Set up database schema
npm run db:push

# Start development server
npm run dev
```

### Database Setup
The app uses Drizzle ORM with PostgreSQL. Schema is defined in `shared/schema.ts`:
- Users with subscription management
- Wine collections (saved and uploaded wines)
- Recommendation history
- Email signups

## 💳 Subscription Model

### Free Tier
- 3 saved wines
- 2 wine photo uploads
- Basic wine recommendations
- Educational content access

### Premium Tier ($4.99/month or $49.99/year)
- Unlimited saved wines
- Unlimited photo uploads
- Voice search functionality
- Meal photo pairing
- Wine menu analysis
- Advanced cellar analytics
- Food pairing suggestions

## 📱 Mobile Experience

The app is designed mobile-first with responsive breakpoints:
- **Mobile**: Single column layout, inline details, touch-optimised
- **Tablet**: Adaptive grid layouts
- **Desktop**: Multi-column layouts with sidebar details

Key mobile features:
- Camera integration for direct photo capture
- Touch-friendly interfaces
- Inline expansion of content (wine regions/varieties)
- Optimised tab layouts (2x2 grid on mobile)

## 🛣️ Roadmap

### Phase 1: Core Platform (Completed)
- ✅ AI wine recommendations
- ✅ Image analysis and wine identification
- ✅ Personal wine cellar
- ✅ Subscription management
- ✅ Educational content

### Phase 2: Enhanced AI Features (Completed)
- ✅ Voice search integration
- ✅ Meal photo pairing
- ✅ Wine menu analysis
- ✅ Advanced analytics

### Phase 3: Native Mobile App (Q2 2025)
- **React Native development** for iOS and Android
- **Offline wine collection** browsing
- **Push notifications** for cellar reminders
- **Camera-first experience** with improved photo capture
- **Location-based features** for nearby wineries and wine shops
- **Social features** for sharing wine discoveries

### Phase 4: Community & Social (Q3 2025)
- **User wine reviews and ratings**
- **Wine collections sharing**
- **Tasting notes and personal cellar tracking**
- **Wine community forums**
- **Virtual tasting events**

### Phase 5: E-commerce Integration (Q4 2025)
- **Direct wine purchasing** from partner retailers
- **Price comparison** across multiple vendors
- **Availability tracking** for recommended wines
- **Subscription wine boxes** curated by AI
- **Winery direct integration**

### Phase 6: Advanced AI & Personalisation (2026)
- **Machine learning** for personalised recommendations
- **Palate profiling** based on user preferences and history
- **Predictive analytics** for wine aging and optimal drinking windows
- **AI sommelier chat** for real-time wine advice
- **Computer vision** for wine label recognition and authenticity verification

## 🔧 Development Guidelines

### Code Standards
- **TypeScript** for all new code
- **ESLint** and **Prettier** for formatting
- **Component-based architecture** with reusable UI components
- **Type-safe database operations** using Drizzle schemas
- **Responsive design** with mobile-first approach

### Testing Strategy
- **Manual testing** for UI/UX validation
- **API testing** with Postman/curl
- **Database migration testing** with staging environment
- **Performance monitoring** with built-in metrics

### Deployment
- **Replit Deployments** for staging and production
- **Environment-based configuration**
- **Automated dependency management**
- **Zero-downtime deployments**

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with proper TypeScript types
3. Test on mobile and desktop viewports
4. Update documentation if needed
5. Submit pull request with detailed description

### Commit Guidelines
Use conventional commit format:
```
feat: add wine menu analysis feature
fix: resolve mobile layout issues
docs: update API documentation
style: improve button hover states
```

## 📊 Analytics & Monitoring

### Key Metrics
- **User engagement**: wine searches, saves, uploads
- **Conversion rates**: free to premium subscriptions
- **Feature adoption**: voice search, photo uploads, menu analysis
- **Performance**: API response times, page load speeds
- **User satisfaction**: support tickets, feature requests

### Error Monitoring
- **Server-side logging** for API endpoints
- **Client-side error tracking** for React components
- **Database query monitoring** for performance optimisation
- **AI service reliability** tracking for OpenAI API calls

## 🔐 Security & Privacy

### Data Protection
- **GDPR compliance** with user data rights
- **Australian Privacy Principles** adherence
- **Secure password hashing** with industry standards
- **API key protection** with environment variables
- **HTTPS enforcement** for all communications

### Age Verification
- **18+ age verification** required for all users
- **Responsible drinking guidelines** prominently displayed
- **Regional compliance** with Australian alcohol regulations

## 📞 Support & Contact

### Technical Support
- **Email**: support@getcork.au
- **Documentation**: Available in `/docs` directory
- **Issue Tracking**: GitHub Issues for bug reports and feature requests

### Business Inquiries
- **Partnership opportunities** with wineries and retailers
- **Enterprise licensing** for wine industry professionals
- **Media and press** inquiries welcome

## 📄 License

This project is proprietary software owned by cork. All rights reserved.

### Third-Party Licenses
- **React**: MIT License
- **Tailwind CSS**: MIT License
- **OpenAI API**: Commercial License Required
- **Stripe**: Commercial License Required

---

**cork** - Discover your perfect wine match with AI-powered recommendations and expert Australian wine knowledge.

Built with ❤️ for wine enthusiasts across Australia.