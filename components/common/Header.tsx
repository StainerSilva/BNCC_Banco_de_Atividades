import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../App';
import { BellIcon, ChevronDownIcon, ArrowRightOnRectangleIcon } from '../icons';
import NotificationPanel from './NotificationPanel';
import { Notification } from '../../types';

interface HeaderProps {
  activeViewLabel: string;
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
}

const Header: React.FC<HeaderProps> = ({ activeViewLabel, notifications, onMarkAsRead }) => {
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex-shrink-0">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {activeViewLabel}
        </h1>
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button onClick={() => setNotificationsOpen(o => !o)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200">
              <BellIcon className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-gray-800 transform -translate-y-1/2 translate-x-1/2">
                  <span className="sr-only">{unreadCount} new notifications</span>
                </span>
              )}
            </button>
            {notificationsOpen && <NotificationPanel notifications={notifications} onNotificationClick={onMarkAsRead} />}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setUserMenuOpen(o => !o)} className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300">
                {user?.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
              </div>
              <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border dark:border-gray-700 z-50">
                <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50">
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2"/>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;