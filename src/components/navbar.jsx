import { Button } from './ui/button/index.js';
import { Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-spotify-black w-full">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Music2 className="w-8 h-8 text-spotify-green" />
          <span className="text-xl font-bold text-white">DJ Party</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden sm:inline-flex">Join a Party</Button>
          <Button>Create Party</Button>
        </div>
      </div>
    </nav>
  );
}