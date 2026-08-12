import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationItem } from '../../types';
import { notificationService } from '../../services/notificationService';
import {
  Bell,
  LogOut,
  CheckCheck,
  Menu,
  X,
  Briefcase,
  FileCheck,
  Bookmark,
  User,
  FolderOpen,
  PlusCircle,
  ShieldCheck,
  Users,
  Layers,
  PieChart,
  BarChart3,
  Building2,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = Boolean(user);
  const role = user?.role;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [bellOpen, setBellOpen] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // Ignore silent polling errors
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, link?: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      if (link) {
        setBellOpen(false);
        navigate(link);
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-700 font-semibold'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <header className="glass-header sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left Brand Logo & Mobile Trigger */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              EP
            </div>
            <div className="leading-tight">
              <span className="font-semibold text-slate-900 text-sm sm:text-base block">
                Job Opportunity Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Notification Bell Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setBellOpen(!bellOpen)}
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {bellOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200/80 p-4 space-y-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">Notifications</h4>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-[11px] font-medium text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n._id}
                            onClick={() => handleMarkAsRead(n._id, n.link)}
                            className={`p-2.5 rounded-lg cursor-pointer transition-colors space-y-1 ${
                              n.isRead ? 'bg-white hover:bg-slate-50' : 'bg-indigo-50/40 hover:bg-indigo-50/70'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-xs text-slate-900">{n.title}</span>
                              {!n.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-center">
                      <Link
                        to="/notifications"
                        onClick={() => setBellOpen(false)}
                        className="text-xs font-semibold text-indigo-600 hover:underline inline-block py-0.5"
                      >
                        View All Notifications →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Identity & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200/80">
                <div className="hidden sm:block text-right">
                  <span className="font-semibold text-slate-900 text-xs block leading-tight">
                    {user?.name}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 uppercase">
                    {user?.role}
                  </span>
                </div>

                <Button variant="ghost" size="sm" onClick={logout} title="Logout">
                  <LogOut className="w-4 h-4 text-slate-600" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Overlay & Menu */}
      {mobileDrawerOpen && isAuthenticated && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full p-5 flex flex-col justify-between shadow-xl z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    EP
                  </div>
                  <span className="font-semibold text-sm text-slate-900">Portal Navigation</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs font-medium text-slate-600">
                <span>{user?.name}</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 font-semibold text-[10px] uppercase">
                  {role}
                </span>
              </div>

              <nav className="space-y-1" onClick={() => setMobileDrawerOpen(false)}>
                <NavLink to="/dashboard" className={linkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </NavLink>

                {role === 'STUDENT' && (
                  <>
                    <NavLink to="/jobs" className={linkClass}>
                      <Briefcase className="w-4 h-4" />
                      <span>Explore Jobs</span>
                    </NavLink>
                    <NavLink to="/applications" className={linkClass}>
                      <FileCheck className="w-4 h-4" />
                      <span>My Applications</span>
                    </NavLink>
                    <NavLink to="/saved-jobs" className={linkClass}>
                      <Bookmark className="w-4 h-4" />
                      <span>Saved Jobs</span>
                    </NavLink>
                    <NavLink to="/profile" className={linkClass}>
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </NavLink>
                  </>
                )}

                {role === 'TRAINER' && (
                  <>
                    <NavLink to="/dashboard/trainer" className={linkClass}>
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Workplace</span>
                    </NavLink>
                    <NavLink to="/dashboard/trainer/requirements" className={linkClass}>
                      <FolderOpen className="w-4 h-4" />
                      <span>My Requirements</span>
                    </NavLink>
                    <NavLink to="/dashboard/trainer/requirements/create" className={linkClass}>
                      <PlusCircle className="w-4 h-4" />
                      <span>Post Requirement</span>
                    </NavLink>
                  </>
                )}

                {role === 'ADMIN' && (
                  <>
                    <NavLink to="/dashboard/admin" className={linkClass}>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Workplace</span>
                    </NavLink>
                    <NavLink to="/admin/users" className={linkClass}>
                      <Users className="w-4 h-4" />
                      <span>User Management</span>
                    </NavLink>
                    <NavLink to="/admin/categories" className={linkClass}>
                      <Layers className="w-4 h-4" />
                      <span>Categories</span>
                    </NavLink>
                  </>
                )}

                {(role === 'HR' || role === 'ADMIN') && (
                  <>
                    <NavLink to="/dashboard/hr" className={linkClass}>
                      <PieChart className="w-4 h-4" />
                      <span>HR Dashboard</span>
                    </NavLink>
                    <NavLink to="/analytics" className={linkClass}>
                      <BarChart3 className="w-4 h-4" />
                      <span>Analytics</span>
                    </NavLink>
                    <NavLink to="/hr/requirements" className={linkClass}>
                      <Briefcase className="w-4 h-4" />
                      <span>Requirements</span>
                    </NavLink>
                    <NavLink to="/companies" className={linkClass}>
                      <Building2 className="w-4 h-4" />
                      <span>Companies</span>
                    </NavLink>
                  </>
                )}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button variant="outline" fullWidth size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                <span>Log Out</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
