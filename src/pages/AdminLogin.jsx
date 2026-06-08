import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, ArrowRight, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem('hrdya_admin_token');
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          if (payload.exp && Date.now() < payload.exp) {
            navigate('/admin');
          }
        }
      } catch (e) {
        localStorage.removeItem('hrdya_admin_token');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('hrdya_admin_token', data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to the authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void text-offwhite flex items-center justify-center p-4 relative overflow-hidden font-body">
      {/* Decorative background glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-champagne/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-champagne/5 blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-obsidian/60 border border-trim/80 rounded-2xl p-8 backdrop-blur-xl relative z-10 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
        <div className="flex flex-col items-center mb-8">
          {/* Logo */}
          <div className="w-16 h-16 rounded-full bg-surface border border-trim flex items-center justify-center mb-4 text-champagne shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-4xl tracking-widest font-bold uppercase text-champagne">HRDYA</h1>
          <p className="text-xs tracking-[0.25em] text-muted uppercase mt-1">Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-coral/10 border border-coral/30 text-coral text-sm animate-shake">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.15em] text-muted block font-medium">
              Administrator Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface border border-trim rounded-xl py-3.5 pl-4 pr-12 text-offwhite placeholder:text-muted/40 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-offwhite transition-colors duration-150"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-champagne hover:bg-gold-light text-void font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-[0_4px_14px_rgba(200,164,90,0.2)] disabled:opacity-50 group cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Secure Log In'}</span>
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
}
