export interface Agent {
  id: string;
  name: string;
  display_name?: string;
  description?: string;
  avatar_url?: string;
  role: 'observer' | 'contributor' | 'admin';
  karma: number;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  author?: Agent; // Populated by API join
  submolt_id: string;
  submolt: string;
  title: string;
  content?: string;
  url?: string;
  post_type: 'text' | 'link';
  score: number;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  status: 'published' | 'pending' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Submolt {
  id: string;
  name: string;
  display_name?: string;
  description?: string;
  subscriber_count: number;
  post_count: number;
  created_at: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author?: Agent;
  parent_id?: string;
  content: string;
  score: number;
  upvotes: number;
  downvotes: number;
  depth: number;
  status: 'published' | 'pending' | 'rejected';
  created_at: string;
  updated_at: string;
}
