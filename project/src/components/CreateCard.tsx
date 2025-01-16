import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

interface CreateCardProps {
  onCardCreated: (card: { content: string; share_id: string }) => void;
}

export function CreateCard({ onCardCreated }: CreateCardProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const newCard = {
        content: content.trim(),
        share_id: nanoid(10)
      };

      onCardCreated(newCard);
      setContent('');
    } catch (error) {
      toast.error('Failed to create card');
      console.error('Error creating card:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="backdrop-blur-xl bg-gradient-to-br from-purple-400/20 to-fuchsia-400/20 rounded-xl shadow-lg shadow-purple-900/20 p-6 border-2 border-purple-300/30">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here..."
          className="w-full h-32 p-4 bg-gradient-to-br from-purple-950/60 to-fuchsia-950/60 backdrop-blur-sm border-2 border-purple-300/30 rounded-lg resize-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all text-white placeholder-purple-300/50"
          disabled={isSubmitting}
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-lg hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg shadow-purple-900/20 border-2 border-purple-300/30"
          >
            <Send className="w-4 h-4" />
            Create Card
          </button>
        </div>
      </div>
    </form>
  );
}