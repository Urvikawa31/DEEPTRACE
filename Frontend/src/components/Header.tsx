import { Cpu } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: 'landing' | 'scan' | 'about') => void;
  activeSection: string;
}

export default function Header({ onNavigate, activeSection }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('landing')}
        >
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">DEEPTRACE</span>
        </div>

        <nav className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('landing')}
            className={`text-sm font-medium transition-colors ${
              activeSection === 'landing'
                ? 'text-blue-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('scan')}
            className={`text-sm font-medium transition-colors ${
              activeSection === 'scan'
                ? 'text-blue-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Scan
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`text-sm font-medium transition-colors ${
              activeSection === 'about'
                ? 'text-blue-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            About
          </button>
        </nav>
      </div>
    </header>
  );
}
