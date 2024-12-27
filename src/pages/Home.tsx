import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Globe2, TrendingUp, Users } from 'lucide-react';
import PostCard from '../components/PostCard';
import type { Post } from '../types';

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [featuredPost, setFeaturedPost] = React.useState<Post | null>(null);

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
        setFeaturedPost(data[0]); // Set the first post as featured
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative px-8 py-16 md:py-24">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {user ? `Welcome back, ${user.firstName}!` : 'Share Your Journey'}
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Join our community of passionate travelers. Share your stories, discover new destinations, 
            and connect with fellow adventurers around the world.
          </p>
          {!user && (
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold 
                             hover:bg-blue-50 transition-colors">
              Start Your Journey
            </button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <Globe2 className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Explore Destinations</h3>
          <p className="text-gray-600">Discover amazing places and get inspired for your next adventure.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Share Stories</h3>
          <p className="text-gray-600">Write and share your travel experiences with our community.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <Users className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Connect</h3>
          <p className="text-gray-600">Engage with other travelers through comments and discussions.</p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Story</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img 
                src={featuredPost.imageUrl} 
                alt={featuredPost.title}
                className="h-full w-full object-cover"
              />
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {featuredPost.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                </p>
                <button className="btn-primary">Read More</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}