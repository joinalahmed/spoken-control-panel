
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Calendar, MessageSquare, ShoppingCart, UserPlus, Bell, Target, Briefcase } from 'lucide-react';

const CreateAgentFlow = () => {
  const templates = [
    {
      id: 'customer-support',
      title: 'Customer Support',
      description: 'Efficiently handle FAQs, troubleshoot issues, and provide instant resolutions to user queries.',
      icon: Users,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'appointment-setter',
      title: 'Appointment Setter',
      description: 'Streamline bookings by managing appointments and sending reminders with ease.',
      icon: Calendar,
      color: 'bg-teal-100 text-teal-600'
    },
    {
      id: 'feedback-collector',
      title: 'Feedback Collector',
      description: 'Capture user reviews, suggestions, and insights for continuous improvement.',
      icon: MessageSquare,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'sales-assistant',
      title: 'Sales Assistant',
      description: 'Guide users through products, answer queries, and support purchasing decisions.',
      icon: ShoppingCart,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'onboarding-helper',
      title: 'Onboarding Helper',
      description: 'Welcome new users with step-by-step guidance and answer initial questions.',
      icon: UserPlus,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'event-reminder',
      title: 'Event Reminder',
      description: 'Send timely notifications for meetings, events, and important deadlines.',
      icon: Bell,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'lead-qualifier',
      title: 'Lead Qualifier',
      description: 'Engage prospects, ask qualifying questions, and pass on leads to your sales team.',
      icon: Target,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'hr-assistant',
      title: 'HR Assistant',
      description: 'Answer employee inquiries about policies, leave, and more while automating HR tasks.',
      icon: Briefcase,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

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
                  <Button variant="ghost" size="sm">
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
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 p-0 h-auto font-medium">
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
