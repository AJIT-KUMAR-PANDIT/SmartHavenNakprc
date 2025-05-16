import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import { formatDate } from '@/lib/utils';

// Time range selector component
const TimeRangeSelector = ({ value, onChange }) => {
  const ranges = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ];
  
  return (
    <div className="flex rounded-md overflow-hidden">
      {ranges.map(range => (
        <button
          key={range.id}
          className={`px-4 py-2 text-sm focus:outline-none transition-colors ${
            value === range.id
              ? 'bg-[#2563eb] text-white'
              : 'bg-[#1e1e2e] text-gray-300 hover:bg-gray-700'
          }`}
          onClick={() => onChange(range.id)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

// Analytics card component
const AnalyticsCard = ({ title, icon, children }) => {
  return (
    <div className="bg-[#1e1e2e] rounded-xl p-5 shadow-md border border-gray-800">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-medium text-lg">{title}</h3>
        <span className="text-gray-400 text-xl">{icon}</span>
      </div>
      {children}
    </div>
  );
};

// Device usage breakdown
const DeviceUsageChart = ({ data }) => {
  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value} hrs`, 'Usage']}
          contentStyle={{ backgroundColor: '#1e1e2e', borderColor: '#374151' }}
        />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Energy consumption chart
const EnergyConsumptionChart = ({ data, timeRange }) => {
  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    
    switch(timeRange) {
      case 'day':
        return date.getHours() + ':00';
      case 'week':
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      case 'month':
        return date.getDate();
      case 'year':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
      default:
        return formatDate(timestamp);
    }
  };
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="timestamp"
          tickFormatter={formatXAxis}
          stroke="#9CA3AF"
        />
        <YAxis stroke="#9CA3AF" />
        <Tooltip 
          formatter={(value) => [`${value} kWh`, 'Energy']}
          contentStyle={{ backgroundColor: '#1e1e2e', borderColor: '#374151' }}
          labelFormatter={(timestamp) => formatDate(timestamp)}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#2563eb" 
          fillOpacity={1} 
          fill="url(#colorPower)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Device activity chart
const DeviceActivityChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip 
          formatter={(value) => [`${value} actions`, 'Activity']}
          contentStyle={{ backgroundColor: '#1e1e2e', borderColor: '#374151' }}
        />
        <Bar dataKey="value" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Temperature chart
const TemperatureChart = ({ data, timeRange }) => {
  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    
    switch(timeRange) {
      case 'day':
        return date.getHours() + ':00';
      case 'week':
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      case 'month':
        return date.getDate();
      case 'year':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
      default:
        return formatDate(timestamp);
    }
  };
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="timestamp"
          tickFormatter={formatXAxis}
          stroke="#9CA3AF"
        />
        <YAxis stroke="#9CA3AF" />
        <Tooltip 
          formatter={(value) => [`${value}°C`, 'Temperature']}
          contentStyle={{ backgroundColor: '#1e1e2e', borderColor: '#374151' }}
          labelFormatter={(timestamp) => formatDate(timestamp)}
        />
        <Line 
          type="monotone" 
          dataKey="indoor" 
          stroke="#f59e0b" 
          activeDot={{ r: 8 }} 
        />
        <Line 
          type="monotone" 
          dataKey="outdoor" 
          stroke="#8b5cf6"
        />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Stats card component
const StatsCard = ({ title, value, subtitle, icon, trend, trendValue }) => {
  return (
    <div className="bg-[#1e1e2e] rounded-xl p-5 shadow-md border border-gray-800">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-semibold mb-1">{value}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end justify-between">
          <div className="text-xl p-3 bg-[#1e40af]/20 text-[#3b82f6] rounded-lg">
            <i className={icon}></i>
          </div>
          
          {trend && (
            <div className={`text-xs flex items-center ${
              trend === 'up' ? 'text-[#10b981]' : 'text-[#ef4444]'
            }`}>
              <i className={`${trend === 'up' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} mr-1`}></i>
              {trendValue}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('week');
  
  // Query to fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['/api/analytics', { range: timeRange }],
    refetchOnWindowFocus: false
  });
  
  // Sample mock data (will be replaced with real data from API)
  const mockEnergy = [
    { timestamp: '2023-05-10T00:00:00', value: 2.1 },
    { timestamp: '2023-05-10T04:00:00', value: 1.8 },
    { timestamp: '2023-05-10T08:00:00', value: 3.5 },
    { timestamp: '2023-05-10T12:00:00', value: 4.2 },
    { timestamp: '2023-05-10T16:00:00', value: 3.8 },
    { timestamp: '2023-05-10T20:00:00', value: 2.9 }
  ];
  
  const mockTemperature = [
    { timestamp: '2023-05-10T00:00:00', indoor: 22.1, outdoor: 18.5 },
    { timestamp: '2023-05-10T04:00:00', indoor: 21.8, outdoor: 17.2 },
    { timestamp: '2023-05-10T08:00:00', indoor: 23.5, outdoor: 20.8 },
    { timestamp: '2023-05-10T12:00:00', indoor: 24.2, outdoor: 25.1 },
    { timestamp: '2023-05-10T16:00:00', indoor: 23.8, outdoor: 24.2 },
    { timestamp: '2023-05-10T20:00:00', indoor: 22.9, outdoor: 22.5 }
  ];
  
  const mockDeviceUsage = [
    { name: 'Lights', value: 12 },
    { name: 'HVAC', value: 8 },
    { name: 'Entertainment', value: 4 },
    { name: 'Kitchen', value: 3 },
    { name: 'Other', value: 2 }
  ];
  
  const mockDeviceActivity = [
    { name: 'Living Room', value: 45 },
    { name: 'Bedroom', value: 30 },
    { name: 'Kitchen', value: 25 },
    { name: 'Bathroom', value: 15 },
    { name: 'Office', value: 20 }
  ];
  
  const data = analyticsData || { 
    energy: mockEnergy,
    temperature: mockTemperature,
    deviceUsage: mockDeviceUsage,
    deviceActivity: mockDeviceActivity,
    stats: {
      totalDevices: 12,
      activeDevices: 8,
      totalScenes: 6,
      energyToday: '5.2 kWh'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563eb]"></div>
        </div>
      ) : (
        <>
          {/* Stats summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatsCard 
              title="Total Devices"
              value={data.stats.totalDevices}
              subtitle="Connected to SmartHaven"
              icon="ri-device-line"
            />
            <StatsCard 
              title="Active Devices"
              value={data.stats.activeDevices}
              subtitle="Currently online"
              icon="ri-pulse-line"
              trend="up"
              trendValue="4 more than yesterday"
            />
            <StatsCard 
              title="Total Scenes"
              value={data.stats.totalScenes}
              subtitle="Automation scenes"
              icon="ri-film-line"
            />
            <StatsCard 
              title="Energy Today"
              value={data.stats.energyToday}
              subtitle="Total consumption"
              icon="ri-flashlight-line"
              trend="down"
              trendValue="12% less than average"
            />
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AnalyticsCard title="Energy Consumption" icon={<i className="ri-flashlight-line"></i>}>
              <EnergyConsumptionChart data={data.energy} timeRange={timeRange} />
            </AnalyticsCard>
            
            <AnalyticsCard title="Temperature Trends" icon={<i className="ri-temp-hot-line"></i>}>
              <TemperatureChart data={data.temperature} timeRange={timeRange} />
            </AnalyticsCard>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsCard title="Device Usage Breakdown" icon={<i className="ri-pie-chart-line"></i>}>
              <DeviceUsageChart data={data.deviceUsage} />
            </AnalyticsCard>
            
            <AnalyticsCard title="Device Activity by Room" icon={<i className="ri-bar-chart-grouped-line"></i>}>
              <DeviceActivityChart data={data.deviceActivity} />
            </AnalyticsCard>
          </div>
        </>
      )}
    </motion.div>
  );
}