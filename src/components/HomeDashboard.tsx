
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, DollarSign, Users, Calendar, Bell, Search, ChevronRight } from 'lucide-react';

const HomeDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This month');

  const callsOverview = [
    {
      title: '24',
      subtitle: 'Total Call Minutes',
      change: '+6% last month',
      icon: Phone,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: '56',
      subtitle: 'Number of calls',
      change: '+10% Last month',
      icon: Phone,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/20'
    },
    {
      title: '$1,000',
      subtitle: 'Total Spent',
      change: '+8% last month',
      icon: DollarSign,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    {
      title: '56',
      subtitle: 'Average Cost Per Call',
      change: '+36% Last month',
      icon: DollarSign,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    }
  ];

  const agentData = [
    { name: 'Nuray Aksoy', callCount: '08', duration: '118 min', lastCall: '21 Dec, 02:46 PM' },
    { name: 'Arthur Taylor', callCount: '02', duration: '0.61 min', lastCall: '21 Dec, 02:46 PM' },
    { name: 'Wei Chen', callCount: '05', duration: '12.60 min', lastCall: '21 Dec, 02:46 PM' },
    { name: 'Lena Miller', callCount: '12', duration: '11.25 min', lastCall: '21 Dec, 02:46 PM' }
  ];

  const appointmentData = [
    {
      title: '125',
      subtitle: 'Booked Appointments',
      change: '+2.5%',
      comparison: '112 compared to last month',
      icon: Calendar,
      color: 'text-purple-400'
    },
    {
      title: '45',
      subtitle: 'Reminder Calls',
      change: '+2.5%',
      comparison: '35 compared to last month',
      icon: Bell,
      color: 'text-orange-400'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hello, Timothy 👋</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search...
          </Button>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option>This month</option>
            <option>Last month</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      {/* Calls Overview */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Calls Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {callsOverview.map((stat, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{stat.title}</div>
                  <div className="text-sm text-gray-600">{stat.subtitle}</div>
                  <div className="text-xs text-green-600">{stat.change}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calls by Agent */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Calls by Agent</CardTitle>
                <Button variant="ghost" size="sm">
                  See All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 pb-2 border-b">
                  <span>Assistant Name</span>
                  <span>Call Count</span>
                  <span>Average Duration</span>
                  <span>Date & Time</span>
                </div>
                {agentData.map((agent, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 text-sm py-3 border-b border-gray-100 last:border-0">
                    <span className="font-medium text-gray-900">{agent.name}</span>
                    <span className="text-gray-600">{agent.callCount}</span>
                    <span className="text-gray-600">{agent.duration}</span>
                    <span className="text-gray-600">{agent.lastCall}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Button variant="ghost" size="sm">Previous</Button>
                  <span className="px-3 py-1 bg-gray-100 rounded">1</span>
                  <Button variant="ghost" size="sm">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments and Reminders */}
        <div className="space-y-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Appointments and Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {appointmentData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-100`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.subtitle}</div>
                      <div className="text-xs text-green-600 flex items-center gap-1">
                        <span>{item.change}</span>
                        <span className="text-gray-500">{item.comparison}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Period Selector */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-5 gap-2 text-xs">
                {['7D', '2W', '1M', '6M', '1Y'].map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-2 rounded text-center ${
                      period === '1M' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Call Analysis</CardTitle>
            <CardDescription>Here you can get the quick overview of how your calls are going within your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Reason Call Ended</span>
              </div>
              
              {/* Mock chart placeholder */}
              <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Call Data</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                      Total Call Minutes
                    </span>
                    <span className="font-medium">201</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                      Number of Calls
                    </span>
                    <span className="font-medium">54</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      Total Spent
                    </span>
                    <span className="font-medium">$90.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                      Average Cost Per Call
                    </span>
                    <span className="font-medium">$89.00</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Average Call Duration by Agent</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mock chart placeholder */}
            <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center text-gray-500">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Duration</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    Total Call Minutes
                  </span>
                  <span className="font-medium">201</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                    Number of Calls
                  </span>
                  <span className="font-medium">54</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                    Total Spent
                  </span>
                  <span className="font-medium">$90.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                    Average Cost Per Call
                  </span>
                  <span className="font-medium">$89.00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeDashboard;
