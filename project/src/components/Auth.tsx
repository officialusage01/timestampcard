import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthProps {
  onAuthSuccess: () => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message === 'Invalid login credentials') {
            toast.error('Invalid email or password. Please try again.');
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success('Welcome back!');
      } else {
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success('Account created successfully! You can now sign in.');
        setIsLogin(true);
      }
      onAuthSuccess();
    } catch (error: any) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="backdrop-blur-xl bg-gradient-to-br from-purple-400/20 to-fuchsia-400/20 rounded-2xl shadow-xl shadow-purple-900/20 p-8 border-2 border-purple-300/30">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-purple-600/20 rounded-full border-2 border-purple-300/30">
            <Lock className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-200 to-pink-200 text-transparent bg-clip-text">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-purple-300/50" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 bg-purple-950/60 border-2 border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all text-purple-100 placeholder-purple-300/50"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-purple-300/50" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 bg-purple-950/60 border-2 border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all text-purple-100 placeholder-purple-300/50"
              required
              minLength={6}
            />
            {!isLogin && (
              <p className="mt-1 text-xs text-purple-200/70">Password must be at least 6 characters long</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-lg hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg shadow-purple-900/20 border-2 border-purple-300/30"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setEmail('');
            setPassword('');
          }}
          className="w-full mt-4 text-purple-200 hover:text-purple-100 transition-colors text-sm"
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
}