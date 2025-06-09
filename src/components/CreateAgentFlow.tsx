
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Calendar, MessageSquare, ShoppingCart, UserPlus, Bell, Target, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: string;
  name: string;
  voice: string;
  status: 'active' | 'inactive';
  conversations: number;
  lastActive: string;
  description: string;
  systemPrompt?: string;
  firstMessage?: string;
}

interface CreateAgentFlowProps {
  onAgentCreated: (agent: Agent) => void;
}

const CreateAgentFlow = ({ onAgentCreated }: CreateAgentFlowProps) => {
  const [agentName, setAgentName] = useState('');
  const { toast } = useToast();

  const templates = [
    {
      id: 'customer-support',
      title: 'Customer Support',
      description: 'Efficiently handle FAQs, troubleshoot issues, and provide instant resolutions to user queries.',
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      systemPrompt: 'You are a helpful customer support agent. Your goal is to assist customers with their questions and resolve issues efficiently. Be friendly, professional, and solution-oriented.',
      firstMessage: 'Hello! I\'m here to help you with any questions or issues you might have. How can I assist you today?'
    },
    {
      id: 'appointment-setter',
      title: 'Appointment Setter',
      description: 'Streamline bookings by managing appointments and sending reminders with ease.',
      icon: Calendar,
      color: 'bg-teal-100 text-teal-600',
      systemPrompt: 'You are an appointment scheduling assistant. Help users book, reschedule, or cancel appointments. Always confirm details and provide clear scheduling information.',
      firstMessage: 'Hi! I can help you schedule an appointment. What type of service are you looking to book?'
    },
    {
      id: 'feedback-collector',
      title: 'Feedback Collector',
      description: 'Capture user reviews, suggestions, and insights for continuous improvement.',
      icon: MessageSquare,
      color: 'bg-orange-100 text-orange-600',
      systemPrompt: 'You are a feedback collection specialist. Gather user opinions, reviews, and suggestions in a friendly and engaging manner. Ask follow-up questions to get detailed insights.',
      firstMessage: 'We value your opinion! I\'d love to hear about your experience and gather your feedback to help us improve.'
    },
    {
      id: 'sales-assistant',
      title: 'Sales Assistant',
      description: 'Guide users through products, answer queries, and support purchasing decisions.',
      icon: ShoppingCart,
      color: 'bg-yellow-100 text-yellow-600',
      systemPrompt: 'You are a sales assistant focused on helping customers find the right products. Be knowledgeable about features, benefits, and pricing. Guide customers through their decision-making process.',
      firstMessage: 'Welcome! I\'m here to help you find the perfect product for your needs. What are you looking for today?'
    },
    {
      id: 'onboarding-helper',
      title: 'Onboarding Helper',
      description: 'Welcome new users with step-by-step guidance and answer initial questions.',
      icon: UserPlus,
      color: 'bg-green-100 text-green-600',
      systemPrompt: 'You are an onboarding specialist. Guide new users through setup processes, explain features, and ensure they feel welcomed and confident using the platform.',
      firstMessage: 'Welcome aboard! I\'m excited to help you get started. Let me guide you through the setup process step by step.'
    },
    {
      id: 'event-reminder',
      title: 'Event Reminder',
      description: 'Send timely notifications for meetings, events, and important deadlines.',
      icon: Bell,
      color: 'bg-orange-100 text-orange-600',
      systemPrompt: 'You are an event reminder assistant. Help users track important dates, send reminders, and manage their calendar events efficiently.',
      firstMessage: 'Hello! I can help you manage your events and send reminders. What upcoming events would you like me to track?'
    },
    {
      id: 'lead-qualifier',
      title: 'Lead Qualifier',
      description: 'Engage prospects, ask qualifying questions, and pass on leads to your sales team.',
      icon: Target,
      color: 'bg-yellow-100 text-yellow-600',
      systemPrompt: 'You are a lead qualification specialist. Ask strategic questions to understand prospect needs, budget, and timeline. Qualify leads effectively for the sales team.',
      firstMessage: 'Hi there! I\'d love to learn more about your business needs and see how we might be able to help. Could you tell me a bit about what you\'re looking for?'
    },
    {
      id: 'hr-assistant',
      title: 'HR Assistant',
      description: 'Answer employee inquiries about policies, leave, and more while automating HR tasks.',
      icon: Briefcase,
      color: 'bg-purple-100 text-purple-600',
      systemPrompt: 'You are an HR assistant. Help employees with policy questions, leave requests, benefits information, and other HR-related inquiries. Be professional and helpful.',
      firstMessage: 'Hello! I\'m your HR assistant. I can help you with questions about policies, benefits, leave requests, and other HR matters. How can I assist you?'
    }
  ];

  const createAgentFromTemplate = (template: typeof templates[0]) => {
    const name = agentName.trim() || template.title;
    
    const newAgent: Agent = {
      id: Date.now().toString(),
      name,
      voice: 'Sarah',
      status: 'inactive',
      conversations: 0,
      lastActive: 'Never',
      description: template.description,
      systemPrompt: template.systemPrompt,
      firstMessage: template.firstMessage
    };

    onAgentCreated(newAgent);
    
    toast({
      title: "Agent Created",
      description: `${name} has been created successfully!`,
    });
  };

  const createCustomAgent = () => {
    const name = agentName.trim();
    
    if (!name) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your agent.",
        variant: "destructive"
      });
      return;
    }

    const newAgent: Agent = {
      id: Date.now().toString(),
      name,
      voice: 'Sarah',
      status: 'inactive',
      conversations: 0,
      lastActive: 'Never',
      description: 'A minimalist starting point with basic configuration, designed for crafting your unique assistant.',
      systemPrompt: 'You are a helpful AI assistant. Be friendly, professional, and helpful in all your interactions.',
      firstMessage: 'Hello! I\'m your AI assistant. How can I help you today?'
    };

    onAgentCreated(newAgent);
    
    toast({
      title: "Agent Created",
      description: `${name} has been created successfully!`,
    });
  };

  return (
    <div className="flex-1 p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left Column - Create Agent */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Agent</h1>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentName" className="text-sm font-medium text-gray-700">
                Agent Name
              </Label>
              <Input
                id="agentName"
                placeholder="Type Name"
                className="w-full"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-[10px] text-gray-600">i</span>
                This can be adjusted at any time after creation
              </p>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-400 text-sm">Or</span>
            </div>

            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Custom Starter</h3>
                    <p className="text-sm text-gray-600">
                      A minimalist starting point with basic configuration, designed for crafting your unique assistant.
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={createCustomAgent}>
                    →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Choose Templates */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Templates</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${template.color}`}>
                      <template.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{template.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {template.description}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-purple-600 hover:text-purple-700 p-0 h-auto font-medium"
                      onClick={() => createAgentFromTemplate(template)}
                    >
                      Try Now →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAgentFlow;
