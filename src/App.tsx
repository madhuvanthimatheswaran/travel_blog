import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Write from './pages/Write';
import PostDetail from './pages/PostDetail';

// Replace this with your actual Clerk publishable key
const CLERK_PUBLISHABLE_KEY = 'pk_test_Z3JlYXQtY2hpY2tlbi04Mi5jbGVyay5hY2NvdW50cy5kZXYk';

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/write" element={<Write />} />
              <Route path="/post/:id" element={<PostDetail />} />
            </Routes>
          </main>
          <Toaster position="bottom-right" />
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;