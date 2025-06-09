
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, FileText, BarChart3, Mic, Phone, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Mic,
      title: 'AI Voice Agents',
      description: 'Create intelligent voice agents that can handle customer interactions naturally'
    },
    {
      icon: Phone,
      title: 'Smart Calling',
      description: 'Automated calling campaigns with AI-powered conversation management'
    },
    {
      icon: Brain,
      title: 'Knowledge Base',
      description: 'Train your agents with custom knowledge bases for accurate responses'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track performance and optimize your voice AI campaigns'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">Dhwani</span>
            <span className="text-sm text-white/80">Voice AI Agents Playground</span>
          </div>
          <Button 
            onClick={() => navigate('/auth')}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Build Powerful Voice AI Agents
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Create, deploy, and manage intelligent voice agents that can handle customer calls, 
              support requests, and business communications with human-like conversations.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => navigate('/auth')}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-3"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <feature.icon className="w-12 h-12 text-white mx-auto mb-4" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/80 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Ready to Get Started?</CardTitle>
                <CardDescription className="text-white/80">
                  Join thousands of businesses using Dhwani to automate their voice communications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/auth')}
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3"
                >
                  Start Building Your Voice AI
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center text-sm text-white/80">
            <span>Made with</span>
            <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
            <span>by Aivar Innovations</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
