
# AI Calling Platform

An advanced AI-powered calling platform built with React, TypeScript, and Supabase that enables businesses to create, manage, and analyze AI-driven phone campaigns with comprehensive analytics and real-time monitoring.

## 🚀 Project Overview

This platform provides a complete solution for managing AI-powered phone calls with enterprise-grade features including:

- **🤖 Intelligent Agent Management**: Create and configure AI agents with custom voices, languages, and behaviors
- **📞 Advanced Campaign Management**: Set up inbound and outbound calling campaigns with sophisticated targeting
- **👥 Contact Management**: Organize and manage contact lists with detailed analytics
- **📝 Dynamic Script Management**: Create conversation scripts with conditional logic and branching
- **🧠 Knowledge Base Integration**: Build AI knowledge bases for enhanced conversation capabilities
- **📊 Real-time Analytics**: Comprehensive call analytics with detailed transcriptions and performance metrics
- **🔍 Data Extraction**: Configure custom data extraction from conversations with automated reporting
- **🎯 Performance Monitoring**: Real-time dashboard with KPIs and campaign performance tracking

## ✨ Key Features

### 🤖 AI Agent Configuration
- **Custom Voice Selection**: Choose from multiple AI voices and adjust speech parameters
- **Multi-language Support**: Configure agents for different languages and regions
- **System Prompt Customization**: Fine-tune AI behavior with custom prompts
- **Knowledge Base Integration**: Connect agents to specific knowledge bases
- **Script Assignment**: Assign dynamic conversation scripts to agents

### 📞 Campaign Management
- **Inbound & Outbound Campaigns**: Support for both call types with unified management
- **Contact List Integration**: Advanced contact management with filtering and segmentation
- **Real-time Campaign Monitoring**: Live dashboard with campaign status and metrics
- **Advanced Scheduling**: Time-based campaign execution with timezone support
- **Call Routing**: Intelligent call routing based on agent availability and expertise

### 📊 Analytics & Reporting
- **Detailed Call Metrics**: Comprehensive statistics including duration, success rates, and outcomes
- **Real-time Dashboard**: Live KPI tracking with visual charts and graphs
- **Call Transcription**: Complete conversation transcripts with searchable content
- **Audio Playback**: Full call recording playback with timeline navigation
- **Custom Data Extraction**: Configurable data extraction with automated reporting
- **Performance Analytics**: Agent and campaign performance analysis

### 🔐 Security & Authentication
- **Secure Authentication**: Robust user authentication via Supabase
- **Row-level Security**: Database-level security for data protection
- **API Key Management**: Secure API integration management
- **User Permissions**: Role-based access control

## 🛠 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Database, Authentication, Edge Functions, Real-time)
- **State Management**: TanStack Query (React Query)
- **Charts & Visualization**: Recharts
- **Icons**: Lucide React
- **Audio Processing**: Native Web Audio API
- **Real-time Updates**: Supabase Realtime

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── agent-config/   # Agent configuration components
│   ├── call-details/   # Call analysis and details components
│   ├── campaign/       # Campaign management components
│   ├── kbs/           # Knowledge base components
│   └── script/        # Script management components
├── hooks/              # Custom React hooks for data fetching
├── pages/              # Main application pages
├── contexts/           # React contexts for global state
├── integrations/       # External service integrations
└── utils/              # Utility functions and helpers
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for backend services)

### Installation

1. **Clone the repository:**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up Supabase:**
   - Create a new Supabase project
   - Configure authentication providers
   - Run the provided SQL migrations
   - Set up Edge Functions for API endpoints

4. **Start the development server:**
```bash
npm run dev
```

### Environment Setup

This project uses Supabase for all backend services including:
- **Authentication**: User management and session handling
- **Database**: PostgreSQL with real-time subscriptions
- **Edge Functions**: Serverless API endpoints
- **Storage**: File and media storage

Configuration is handled through Supabase's integrated client and secrets management.

## 💻 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

### Database Schema

The application uses several key tables:
- **`agents`** - AI agent configurations and settings
- **`campaigns`** - Campaign metadata and configurations
- **`contacts`** - Contact information and list management
- **`scripts`** - Conversation scripts and conditional flows
- **`knowledge_bases`** - AI knowledge base content and embeddings
- **`call_analytics`** - Call metrics, transcripts, and performance data
- **`extracted_data`** - Custom data extracted from conversations

### API Endpoints

The platform includes several Supabase Edge Functions:
- `/create-agent` - Agent creation and configuration
- `/create-campaign` - Campaign setup and management
- `/get-caller-details` - Real-time caller information
- `/receive-call-data` - Call data processing and storage
- `/get-campaign-extracted-data` - Custom data extraction

## 🚀 Deployment

### Using Lovable (Recommended)

1. Open your [Lovable Project](https://lovable.dev/projects/d89e6d95-e38d-45e2-a7e7-c219edf5cfc2)
2. Click on **Share → Publish**
3. Your app will be deployed automatically with optimized performance

### Custom Domain Setup

To connect a custom domain:
1. Navigate to **Project > Settings > Domains** in Lovable
2. Click **"Connect Domain"**
3. Follow the DNS configuration instructions
4. SSL certificates are automatically provisioned

*Note: A paid Lovable plan is required for custom domains.*

### Self-Hosting

After connecting to GitHub, you can deploy anywhere:
- Standard React build process (`npm run build`)
- Static hosting compatible (Vercel, Netlify, etc.)
- Environment variables need to be configured in your hosting platform

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Implement responsive designs
- Add proper error handling
- Write meaningful commit messages

## 📚 Resources & Support

- **[Lovable Documentation](https://docs.lovable.dev/)** - Complete development guide
- **[Lovable Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)** - Community support
- **[Project Dashboard](https://lovable.dev/projects/d89e6d95-e38d-45e2-a7e7-c219edf5cfc2)** - Project management
- **[Supabase Documentation](https://supabase.com/docs)** - Backend services guide

## 📋 Roadmap

- [ ] Advanced AI model integration
- [ ] Multi-tenant support
- [ ] Advanced analytics dashboard
- [ ] Mobile application support
- [ ] Third-party CRM integrations
- [ ] Advanced call routing algorithms

## 📄 License

This project is built with Lovable and follows standard web development practices. See the project repository for specific licensing terms.

---

**Built with ❤️ using [Lovable](https://lovable.dev)**
