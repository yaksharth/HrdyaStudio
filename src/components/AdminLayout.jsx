import React, { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Package, ExternalLink } from 'lucide-react';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('hrdya_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token');
      }
      
      // Decode payload
      const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadStr);
      
      if (payload.exp && Date.now() > payload.exp) {
        localStorage.removeItem('hrdya_admin_token');
        navigate('/admin/login');
      }
    } catch (err) {
      localStorage.removeItem('hrdya_admin_token');
      navigate('/admin/login');
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('hrdya_admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-void text-offwhite flex font-body">
      {/* Sidebar */}
      <aside className="w-64 bg-obsidian border-r border-trim hidden md:flex flex-col">
        {/* Brand */}
        <div className="p-6 border-b border-trim">
          <Link to="/" className="flex flex-col">
            <span className="font-heading text-2xl tracking-widest text-champagne font-bold uppercase">HRDYA</span>
            <span className="text-[10px] tracking-[0.3em] text-muted uppercase">Studio Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-2">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              location.pathname === '/admin'
                ? 'bg-trim text-champagne font-semibold border-l-2 border-champagne'
                : 'text-muted hover:bg-surface hover:text-offwhite'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-surface hover:text-offwhite transition-all duration-200"
          >
            <ExternalLink size={18} />
            <span className="flex items-center gap-1">
              View Store <ExternalLink size={12} className="opacity-60" />
            </span>
          </a>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-trim">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-coral hover:bg-surface/50 hover:text-red-400 transition-all duration-200 text-left font-medium"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen bg-void overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-obsidian border-b border-trim">
          <Link to="/" className="flex flex-col">
            <span className="font-heading text-xl tracking-widest text-champagne font-bold uppercase">HRDYA</span>
            <span className="text-[8px] tracking-[0.3em] text-muted uppercase">Studio Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="text-coral hover:text-red-400 p-2"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
