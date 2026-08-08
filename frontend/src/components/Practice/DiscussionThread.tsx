import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Comment {
  comment_id: string;
  question_id: string;
  user_id: string;
  user_name: string;
  comment: string;
  created_at: string;
  likes: number;
  parent_id?: string;
  replies?: Comment[];
}

interface DiscussionData {
  question_id: string;
  comments: Comment[];
  total: number;
}

interface DiscussionThreadProps {
  questionId: string;
}

const DiscussionThread: React.FC<DiscussionThreadProps> = ({ questionId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<DiscussionData>(
        `/auth/discussions?question_id=${questionId}`
      );
      if (response.success && response.data) {
        setComments(response.data.comments || []);
        setTotal(response.data.total || 0);
      }
    } catch {
      // Silently fail — discussions are non-critical
    } finally {
      setIsLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, fetchComments]);

  const handlePost = async (parentId?: string) => {
    const text = parentId ? replyText : newComment;
    if (!text.trim() || !user) return;

    setIsPosting(true);
    try {
      const response = await apiClient.post<{ comment_id: string; created_at: string }>(
        '/auth/discussions',
        {
          question_id: questionId,
          user_id: user.user_id,
          user_name: user.full_name || 'Anonymous',
          comment: text.trim(),
          parent_id: parentId || '',
        }
      );

      if (response.success) {
        // Clear input and refresh
        if (parentId) {
          setReplyText('');
          setReplyingTo(null);
        } else {
          setNewComment('');
        }
        await fetchComments();
      }
    } catch {
      // ignore
    } finally {
      setIsPosting(false);
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch {
      return '';
    }
  };

  return (
    <div className="mt-3">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition font-medium"
      >
        <span>💬</span>
        <span>
          {isOpen ? 'Hide Discussion' : 'Discussion'}
          {total > 0 && ` (${total})`}
        </span>
      </button>

      {/* Discussion Panel */}
      {isOpen && (
        <div className="mt-3 bg-white border border-gray-200 rounded-lg p-4">
          {/* Post New Comment */}
          {user && (
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold flex-shrink-0">
                  {(user.full_name || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a doubt or share your reasoning..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    rows={2}
                    maxLength={1000}
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-gray-400">{newComment.length}/1000</span>
                    <button
                      onClick={() => handlePost()}
                      disabled={!newComment.trim() || isPosting}
                      className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      {isPosting ? '...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments List */}
          {isLoading ? (
            <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No comments yet. Be the first to start the discussion!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.comment_id}>
                  {/* Top-level comment */}
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                      {(comment.user_name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {comment.user_name}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap break-words">
                        {comment.comment}
                      </p>
                      <button
                        onClick={() => setReplyingTo(
                          replyingTo === comment.comment_id ? null : comment.comment_id
                        )}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-1"
                      >
                        Reply
                      </button>

                      {/* Reply Input */}
                      {replyingTo === comment.comment_id && user && (
                        <div className="mt-2 flex gap-2">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${comment.user_name}...`}
                            className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            rows={1}
                            maxLength={1000}
                          />
                          <button
                            onClick={() => handlePost(comment.comment_id)}
                            disabled={!replyText.trim() || isPosting}
                            className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition self-end"
                          >
                            {isPosting ? '...' : 'Reply'}
                          </button>
                        </div>
                      )}

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 ml-2 pl-3 border-l-2 border-gray-100 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.comment_id} className="flex gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold flex-shrink-0">
                                {(reply.user_name || 'A').charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-gray-800 truncate">
                                    {reply.user_name}
                                  </span>
                                  <span className="text-xs text-gray-400">{formatDate(reply.created_at)}</span>
                                </div>
                                <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap break-words">
                                  {reply.comment}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscussionThread;
