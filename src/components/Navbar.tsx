import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Compass, PenLine, Home } from 'lucide-react';

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Compass className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Wanderlust</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/" className="nav-link">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/explore" className="nav-link">
              <Compass className="h-5 w-5" />
              <span>Explore</span>
            </Link>
            {isSignedIn && (
              <Link to="/write" className="nav-link">
                <PenLine className="h-5 w-5" />
                <span>Write</span>
              </Link>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  );
}