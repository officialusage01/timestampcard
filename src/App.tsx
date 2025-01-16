import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Card } from './components/Card';
import { CreateCard } from './components/CreateCard';
import { Auth } from './components/Auth';
import { ScrollText, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { Database } from './lib/supabase-types';

type CardData = Database['public']['Tables']['cards']['Row'];

export default function App() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [session, setSession] = useState(supabase.auth.getSession());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      loadCards();
    }
  }, [session]);

  const loadCards = async () => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error: any) {
      toast.error('Error loading cards');
      console.error('Error:', error.message);
    }
  };

  const handleAddCard = async (newCard: { content: string; share_id: string }) => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('cards')
        .insert([{ 
          content: newCard.content,
          share_id: newCard.share_id,
          user_id: session.user.id
        }])
        .select()
        .single();

      if (error) throw error;
      setCards(prevCards => [data, ...prevCards]);
      toast.success('Card created successfully!');
    } catch (error: any) {
      toast.error('Error creating card');
      console.error('Error:', error.message);
    }
  };

  const handleShare = (shareId: string) => {
    const url = `${window.location.origin}/card/${shareId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCards([]);
    toast.success('Signed out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-800 to-fuchsia-900 flex items-center justify-center">
        <div className="text-purple-200 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-800 to-fuchsia-900">
      <Toaster position="top-center" />
      
      <main className="container mx-auto px-4 py-8">
        {session ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="backdrop-blur-xl bg-white/10 px-8 py-4 rounded-full border-2 border-purple-300/30 shadow-lg shadow-purple-900/30">
                <div className="flex items-center gap-3">
                  <ScrollText className="w-8 h-8 text-purple-200" />
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 text-transparent bg-clip-text">
                    Timestamped Cards
                  </h1>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-6 py-3 bg-purple-950/40 text-purple-200 rounded-full hover:bg-purple-900/40 transition-colors border-2 border-purple-300/30 backdrop-blur-xl"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>

            <CreateCard onCardCreated={handleAddCard} />

            <div className="mt-8 grid gap-6 grid-cols-1">
              {cards.map((card) => (
                <Card
                  key={card.id}
                  content={card.content}
                  createdAt={card.created_at}
                  shareId={card.share_id}
                  onShare={() => handleShare(card.share_id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="pt-12">
            <Auth onAuthSuccess={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
}