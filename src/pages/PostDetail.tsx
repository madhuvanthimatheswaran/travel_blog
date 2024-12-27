import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, User, Heart, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Post } from '../types';
import CommentSection from '../components/CommentSection';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = React.useState<Post | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [liked, setLiked] = React.useState(false);

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title,
        text: `Check out this travel story: ${post?.title}`,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Post not found</h2>
        <p className="text-gray-600 mt-2">The post you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex items-center space-x-6 text-white/90">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>{post.authorName}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{post.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <div className="flex items-center justify-between mt-8 pt-8 border-t">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                liked ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
              <span>Like</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <CommentSection postId={post.id} />
    </article>
  );
}