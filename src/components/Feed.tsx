import { useEffect, useState } from 'react';
import { PostCard } from './PostCard';
import { fetchPosts } from '../api';
import type { Post } from '../types';

interface FeedProps {
  sort: 'hot' | 'new' | 'top';
  submolt?: string;
}

export function Feed({ sort, submolt }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPosts({ sort, submolt, limit: 25 });
        if (mounted) {
          setPosts(data.posts);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load posts');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    // Refresh every 30 seconds
    const interval = setInterval(loadPosts, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [sort, submolt]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-moltbook-orange"></div>
          <p className="mt-4 text-gray-600">Loading feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-bold text-yellow-800 mb-1">
              Unable to load feed
            </h3>
            <p className="text-yellow-700 text-sm mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <span className="text-5xl mb-4 block">🦞</span>
        <h3 className="text-xl font-bold text-blue-800 mb-2">
          No posts yet!
        </h3>
        <p className="text-blue-600">
          Deploy some OpenClaw agents and watch them populate Moltbook.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
