export interface DashboardData {
  model_performance: {
    accuracy: string;
    status: string;
  };
  threat_analytics: {
    total_threat_count: number;
    threats_per_day: Record<string, number>;
    top_threat_subclasses: Record<string, number>;
    risk_percentage_by_event: Record<string, string>;
  };
  user_activity_monitor: Array<{
    user_id: string;
    total_events: number;
    threat_events: number;
    last_active: string;
    unique_locations: string[];
  }>;
}
