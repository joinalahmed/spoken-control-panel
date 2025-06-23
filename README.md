
# AI Calling Platform

An advanced AI-powered calling platform built with React, TypeScript, and Supabase that enables businesses to create, manage, and analyze AI-driven phone campaigns.

## Project Overview

This platform provides a comprehensive solution for managing AI-powered phone calls with features including:

- **Agent Management**: Create and configure AI agents with custom voices, languages, and behaviors
- **Campaign Management**: Set up inbound and outbound calling campaigns with advanced targeting
- **Contact Management**: Organize and manage contact lists for campaigns
- **Script Management**: Create dynamic conversation scripts with conditional logic
- **Knowledge Base**: Build AI knowledge bases for enhanced conversation capabilities
- **Call Analytics**: Real-time analytics and detailed call transcriptions
- **Data Extraction**: Configure custom data extraction from conversations

## Key Features

### 🤖 AI Agent Configuration
- Custom voice selection and language settings
- System prompt customization
- Knowledge base integration
- Script assignment and management

### 📞 Campaign Management
- Inbound and outbound campaign support
- Contact list integration
- Real-time campaign monitoring
- Advanced scheduling and targeting

### 📊 Analytics & Reporting
- Detailed call metrics and statistics
- Real-time dashboard with key performance indicators
- Call transcription and audio playback
- Custom data extraction and reporting

### 🔐 Security & Authentication
- Secure user authentication via Supabase
- Row-level security for data protection
- API key management for integrations

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Database, Authentication, Edge Functions)
- **State Management**: TanStack Query
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── agent-config/   # Agent configuration components
│   ├── call-details/   # Call analysis components
│   ├── campaign/       # Campaign management components
│   ├── kbs/           # Knowledge base components
│   └── script/        # Script management components
├── hooks/              # Custom React hooks
├── pages/              # Main application pages
├── contexts/           # React contexts
├── integrations/       # External service integrations
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for backend services)

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Configure authentication providers
   - Run the provided SQL migrations

4. Start the development server:
```bash
npm run dev
```

### Environment Setup

This project uses Supabase for backend services. The Supabase configuration is handled through the integrated client, and secrets are managed through Supabase's built-in secrets management.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Database Schema

The application uses several key tables:
- `agents` - AI agent configurations
- `campaigns` - Campaign settings and metadata
- `contacts` - Contact information and lists
- `scripts` - Conversation scripts and flows
- `knowledge_bases` - AI knowledge base content
- `call_analytics` - Call metrics and analytics data

## Deployment

### Using Lovable (Recommended)

1. Open your [Lovable Project](https://lovable.dev/projects/d89e6d95-e38d-45e2-a7e7-c219edf5cfc2)
2. Click on Share → Publish
3. Your app will be deployed automatically

### Custom Domain

To connect a custom domain:
1. Navigate to Project > Settings > Domains in Lovable
2. Click "Connect Domain"
3. Follow the setup instructions

*Note: A paid Lovable plan is required for custom domains.*

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- [Project URL](https://lovable.dev/projects/d89e6d95-e38d-45e2-a7e7-c219edf5cfc2)

## License

This project is built with Lovable and follows standard web development practices. See the project repository for specific licensing terms.
