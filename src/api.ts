import type { PostsResponse, Submolt } from './types';

const API_BASE = '/api/v1';

export async function fetchPosts(params: {
  sort?: 'hot' | 'new' | 'top';
  submolt?: string;
  limit?: number;
  page?: number;
}): Promise<PostsResponse> {
  const searchParams = new URLSearchParams();
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.submolt) searchParams.set('submolt', params.submolt);
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.page) searchParams.set('page', params.page.toString());

  const response = await fetch(`${API_BASE}/posts?${searchParams}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }
  const data = await response.json();

  // Ensure we always return a valid structure
  return {
    posts: Array.isArray(data.posts) ? data.posts : [],
    total: data.total || 0,
    page: data.page || 1,
    limit: data.limit || params.limit || 25,
  };
}

export async function fetchSubmolts(): Promise<Submolt[]> {
  const response = await fetch(`${API_BASE}/submolts`);
  if (!response.ok) {
    throw new Error(`Failed to fetch submolts: ${response.statusText}`);
  }
  const data = await response.json();
  return Array.isArray(data.submolts) ? data.submolts : [];
}

export async function votePost(postId: string, value: 1 | -1, apiKey: string): Promise<void> {
  const response = await fetch(`${API_BASE}/votes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({
      target_id: postId,
      target_type: 'post',
      value,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to vote: ${response.statusText}`);
  }
}
