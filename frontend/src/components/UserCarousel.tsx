import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';
import { DashboardData } from '../types/dashboard';

interface UserCarouselProps {
  data: DashboardData | null;
  onSelectUser: (userId: string) => void;
}

export function UserCarousel({ data, onSelectUser }: UserCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4;

  // Use data from API or fallback to empty array
  const users = data?.user_activity_monitor || [];

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerView));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => 
      Math.min(users.length - itemsPerView, prev + itemsPerView)
    );
  };

  const visibleUsers = users.slice(currentIndex, currentIndex + itemsPerView);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex + itemsPerView < users.length;

  // Helper function to get initials from user_id
  const getInitials = (userId: string) => {
    const parts = userId.split('_');
    if (parts.length > 1) {
      return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
    }
    return userId.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">User Activity Monitor</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canGoNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {visibleUsers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleUsers.map((user) => (
              <Card
                key={user.user_id}
                className="p-6 hover:shadow-lg transition-all cursor-pointer hover:border-blue-500"
                onClick={() => onSelectUser(user.user_id)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {getInitials(user.user_id)}
                      </span>
                    </div>
                    {user.threat_events > 10 && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                        Alert
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.user_id}</h3>
                    <p className="text-xs text-gray-500 mt-1">Last Active: {user.last_active}</p>
                    <p className="text-xs text-gray-500">Locations: {user.unique_locations.length}</p>
                  </div>

                  <div className="pt-3 border-t space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Total Events</span>
                      <span className="font-semibold text-gray-900">{user.total_events}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Threat Events</span>
                      <span className="font-semibold text-red-600">{user.threat_events}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center text-sm text-gray-500">
            Showing {currentIndex + 1}-{Math.min(currentIndex + itemsPerView, users.length)} of {users.length} users
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          No user activity data available
        </div>
      )}
    </div>
  );
}
