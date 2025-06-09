
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Play, Pause, Settings, Trash2, Loader2, Phone, Clock, MessageSquare, Calendar } from 'lucide-react';
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
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'inactive':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'training':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
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
          <h2 className="text-2xl font-bold text-white">Voice Agents</h2>
          <p className="text-slate-400">Manage your AI voice agents</p>
        </div>
        <Button onClick={onCreateAgent} className="bg-purple-600 hover:bg-purple-700 text-white">
          Create New Agent
        </Button>
      </div>

      {agents.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-slate-400 mb-4">No agents created yet</p>
            <Button onClick={onCreateAgent} className="bg-purple-600 hover:bg-purple-700">
              Create Your First Agent
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 bg-purple-600">
                      <AvatarFallback className="text-white font-medium">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-1">{agent.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getStatusColor(agent.status)}>
                          {agent.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-400 text-sm line-clamp-2">
                        {agent.description || 'No description provided'}
                      </CardDescription>
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
                      <DropdownMenuItem 
                        onClick={() => handleToggleStatus(agent)}
                        className="text-slate-300 hover:bg-slate-700"
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
                        className="text-red-400 hover:bg-slate-700"
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
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-slate-400">Voice:</span>
                      <p className="text-white font-medium">{agent.voice}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-slate-400">Calls:</span>
                      <p className="text-white font-medium">{agent.conversations}</p>
                    </div>
                  </div>
                </div>

                {/* System Prompt Preview */}
                {agent.system_prompt && (
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">System Prompt</span>
                    </div>
                    <p className="text-slate-300 text-sm line-clamp-3">
                      {agent.system_prompt}
                    </p>
                  </div>
                )}

                {/* First Message Preview */}
                {agent.first_message && (
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">First Message</span>
                    </div>
                    <p className="text-slate-300 text-sm line-clamp-2">
                      "{agent.first_message}"
                    </p>
                  </div>
                )}

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>Last active: {formatLastActive(agent.last_active)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>Created {formatDistanceToNow(new Date(agent.created_at), { addSuffix: true })}</span>
                  </div>
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
      )}
    </div>
  );
};

export default AgentList;
