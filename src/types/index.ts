export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  location: string;
  imageUrl: string;
  createdAt: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
}