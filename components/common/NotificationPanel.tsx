import React from 'react';
import { Notification, NotificationType } from '../../types';
import { CheckBadgeIcon, UserGroupIcon, BookOpenIcon } from '../icons';

interface NotificationPanelProps {
    notifications: Notification[];
    onNotificationClick: (id: number) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onNotificationClick }) => {
    
    const IconMap: Record<NotificationType, React.FC<{className?: string}>> = {
        [NotificationType.APPROVAL]: CheckBadgeIcon,
        [NotificationType.REVISION]: CheckBadgeIcon,
        [NotificationType.COMMENT]: UserGroupIcon,
        [NotificationType.ASSIGNMENT]: BookOpenIcon,
    };

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border dark:border-gray-700 z-50">
            <div className="p-4 border-b dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white">Notificações</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(n => {
                        const Icon = IconMap[n.type];
                        return (
                            <button 
                                key={n.id} 
                                onClick={() => onNotificationClick(n.id)}
                                className={`w-full text-left flex items-start p-4 space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!n.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            >
                                <div className="flex-shrink-0 mt-1">
                                    <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{n.message}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                                </div>
                                {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" title="Não lido"></div>}
                            </button>
                        )
                    })
                ) : (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">Nenhuma notificação.</p>
                )}
            </div>
             <div className="p-2 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 text-center">
                <a href="#" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">Ver todas</a>
            </div>
        </div>
    );
};

export default NotificationPanel;