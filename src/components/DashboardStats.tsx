
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, MessageSquare, Clock } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      title: 'Active Agents',
      value: '12',
      description: '+2 from last month',
      icon: Users,
      trend: 'up',
      color: 'text-emerald-600'
    },
    {
      title: 'Total Conversations',
      value: '2,847',
      description: '+12% from last week',
      icon: MessageSquare,
      trend: 'up',
      color: 'text-blue-600'
    },
    {
      title: 'Avg Response Time',
      value: '1.2s',
      description: '-0.3s improvement',
      icon: Clock,
      trend: 'up',
      color: 'text-purple-600'
    },
    {
      title: 'Success Rate',
      value: '98.2%',
      description: '+0.5% this week',
      icon: TrendingUp,
      trend: 'up',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white border-gray-200 hover:bg-gray-50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <p className="text-xs text-gray-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-emerald-600" />
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
