
import { Home, Users, FileText, Settings, BarChart3, LogOut, Heart, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onContactsViewChange: (view: 'list' | 'create') => void;
  onKbsViewChange: (view: 'list' | 'create') => void;
  onAgentViewChange: (showCreate: boolean, selectedAgent: any) => void;
  onCampaignsViewChange: (view: 'overview' | 'create' | 'details' | 'call-details') => void;
}

const Sidebar = ({ 
  activeTab, 
  onTabChange, 
  onContactsViewChange, 
  onKbsViewChange, 
  onAgentViewChange,
  onCampaignsViewChange 
}: SidebarProps) => {
  const { user, signOut } = useAuth();

  const sidebarItems: SidebarItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'files', label: 'Knowledge Bases', icon: FileText },
    { id: 'campaigns', label: 'Campaigns', icon: BarChart3 },
  ];

  const handleTabClick = (item: SidebarItem) => {
    onTabChange(item.id);
    
    if (item.id === 'contacts') {
      onContactsViewChange('list');
    }
    if (item.id === 'files') {
      onKbsViewChange('list');
    }
    if (item.id === 'agents') {
      onAgentViewChange(false, null);
    }
    if (item.id === 'campaigns') {
      onCampaignsViewChange('overview');
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-10">
      {/* Logo - Fixed at top */}
      <div className="p-6 flex-shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">Dhwani</span>
            <span className="text-xs text-gray-500">Voice AI Agents Playground</span>
          </div>
        </div>
      </div>

      {/* Navigation - Scrollable middle section */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg mb-1 transition-colors ${
                activeTab === item.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* User Menu - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium truncate">
                  {user?.user_metadata?.full_name || user?.email}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Footer in Sidebar - Fixed at very bottom */}
      <div className="bg-gray-50 border-t border-gray-200 py-3 px-6 flex-shrink-0">
        <div className="flex items-center justify-center text-xs text-gray-500">
          <span>Made with</span>
          <Heart className="w-3 h-3 mx-1 text-red-500 fill-current" />
          <span>by Aivar Innovations</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
