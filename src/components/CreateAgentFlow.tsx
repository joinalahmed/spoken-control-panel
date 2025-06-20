
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Calendar, MessageSquare, ShoppingCart, UserPlus, Bell, Target, Briefcase, ArrowLeft, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCustomVoices } from '@/hooks/useCustomVoices';

interface CreateAgentFlowProps {
  onAgentCreated: (agentData: any) => void;
  onBack?: () => void;
}

const CreateAgentFlow = ({ onAgentCreated, onBack }: CreateAgentFlowProps) => {
  const [agentName, setAgentName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [agentRole, setAgentRole] = useState('');
  const [agentType, setAgentType] = useState<'inbound' | 'outbound'>('outbound');
  const [selectedVoice, setSelectedVoice] = useState('Sarah');
  const { toast } = useToast();
  const { getAllVoices } = useCustomVoices();

  const voices = getAllVoices();

  const industries = [
    'Healthcare',
    'Technology',
    'Finance',
    'Retail',
    'Real Estate',
    'Education',
    'Manufacturing',
    'Hospitality',
    'Legal Services',
    'Consulting',
    'Marketing',
    'Construction',
    'Automotive',
    'Food & Beverage',
    'Other'
  ];

  const templates = [
    {
      id: 'customer-support',
      title: 'Customer Support',
      description: 'Efficiently handle FAQs, troubleshoot issues, and provide instant resolutions to user queries.',
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      systemPrompt: `You are a helpful customer support agent for ${companyName}, working in the ${companyIndustry} industry. Your role is ${agentRole}. Your goal is to assist customers with their questions and resolve issues efficiently. Be friendly, professional, and solution-oriented.

Company Information:
- Business: ${companyName}
- Industry: ${companyIndustry}
- Your Role: ${agentRole}
- Agent Type: ${agentType} calls

When helping customers, always:
1. Listen carefully to their concerns
2. Ask clarifying questions if needed
3. Provide clear, step-by-step solutions
4. Follow up to ensure their issue is resolved
5. Maintain a professional and empathetic tone`,
      firstMessage: agentType === 'inbound' 
        ? `Hello! Thank you for calling ${companyName}. I'm ${agentRole} and I'm here to help you with any questions or issues you might have. How can I assist you today?`
        : `Hello! I'm ${agentRole} calling from ${companyName}. I'm reaching out to help you with any questions or issues you might have. How can I assist you today?`
    },
    {
      id: 'appointment-setter',
      title: 'Appointment Setter',
      description: 'Streamline bookings by managing appointments and sending reminders with ease.',
      icon: Calendar,
      color: 'bg-teal-100 text-teal-600',
      systemPrompt: `You are an appointment scheduling assistant for ${companyName} in the ${companyIndustry} industry. Your role is ${agentRole}. You handle ${agentType} calls for appointment management.

Company Information:
- Business: ${companyName}
- Industry: ${companyIndustry}
- Your Role: ${agentRole}
- Agent Type: ${agentType} calls

Your goal is to help customers book, reschedule, or cancel appointments efficiently. When scheduling:

1. Ask for their full name
2. Ask for the purpose/type of appointment
3. Request their preferred date and time
4. Confirm their contact information
5. Provide appointment confirmation details

Always confirm details and provide clear scheduling information.`,
      firstMessage: agentType === 'inbound'
        ? `Hi! Thank you for calling ${companyName}. I'm ${agentRole} and I can help you schedule an appointment with us. What type of service are you looking to book?`
        : `Hi! I'm ${agentRole} calling from ${companyName}. I can help you schedule an appointment with us. What type of service are you looking to book?`
    },
    {
      id: 'feedback-collector',
      title: 'Feedback Collector',
      description: 'Capture user reviews, suggestions, and insights for continuous improvement.',
      icon: MessageSquare,
      color: 'bg-orange-100 text-orange-600',
      systemPrompt: `You are a feedback collection specialist for ${companyName} in the ${companyIndustry} industry. Your role is ${agentRole}. Your purpose is to gather user opinions, reviews, and suggestions in a friendly and engaging manner.

Company Information:
- Business: ${companyName}
- Industry: ${companyIndustry}
- Your Role: ${agentRole}

When collecting feedback:
1. Thank them for their time
2. Ask specific questions about their experience
3. Listen actively and ask follow-up questions
4. Gather detailed insights about our services
5. End with appreciation and next steps`,
      firstMessage: `We value your opinion about ${companyName}! I'm ${agentRole} and I'd love to hear about your experience and gather your feedback to help us improve.`
    },
    {
      id: 'sales-assistant',
      title: 'Sales Assistant',
      description: 'Guide users through products, answer queries, and support purchasing decisions.',
      icon: ShoppingCart,
      color: 'bg-yellow-100 text-yellow-600',
      systemPrompt: `You are a sales assistant for ${companyName} in the ${companyIndustry} industry. Your role is ${agentRole}. Your focus is helping customers find the right products/services for their needs.

Company Information:
- Business: ${companyName}
- Industry: ${companyIndustry}
- Your Role: ${agentRole}

Be knowledgeable about:
- Features and benefits of our offerings
- Pricing options
- Customer needs assessment
- Industry-specific solutions

Guide customers through their decision-making process with expertise and care.`,
      firstMessage: `Welcome to ${companyName}! I'm ${agentRole} and I'm here to help you find the perfect solution for your ${companyIndustry} needs. What are you looking for today?`
    },
    {
      id: 'onboarding-helper',
      title: 'Onboarding Helper',
      description: 'Welcome new users with step-by-step guidance and answer initial questions.',
      icon: UserPlus,
      color: 'bg-green-100 text-green-600',
      systemPrompt: `You are an onboarding specialist for ${companyName} in the ${companyIndustry} industry. Your role is ${agentRole}. Your purpose is to guide new customers through setup processes, explain our services, and ensure they feel welcomed and confident.

Company Information:
- Business: ${companyName}
- Industry: ${companyIndustry}
- Your Role: ${agentRole}

During onboarding:
1. Welcome them warmly
2. Explain key features of our services
3. Guide through setup step-by-step
4. Answer questions patiently
5. Ensure they know how to get help`,
      firstMessage: `Welcome to ${companyName}! I'm ${agentRole} and I'm excited to help you get started with our ${companyIndustry} services. Let me guide you through the setup process step by step.`
    },
    {
      id: 'event-reminder',
      title: 'Event Reminder',
      description: 'Send timely notifications for meetings, events, and important deadlines.',
      icon: Bell,
      color: 'bg-orange-100 text-orange-600',
      systemPrompt: `You are an event reminder assistant for ${companyName} in the ${companyIndustry} industry. Your role is ${agentRole}. Help customers track important dates, send reminders, and manage their calendar events efficiently.

Company Information:
- Business: ${companyName}
- Industry: ${companyIndustry}
- Your Role: ${agentRole}

Reminder responsibilities:
1. Track upcoming appointments/events
2. Send timely notifications
3. Help reschedule if needed
4. Provide event details and preparation info`,
      firstMessage: `Hello! I'm ${agentRole} at ${companyName}. I can help you manage your events and appointments with us. What upcoming events would you like me to track?`
    },
    {
      id: 'lead-qualifier',
      title: 'Lead Qualifier',
      description: 'Engage prospects, ask qualifying questions, and pass on leads to your sales team.',
      icon: Target,
      color: 'bg-yellow-100 text-yellow-600',
      systemPrompt: `You are a lead qualification specialist for ${companyName} in the ${companyIndustry} industry. Your role is ${agentRole}. Your purpose is to ask strategic questions to understand prospect needs, budget, and timeline.

Company Information:
- Business: ${companyName}
- Industry: ${companyIndustry}
- Your Role: ${agentRole}

Qualification process:
1. Understand their specific needs
2. Assess budget range
3. Determine timeline
4. Identify decision-making process
5. Qualify leads effectively for the sales team`,
      firstMessage: `Hi there! I'm ${agentRole} at ${companyName}. I'd love to learn more about your ${companyIndustry} needs and see how we might be able to help. Could you tell me a bit about what you're looking for?`
    },
    {
      id: 'hr-assistant',
      title: 'HR Assistant',
      description: 'Answer employee inquiries about policies, leave, and more while automating HR tasks.',
      icon: Briefcase,
      color: 'bg-purple-100 text-purple-600',
      systemPrompt: `You are an HR assistant for ${companyName} in the ${companyIndustry} industry. Your role is ${agentRole}. Help employees with policy questions, leave requests, benefits information, and other HR-related inquiries.

Company Information:
- Business: ${companyName}
- Industry: ${companyIndustry}
- Your Role: ${agentRole}

Common HR topics:
- Company policies and procedures
- Leave requests and time off
- Benefits information
- Industry-specific policies
- General HR support

Be professional, helpful, and maintain confidentiality.`,
      firstMessage: `Hello! I'm ${agentRole} in HR at ${companyName}. I can help you with questions about policies, benefits, leave requests, and other HR matters. How can I assist you?`
    }
  ];

  const createAgentFromTemplate = (template: typeof templates[0]) => {
    const name = agentName.trim();
    const company = companyName.trim();
    const industry = companyIndustry.trim();
    const role = agentRole.trim();
    
    if (!name || !company || !industry || !role) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before selecting a template.",
        variant: "destructive"
      });
      return;
    }
    
    const agentData = {
      name,
      voice: selectedVoice,
      description: template.description,
      systemPrompt: template.systemPrompt,
      firstMessage: template.firstMessage,
    };

    onAgentCreated(agentData);
    
    toast({
      title: "Agent Created",
      description: `${name} has been created successfully!`,
    });
  };

  const areAllFieldsValid = 
    agentName.trim().length > 0 && 
    companyName.trim().length > 0 && 
    companyIndustry.trim().length > 0 && 
    agentRole.trim().length > 0;

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
        {/* Left Column - Agent Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent Details</h1>
            <p className="text-sm text-gray-600">Fill in the details to create your AI agent</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentName" className="text-sm font-medium text-gray-700">
                Agent Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="agentName"
                placeholder="e.g., Sarah Support Bot"
                className="w-full"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentType" className="text-sm font-medium text-gray-700">
                Agent Type <span className="text-red-500">*</span>
              </Label>
              <Select value={agentType} onValueChange={(value: 'inbound' | 'outbound') => setAgentType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select agent type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outbound">
                    <div className="flex items-center gap-2">
                      <PhoneOutgoing className="w-4 h-4" />
                      <span>Outbound - Makes calls to contacts</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inbound">
                    <div className="flex items-center gap-2">
                      <PhoneIncoming className="w-4 h-4" />
                      <span>Inbound - Receives incoming calls</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice" className="text-sm font-medium text-gray-700">
                Voice <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                placeholder="e.g., Acme Corp"
                className="w-full"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyIndustry" className="text-sm font-medium text-gray-700">
                Company Industry <span className="text-red-500">*</span>
              </Label>
              <Select value={companyIndustry} onValueChange={setCompanyIndustry}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentRole" className="text-sm font-medium text-gray-700">
                Agent Role <span className="text-red-500">*</span>
              </Label>
              <Input
                id="agentRole"
                placeholder="e.g., Customer Support Representative"
                className="w-full"
                value={agentRole}
                onChange={(e) => setAgentRole(e.target.value)}
                required
              />
            </div>

            {!areAllFieldsValid && (
              <p className="text-sm text-red-500 mt-2">Please fill in all required fields to proceed</p>
            )}
          </div>
        </div>

        {/* Right Column - Choose Templates */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Templates</h2>
            <p className="text-sm text-gray-600">Pre-built templates customized with your company details</p>
          </div>
          
          <div className={`grid grid-cols-2 gap-4 ${!areAllFieldsValid ? 'opacity-50 pointer-events-none' : ''}`}>
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
                      disabled={!areAllFieldsValid}
                    >
                      Create →
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
