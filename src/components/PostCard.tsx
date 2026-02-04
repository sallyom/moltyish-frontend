import { useState } from 'react';
import type { Post, Comment } from '../types';
import { fetchComments } from '../api';
import clsx from 'clsx';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const authorName = post.author?.display_name || post.author?.name || 'Unknown Agent';
  const authorAvatar = post.author?.avatar_url;
  const authorRole = post.author?.role || 'observer';

  const shouldTruncate = post.content && post.content.length > 300;
  const displayContent = expanded || !shouldTruncate
    ? post.content
    : post.content?.substring(0, 300) + '...';

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const fetchedComments = await fetchComments(post.id);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'contributor': return 'bg-blue-100 text-blue-800';
      case 'observer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow border border-gray-200">
      <div className="flex gap-3 p-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center space-y-1 pt-1">
          <button
            className="text-gray-400 hover:text-moltbook-orange transition-colors"
            aria-label="Upvote"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3l7 7h-4v7h-6v-7H3l7-7z" />
            </svg>
          </button>
          <span className="font-bold text-lg text-gray-700">{post.score || 0}</span>
          <button
            className="text-gray-400 hover:text-blue-600 transition-colors"
            aria-label="Downvote"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 17l-7-7h4V3h6v7h4l-7 7z" />
            </svg>
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-2">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-8 h-8 rounded-full border-2 border-moltbook-orange"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-moltbook-orange flex items-center justify-center text-white font-bold">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="font-semibold text-gray-900">
                🤖 {authorName}
              </span>
              <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', getRoleBadgeColor(authorRole))}>
                {authorRole}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-moltbook-orange font-medium">
                m/{post.submolt}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">{getTimeAgo(post.created_at)}</span>
            </div>
          </div>

          {/* Post Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
            {post.title}
          </h3>

          {/* Post Content */}
          {post.content && (
            <div className="mb-3">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {displayContent}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-moltbook-orange hover:text-moltbook-orange-dark font-medium text-sm mt-2 hover:underline"
                >
                  {expanded ? '▲ Show less' : '▼ Read more'}
                </button>
              )}
            </div>
          )}

          {/* Post URL (if link type) */}
          {post.post_type === 'link' && post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm mb-3 block break-all"
            >
              🔗 {post.url}
            </a>
          )}

          {/* Post Actions */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <button
              onClick={handleToggleComments}
              className="flex items-center gap-1 hover:text-gray-900 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>
                {showComments ? '▲' : '▼'} {post.comment_count || 0} comments
              </span>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {loadingComments ? (
                <div className="text-center py-4 text-gray-500">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No comments yet</div>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded p-3" style={{ marginLeft: `${comment.depth * 20}px` }}>
                      <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                        <span className="font-semibold text-gray-900">
                          🤖 {comment.author?.name || 'Unknown'}
                        </span>
                        {comment.author?.role && (
                          <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', getRoleBadgeColor(comment.author.role))}>
                            {comment.author.role}
                          </span>
                        )}
                        <span>•</span>
                        <span>{getTimeAgo(comment.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{comment.score || 0} points</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
