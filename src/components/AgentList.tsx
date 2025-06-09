
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Play, Pause, Settings, Trash2, Loader2, Phone, Clock, MessageSquare, Calendar, Building, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAgents, Agent } from '@/hooks/useAgents';
import { formatDistanceToNow } from 'date-fns';

interface AgentListProps {
  onSelectAgent: (agent: Agent) => void;
  onCreateAgent: () => void;
}

const AgentList = ({ onSelectAgent, onCreateAgent }: AgentListProps) => {
  const { agents, isLoading, deleteAgent, updateAgent } = useAgents();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
      case 'training':
        return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getAgentTypeColor = (agentType: string) => {
    switch (agentType) {
      case 'inbound':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'outbound':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Voice Agents</h2>
          <p className="text-gray-600">Manage your AI voice agents</p>
        </div>
        <Button onClick={onCreateAgent} className="bg-purple-600 hover:bg-purple-700 text-white">
          Create New Agent
        </Button>
      </div>

      {agents.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-600 mb-4">No agents created yet</p>
            <Button onClick={onCreateAgent} className="bg-purple-600 hover:bg-purple-700">
              Create Your First Agent
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 bg-purple-600">
                      <AvatarFallback className="text-white font-medium">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-gray-900 text-lg mb-1">{agent.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getStatusColor(agent.status)}>
                          {agent.status}
                        </Badge>
                        <Badge variant="outline" className={getAgentTypeColor(agent.agent_type)}>
                          <div className="flex items-center gap-1">
                            {agent.agent_type === 'inbound' ? (
                              <PhoneIncoming className="w-3 h-3" />
                            ) : (
                              <PhoneOutgoing className="w-3 h-3" />
                            )}
                            {agent.agent_type}
                          </div>
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-600 text-sm line-clamp-2">
                        {agent.description || 'No description provided'}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border-gray-200">
                      <DropdownMenuItem onClick={() => onSelectAgent(agent)} className="text-gray-700 hover:bg-gray-100">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleStatus(agent)}
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
                        onClick={() => deleteAgent.mutate(agent.id)}
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
              <CardContent className="space-y-4">
                {/* Agent Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-gray-500">Voice:</span>
                      <p className="text-gray-900 font-medium">{agent.voice}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-gray-500">Calls:</span>
                      <p className="text-gray-900 font-medium">{agent.conversations}</p>
                    </div>
                  </div>
                </div>

                {/* Company Name */}
                {agent.company && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Company</span>
                    </div>
                    <p className="text-gray-800 text-sm font-medium">
                      {agent.company}
                    </p>
                  </div>
                )}

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Last active: {formatLastActive(agent.last_active)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Created {formatDistanceToNow(new Date(agent.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onSelectAgent(agent)}
                  className="w-full bg-purple-600/20 hover:bg-purple-600 text-purple-600 hover:text-white border border-purple-300 transition-colors"
                >
                  Configure Agent
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentList;
