import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Play, Pause, Settings, Trash2, Loader2, Phone, Clock, MessageSquare, Calendar, Building, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAgents, Agent } from '@/hooks/useAgents';
import { useCustomVoices } from '@/hooks/useCustomVoices';
import { formatDistanceToNow } from 'date-fns';

interface AgentListProps {
  onSelectAgent: (agent: Agent) => void;
  onCreateAgent: () => void;
}

const AgentList = ({ onSelectAgent, onCreateAgent }: AgentListProps) => {
  const { agents, isLoading, deleteAgent, updateAgent } = useAgents();
  const { voices: customVoices } = useCustomVoices();

  const getVoiceName = (voiceId: string) => {
    const voice = customVoices?.find(v => v.voice_id === voiceId);
    return voice?.voice_name || voiceId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      case 'training':
        return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const formatLastActive = (lastActive: string | null) => {
    if (!lastActive) return 'Never';
    return formatDistanceToNow(new Date(lastActive), { addSuffix: true });
  };

  const handleToggleStatus = async (agent: Agent) => {
    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
    updateAgent.mutate({
      id: agent.id,
      status: newStatus,
      last_active: newStatus === 'active' ? new Date().toISOString() : agent.last_active,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Voice Agents</h2>
          <p className="text-gray-600 mt-1">Manage and configure your AI voice agents.</p>
        </div>
        <Button onClick={onCreateAgent} className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-shadow">
          Create New Agent
        </Button>
      </div>

      {agents.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <Users className="w-16 h-16 text-purple-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No agents created yet</h3>
            <p className="text-gray-600 mb-6 max-w-sm">Create your first voice agent to start automating conversations. Click the button below to get started.</p>
            <Button onClick={onCreateAgent} className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-shadow">
              Create Your First Agent
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className="shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col focus:outline-none border-2 border-transparent focus:border-purple-600"
              onClick={() => onSelectAgent(agent)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectAgent(agent);
                }
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 bg-purple-100 border-2 border-white shadow-sm">
                      <AvatarFallback className="text-purple-600 font-bold text-lg">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-gray-900 text-xl font-bold mb-1">{agent.name}</CardTitle>
                      <Badge variant="outline" className={`${getStatusColor(agent.status)} font-medium`}>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border-gray-200">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelectAgent(agent); }} className="text-gray-700 hover:bg-gray-100">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => { e.stopPropagation(); handleToggleStatus(agent); }}
                        className="text-gray-700 hover:bg-gray-100"
                        disabled={updateAgent.isPending}
                      >
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
                      <DropdownMenuItem 
                        onClick={(e) => { e.stopPropagation(); deleteAgent.mutate(agent.id); }}
                        className="text-red-600 hover:bg-red-50"
                        disabled={deleteAgent.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <CardDescription className="text-gray-600 text-sm line-clamp-2 min-h-[40px]">
                  {agent.description || 'No description provided.'}
                </CardDescription>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500">Voice:</span>
                      <p className="text-gray-800 font-medium">{getVoiceName(agent.voice)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500">Calls:</span>
                      <p className="text-gray-800 font-medium">{agent.conversations}</p>
                    </div>
                  </div>
                </div>

                {agent.company && (
                  <div className="bg-black/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Company</span>
                    </div>
                    <p className="text-gray-800 text-sm font-semibold">
                      {agent.company}
                    </p>
                  </div>
                )}

                <div className="flex-1"></div>

                <div className="flex items-center justify-between pt-4 border-t border-black/10 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Active: {formatLastActive(agent.last_active)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDistanceToNow(new Date(agent.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={(e) => { e.stopPropagation(); onSelectAgent(agent); }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Configure Agent
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentList;
