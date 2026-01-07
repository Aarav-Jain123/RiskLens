import { Shield, FileText, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DashboardData } from '../types/dashboard';

interface HeroPanelProps {
  data: DashboardData | null;
}

export function HeroPanel({ data }: HeroPanelProps) {
  // Calculate stats from data
  const totalThreats = data?.threat_analytics.total_threat_count || 0;
  
  const threatsPerDayData = data?.threat_analytics.threats_per_day || {};
  const daysWithThreats = Object.keys(threatsPerDayData).length;
  const avgThreatsPerDay = daysWithThreats > 0 
    ? (totalThreats / daysWithThreats).toFixed(2) 
    : '0.00';

  // Transform top_threat_subclasses for the bar chart
  const threatData = data?.threat_analytics.top_threat_subclasses 
    ? Object.entries(data.threat_analytics.top_threat_subclasses)
        .map(([name, value]) => ({
          name,
          value,
          color: '#3b82f6',
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
    : [];

  // Get the date range for the chart title
  const dates = Object.keys(threatsPerDayData).sort();
  const dateRange = dates.length > 0 
    ? `${new Date(dates[0]).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${new Date(dates[dates.length - 1]).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    : 'No data';

  // Calculate accuracy percentage for the circular indicator
  const accuracyStr = data?.model_performance.accuracy || '0%';
  const accuracy = parseFloat(accuracyStr.replace('%', ''));

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-gray-900 mb-2">Cybersecurity Dashboard with Risk and Compliance</h1>
        <p className="text-gray-600 text-sm">
          Model Performance: {data?.model_performance.accuracy || 'N/A'} - Status: {data?.model_performance.status || 'N/A'}
        </p>
      </div>

      {/* Main Stats and Threat Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Stats */}
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Threats */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Threats</p>
              <p className="text-4xl font-semibold text-blue-600">{totalThreats.toLocaleString()}</p>
            </div>

            {/* Average Threats Per Day */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Average Threats Per Day</p>
              <p className="text-4xl font-semibold text-blue-600">{avgThreatsPerDay}</p>
            </div>
          </div>

          {/* Threat Detection - Model Accuracy */}
          <div>
            <h3 className="text-center mb-4">Model Accuracy</h3>
            <div className="flex items-center justify-center gap-8">
              {/* Circular indicator */}
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#1e40af"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(accuracy / 100) * 351.86} 351.86`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold text-blue-900">{accuracyStr}</span>
                  <span className="text-xs text-gray-600">Accuracy</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1 bg-blue-900"></div>
                  <span className="text-sm">Status: <span className="font-semibold">{data?.model_performance.status || 'N/A'}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1 bg-gray-300"></div>
                  <span className="text-sm">Threats: <span className="font-semibold">{totalThreats}</span></span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Side - Top 10 Threats */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Top Threats by Sub Class</h3>
            <span className="text-sm text-gray-600">{dateRange}</span>
          </div>
          {threatData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={threatData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {threatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-400">
              No threat data available
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
