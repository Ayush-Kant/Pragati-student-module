import React, { useState } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { formatDateTime } from '../../utils/projectHelpers';

export const ReviewComments = ({ comments = [], onAddComment }) => {
  const [newCommentText, setNewCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    if (onAddComment) {
      onAddComment(newCommentText);
    }
    setNewCommentText('');
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-md">
      <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-indigo-400" /> Mentor & Student Discussion Thread
      </h3>

      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No feedback comments recorded yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-slate-900/70 p-4 rounded-xl border border-slate-700/40 flex items-start gap-3.5">
              <img
                src={comment.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={comment.author}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30 shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs font-bold text-slate-100">{comment.author}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{formatDateTime(comment.timestamp)}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Reply Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Reply to faculty mentor feedback..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-400 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all inline-flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-3.5 h-3.5" /> Reply
        </button>
      </form>
    </div>
  );
};

export default ReviewComments;
