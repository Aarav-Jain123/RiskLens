import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { DashboardData } from '../types/dashboard';

interface DashboardViewProps {
  userId: string | null;
  data: DashboardData | null;
  onBack: () => void;
}

export function DashboardView({ userId, data, onBack }: DashboardViewProps) {
  const userData = data?.user_activity_monitor.find(user => user.user_id === userId);

  const threatsPerDayData = data?.threat_analytics.threats_per_day || {};
  const timelineData = Object.entries(threatsPerDayData)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, count]) => ({
      name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      threats: count,
      average: data ? Math.round(data.threat_analytics.total_threat_count / Object.keys(threatsPerDayData).length) : 0,
    }));

  const locationData = userData?.unique_locations.map((location, index) => ({
    name: location,
    value: 1,
  })) || [];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#f97316'];

  const totalEvents = userData?.total_events || 0;
  const threatEvents = userData?.threat_events || 0;
  const safeEvents = totalEvents - threatEvents;
  const alertReason = userData?.alert_reason || 0;

  const eventTypeData = [
    { name: 'Safe Events', value: safeEvents, color: '#10b981' },
    { name: 'Threat Events', value: threatEvents, color: '#ef4444' },
  ];

  const threatPercentage = totalEvents > 0 ? ((threatEvents / totalEvents) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Overview
        </Button>
        {userId && (
          <div>
            <h2 className="text-gray-900">User Dashboard - {userId}</h2>
            <p className="text-sm text-gray-600">Last active: {userData?.last_active || 'N/A'}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4">Threats Over Time</h3>
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }} 
                  interval={Math.floor(timelineData.length / 8)}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="average" stroke="#d1d5db" fill="#f3f4f6" name="Daily Average" />
                <Area type="monotone" dataKey="threats" stroke="#3b82f6" fill="#93c5fd" name="Threats Detected" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No timeline data available
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Event Type Distribution</h3>
          {totalEvents > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No event data available
            </div>
          )}
        </Card>
      </div>

      {locationData.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Access Locations ({locationData.length} unique locations)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Total Events</p>
          <p className="text-3xl font-semibold text-gray-900">{totalEvents}</p>
          <p className="text-xs text-gray-500 mt-2">All user events</p>
        </Card>
        
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Threat Events</p>
          <p className="text-3xl font-semibold text-red-600">{threatEvents}</p>
          <p className="text-xs text-gray-500 mt-2">Security incidents</p>
        </Card>
        
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Threat Percentage</p>
          <p className="text-3xl font-semibold text-orange-600">{threatPercentage}%</p>
          <p className="text-xs text-gray-500 mt-2">Of all events</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Reason For Threat</p>
              {/* {userData?.threat_events > 20 && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                        <b>High Risk</b> — 
                      </span>
                    )} */}
          <p className="text-3s font-hairline text-orange-600">{alertReason}</p>
          {userData?.threat_events > 20 && (
                      <span className="px-0 py-0 rounded text-xs">
                        <b>Risk Rationale:</b> Such interactions in high amounts often precede credential misuse, followed by authentication failures, resulting in possible credential compromise.
                      </span>
                    )}
        </Card>
      </div>
    </div>
  );
}
