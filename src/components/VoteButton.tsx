'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface VoteButtonProps {
  targetType: 'thread' | 'reply';
  targetId: string;
  initialUpvotes: number;
  initialDownvotes: number;
  orientation?: 'vertical' | 'horizontal';
}

export function VoteButton({
  targetType,
  targetId,
  initialUpvotes,
  initialDownvotes,
  orientation = 'vertical',
}: VoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<1 | -1 | 0>(0);
  const [isLoading, setIsLoading] = useState(false);

  const score = upvotes - downvotes;

  const handleVote = async (val: 1 | -1) => {
    if (isLoading) return;

    const previousVote = userVote;
    const newVote = userVote === val ? 0 : val;

    // Optimistic UI updates
    setUserVote(newVote);
    if (previousVote === 1) setUpvotes(u => u - 1);
    if (previousVote === -1) setDownvotes(d => d - 1);
    if (newVote === 1) setUpvotes(u => u + 1);
    if (newVote === -1) setDownvotes(d => d + 1);

    setIsLoading(true);
    try {
      await fetch('/api/forum/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          vote_value: val,
        }),
      });
    } catch (err) {
      console.error('Failed to register vote:', err);
      // Revert on failure
      setUserVote(previousVote);
    } finally {
      setIsLoading(false);
    }
  };

  if (orientation === 'horizontal') {
    return (
      <div className="inline-flex items-center gap-1 rounded-lg bg-slate-800/80 p-1 border border-slate-700/60 text-xs">
        <button
          onClick={() => handleVote(1)}
          className={`p-1 rounded hover:bg-slate-700 transition ${userVote === 1 ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white'}`}
          aria-label="Upvote"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <span className={`font-semibold px-1 min-w-[20px] text-center ${userVote === 1 ? 'text-indigo-400' : userVote === -1 ? 'text-rose-400' : 'text-slate-300'}`}>
          {score}
        </span>
        <button
          onClick={() => handleVote(-1)}
          className={`p-1 rounded hover:bg-slate-700 transition ${userVote === -1 ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-white'}`}
          aria-label="Downvote"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-slate-900/90 border border-slate-800 p-1.5 w-11 shadow-sm">
      <button
        onClick={() => handleVote(1)}
        className={`p-1 rounded-md transition ${userVote === 1 ? 'text-indigo-400 bg-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        aria-label="Upvote"
      >
        <ChevronUp className="w-5 h-5 stroke-[2.5]" />
      </button>
      <span className={`text-xs font-bold my-1 ${userVote === 1 ? 'text-indigo-400' : userVote === -1 ? 'text-rose-400' : 'text-slate-300'}`}>
        {score}
      </span>
      <button
        onClick={() => handleVote(-1)}
        className={`p-1 rounded-md transition ${userVote === -1 ? 'text-rose-400 bg-rose-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        aria-label="Downvote"
      >
        <ChevronDown className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
