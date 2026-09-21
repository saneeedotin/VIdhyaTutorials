import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Image as ImageIcon, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Inquiries', path: '/admin/inquiries', icon: Users },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-surface-container flex text-on-surface font-body-md">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-outline-variant/30 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/vidhya-tutorials-logo.png" 
              alt="Logo" 
              className="w-8 h-8 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }}
            />
            <span className="font-bold text-lg text-primary tracking-tight">Admin Portal</span>
          </Link>
          <button className="lg:hidden text-on-surface-variant" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all
                ${isActive 
                  ? 'bg-primary text-on-primary shadow-md shadow-primary/20' 
                  : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                }
              `}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-outline-variant/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-error hover:bg-error-container hover:text-on-error-container transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold hidden sm:block">Welcome, {user?.name || 'Administrator'}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-on-surface leading-tight">{user?.name || 'Admin'}</p>
              <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">{user?.role || 'ADMIN'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
              {(user?.name || 'A')[0]}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
}
