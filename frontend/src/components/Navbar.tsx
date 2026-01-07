import { Plus } from 'lucide-react';
import { Button } from './ui/button';

interface NavbarProps {
  currentView: 'overview' | 'dashboard';
  onViewChange: (view: 'overview' | 'dashboard') => void;
  onNewReport: () => void;
}

export function Navbar({ currentView, onViewChange, onNewReport }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center px-6 gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="font-semibold">CyberSec</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onViewChange('overview')}
            className={`text-sm transition-colors ${
              currentView === 'overview' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onViewChange('dashboard')}
            className={`text-sm transition-colors ${
              currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Dashboard
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button className="gap-2" onClick={onNewReport}>
            <Plus className="h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>
    </nav>
  );
}