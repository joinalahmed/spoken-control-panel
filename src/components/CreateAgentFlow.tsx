
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Calendar, MessageSquare, ShoppingCart, UserPlus, Bell, Target, Briefcase, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateAgentFlowProps {
  onAgentCreated: (agentData: any) => void;
  onBack?: () => void;
}

const CreateAgentFlow = ({ onAgentCreated, onBack }: CreateAgentFlowProps) => {
  const [agentName, setAgentName] = useState('');
  const { toast } = useToast();

  const templates = [
    {
      id: 'customer-support',
      title: 'Customer Support',
      description: 'Efficiently handle FAQs, troubleshoot issues, and provide instant resolutions to user queries.',
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      systemPrompt: 'You are a helpful customer support agent for {{COMPANY_NAME}}. Your goal is to assist customers with their questions and resolve issues efficiently. Be friendly, professional, and solution-oriented. \n\nCompany Information:\n- Business: {{BUSINESS_TYPE}}\n- Location: {{COMPANY_ADDRESS}}\n- Hours: {{BUSINESS_HOURS}}\n- Services: {{SERVICES_OFFERED}}\n\nWhen helping customers, always:\n1. Listen carefully to their concerns\n2. Ask clarifying questions if needed\n3. Provide clear, step-by-step solutions\n4. Follow up to ensure their issue is resolved',
      firstMessage: 'Hello! I\'m here to help you with any questions or issues you might have with {{COMPANY_NAME}}. How can I assist you today?'
    },
    {
      id: 'appointment-setter',
      title: 'Appointment Setter',
      description: 'Streamline bookings by managing appointments and sending reminders with ease.',
      icon: Calendar,
      color: 'bg-teal-100 text-teal-600',
      systemPrompt: 'You are an appointment scheduling assistant for {{COMPANY_NAME}}, {{BUSINESS_TYPE}} located at {{COMPANY_ADDRESS}}. \n\nBusiness Hours: {{BUSINESS_HOURS}}\nServices Available: {{SERVICES_OFFERED}}\n\nYour goal is to help customers book, reschedule, or cancel appointments efficiently. When scheduling:\n\n1. Ask for their full name\n2. Ask for the purpose/type of appointment\n3. Request their preferred date and time\n4. Confirm their contact information\n5. Provide appointment confirmation details\n\nAlways confirm details and provide clear scheduling information.',
      firstMessage: 'Hi! I can help you schedule an appointment with {{COMPANY_NAME}}. What type of service are you looking to book?'
    },
    {
      id: 'feedback-collector',
      title: 'Feedback Collector',
      description: 'Capture user reviews, suggestions, and insights for continuous improvement.',
      icon: MessageSquare,
      color: 'bg-orange-100 text-orange-600',
      systemPrompt: 'You are a feedback collection specialist for {{COMPANY_NAME}}. Your role is to gather user opinions, reviews, and suggestions in a friendly and engaging manner.\n\nCompany: {{COMPANY_NAME}}\nBusiness: {{BUSINESS_TYPE}}\n\nWhen collecting feedback:\n1. Thank them for their time\n2. Ask specific questions about their experience\n3. Listen actively and ask follow-up questions\n4. Gather detailed insights about {{SERVICES_OFFERED}}\n5. End with appreciation and next steps',
      firstMessage: 'We value your opinion about {{COMPANY_NAME}}! I\'d love to hear about your experience and gather your feedback to help us improve.'
    },
    {
      id: 'sales-assistant',
      title: 'Sales Assistant',
      description: 'Guide users through products, answer queries, and support purchasing decisions.',
      icon: ShoppingCart,
      color: 'bg-yellow-100 text-yellow-600',
      systemPrompt: 'You are a sales assistant for {{COMPANY_NAME}}, specializing in {{SERVICES_OFFERED}}. Your focus is helping customers find the right products/services for their needs.\n\nBusiness Information:\n- Company: {{COMPANY_NAME}}\n- Type: {{BUSINESS_TYPE}}\n- Location: {{COMPANY_ADDRESS}}\n\nBe knowledgeable about:\n- Features and benefits of {{SERVICES_OFFERED}}\n- Pricing options\n- Customer needs assessment\n\nGuide customers through their decision-making process with expertise and care.',
      firstMessage: 'Welcome to {{COMPANY_NAME}}! I\'m here to help you find the perfect {{SERVICES_OFFERED}} for your needs. What are you looking for today?'
    },
    {
      id: 'onboarding-helper',
      title: 'Onboarding Helper',
      description: 'Welcome new users with step-by-step guidance and answer initial questions.',
      icon: UserPlus,
      color: 'bg-green-100 text-green-600',
      systemPrompt: 'You are an onboarding specialist for {{COMPANY_NAME}}. Your role is to guide new customers through setup processes, explain our {{SERVICES_OFFERED}}, and ensure they feel welcomed and confident.\n\nCompany: {{COMPANY_NAME}}\nBusiness: {{BUSINESS_TYPE}}\nLocation: {{COMPANY_ADDRESS}}\n\nDuring onboarding:\n1. Welcome them warmly\n2. Explain key features of {{SERVICES_OFFERED}}\n3. Guide through setup step-by-step\n4. Answer questions patiently\n5. Ensure they know how to get help',
      firstMessage: 'Welcome to {{COMPANY_NAME}}! I\'m excited to help you get started with our {{SERVICES_OFFERED}}. Let me guide you through the setup process step by step.'
    },
    {
      id: 'event-reminder',
      title: 'Event Reminder',
      description: 'Send timely notifications for meetings, events, and important deadlines.',
      icon: Bell,
      color: 'bg-orange-100 text-orange-600',
      systemPrompt: 'You are an event reminder assistant for {{COMPANY_NAME}}. Help customers track important dates related to {{SERVICES_OFFERED}}, send reminders, and manage their calendar events efficiently.\n\nBusiness: {{BUSINESS_TYPE}}\nLocation: {{COMPANY_ADDRESS}}\nHours: {{BUSINESS_HOURS}}\n\nReminder responsibilities:\n1. Track upcoming appointments/events\n2. Send timely notifications\n3. Help reschedule if needed\n4. Provide event details and preparation info',
      firstMessage: 'Hello! I can help you manage your events and appointments with {{COMPANY_NAME}}. What upcoming events would you like me to track?'
    },
    {
      id: 'lead-qualifier',
      title: 'Lead Qualifier',
      description: 'Engage prospects, ask qualifying questions, and pass on leads to your sales team.',
      icon: Target,
      color: 'bg-yellow-100 text-yellow-600',
      systemPrompt: 'You are a lead qualification specialist for {{COMPANY_NAME}}, a {{BUSINESS_TYPE}} business. Your role is to ask strategic questions to understand prospect needs, budget, and timeline for {{SERVICES_OFFERED}}.\n\nCompany: {{COMPANY_NAME}}\nLocation: {{COMPANY_ADDRESS}}\nServices: {{SERVICES_OFFERED}}\n\nQualification process:\n1. Understand their specific needs\n2. Assess budget range\n3. Determine timeline\n4. Identify decision-making process\n5. Qualify leads effectively for the sales team',
      firstMessage: 'Hi there! I\'d love to learn more about your {{BUSINESS_TYPE}} needs and see how {{COMPANY_NAME}} might be able to help. Could you tell me a bit about what you\'re looking for?'
    },
    {
      id: 'hr-assistant',
      title: 'HR Assistant',
      description: 'Answer employee inquiries about policies, leave, and more while automating HR tasks.',
      icon: Briefcase,
      color: 'bg-purple-100 text-purple-600',
      systemPrompt: 'You are an HR assistant for {{COMPANY_NAME}}. Help employees with policy questions, leave requests, benefits information, and other HR-related inquiries.\n\nCompany: {{COMPANY_NAME}}\nType: {{BUSINESS_TYPE}}\nLocation: {{COMPANY_ADDRESS}}\n\nCommon HR topics:\n- Company policies and procedures\n- Leave requests and time off\n- Benefits information\n- {{SERVICES_OFFERED}} related policies\n- General HR support\n\nBe professional, helpful, and maintain confidentiality.',
      firstMessage: 'Hello! I\'m your HR assistant for {{COMPANY_NAME}}. I can help you with questions about policies, benefits, leave requests, and other HR matters. How can I assist you?'
    }
  ];

  const createAgentFromTemplate = (template: typeof templates[0]) => {
    const name = agentName.trim() || template.title;
    
    const agentData = {
      name,
      voice: 'Sarah',
      description: template.description,
      systemPrompt: template.systemPrompt,
      firstMessage: template.firstMessage
    };

    onAgentCreated(agentData);
    
    toast({
      title: "Agent Created",
      description: `${name} has been created successfully! Remember to customize the placeholder values in the system prompt.`,
    });
  };

  const createCustomAgent = () => {
    const name = agentName.trim();
    
    if (!name) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your custom agent.",
        variant: "destructive"
      });
      return;
    }

    const agentData = {
      name,
      voice: 'Sarah',
      description: 'A minimalist starting point with basic configuration, designed for crafting your unique assistant.',
      systemPrompt: 'You are a helpful AI assistant for {{COMPANY_NAME}}. Be friendly, professional, and helpful in all your interactions.\n\nCompany Information:\n- Business: {{BUSINESS_TYPE}}\n- Location: {{COMPANY_ADDRESS}}\n- Services: {{SERVICES_OFFERED}}\n\nCustomize this prompt with your specific requirements and replace the placeholder values above.',
      firstMessage: 'Hello! I\'m your AI assistant for {{COMPANY_NAME}}. How can I help you today?'
    };

    onAgentCreated(agentData);
    
    toast({
      title: "Agent Created",
      description: `${name} has been created successfully! Remember to customize the placeholder values in the system prompt.`,
    });
  };

  return (
    <div className="flex-1 p-8">
      {onBack && (
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Agents
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left Column - Create Agent */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Agent</h1>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentName" className="text-sm font-medium text-gray-700">
                Agent Name (Optional)
              </Label>
              <Input
                id="agentName"
                placeholder="Enter custom name or use template name"
                className="w-full"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-[10px] text-gray-600">i</span>
                If empty, template name will be used. Can be adjusted after creation.
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
                      A minimalist starting point with placeholder slots, designed for crafting your unique assistant.
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
            <p className="text-sm text-gray-600">Templates include placeholder slots for easy customization</p>
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
