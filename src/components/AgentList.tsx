
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Play, Pause, Settings, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Agent {
  id: string;
  name: string;
  voice: string;
  status: 'active' | 'inactive' | 'training';
  conversations: number;
  lastActive: string;
  description: string;
}

interface AgentListProps {
  onSelectAgent: (agent: Agent) => void;
}

const AgentList = ({ onSelectAgent }: AgentListProps) => {
  const [agents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Sarah Customer Support',
      voice: 'Sarah',
      status: 'active',
      conversations: 156,
      lastActive: '2 minutes ago',
      description: 'Handles customer inquiries and support tickets'
    },
    {
      id: '2',
      name: 'Alex Sales Assistant',
      voice: 'Alex',
      status: 'active',
      conversations: 89,
      lastActive: '5 minutes ago',
      description: 'Qualified leads and schedules demos'
    },
    {
      id: '3',
      name: 'Emma HR Bot',
      voice: 'Charlotte',
      status: 'inactive',
      conversations: 34,
      lastActive: '1 hour ago',
      description: 'Answers HR questions and policy inquiries'
    },
    {
      id: '4',
      name: 'Tech Support Pro',
      voice: 'Brian',
      status: 'training',
      conversations: 12,
      lastActive: '3 hours ago',
      description: 'Technical troubleshooting and guidance'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'inactive':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'training':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Voice Agents</h2>
          <p className="text-slate-400">Manage your AI voice agents</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          Create New Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-200 cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-purple-600">
                    <AvatarFallback className="text-white font-medium">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-white text-sm">{agent.name}</CardTitle>
                    <p className="text-xs text-slate-400">Voice: {agent.voice}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem onClick={() => onSelectAgent(agent)} className="text-slate-300 hover:bg-slate-700">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                      {agent.status === 'active' ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400 hover:bg-slate-700">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-slate-400 text-sm">
                {agent.description}
              </CardDescription>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={getStatusColor(agent.status)}>
                  {agent.status}
                </Badge>
                <span className="text-xs text-slate-500">{agent.lastActive}</span>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <span className="text-sm text-slate-400">Conversations</span>
                <span className="text-sm font-medium text-white">{agent.conversations}</span>
              </div>
              
              <Button 
                onClick={() => onSelectAgent(agent)}
                className="w-full bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 transition-colors"
              >
                Configure Agent
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgentList;
