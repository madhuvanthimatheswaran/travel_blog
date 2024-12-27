import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <Link to={`/post/${post.id}`}>
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{post.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorId}`}
              alt={post.authorName}
              className="h-8 w-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-600">{post.authorName}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}