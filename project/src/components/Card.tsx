import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { formatDate } from '../utils/date';

interface CardProps {
  content: string;
  createdAt: string;
  shareId: string;
  onShare: () => void;
}

export function Card({ content, createdAt, shareId, onShare }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full h-80 cursor-pointer perspective-1000 mx-auto max-w-2xl group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="w-full h-full backdrop-blur-xl bg-gradient-to-br from-purple-400/20 to-fuchsia-400/20 rounded-xl shadow-lg shadow-purple-900/20 p-6 flex items-center justify-center border-2 border-purple-300/30 group-hover:border-purple-300/40 transition-all">
            <p className="text-xl font-medium text-purple-100">Click to reveal content</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full backdrop-blur-xl bg-gradient-to-br from-purple-950/40 to-fuchsia-900/40 rounded-xl shadow-lg shadow-purple-900/20 p-6 flex flex-col border-2 border-purple-300/30">
            <div className="flex-1">
              <p className="text-purple-100 whitespace-pre-wrap">{content}</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <time className="text-purple-200 font-medium bg-purple-950/50 px-4 py-2 rounded-full border border-purple-300/30">
                {formatDate(createdAt)}
              </time>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
                className="flex items-center gap-2 text-purple-200 hover:text-purple-100 transition-colors bg-purple-500/20 hover:bg-purple-500/30 px-4 py-2 rounded-full border border-purple-300/30"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}