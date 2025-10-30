import React, { useState, createContext, useContext, useMemo } from 'react';
import { User, Role, Notification } from './types';
import { USERS, NOTIFICATIONS } from './constants';
import { HomeIcon, BookOpenIcon, CheckBadgeIcon, UserGroupIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, UserCircleIcon } from './components/icons';
import { GoogleMeetIcon, YouTubeIcon } from './components/icons';
import ActivityManager from './components/activities/ActivityManager';
import Header from './components/common/Header';
import LoginScreen from './components/auth/LoginScreen';
import RegistrationScreen from './components/auth/RegistrationScreen';
import Chat from './components/chat/Chat';
import ProfileManager from './components/common/ProfileManager';
import GoogleMeetManager from './components/integrations/GoogleMeetManager';
import YouTubeLiveManager from './components/integrations/YouTubeLiveManager';


interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  register: (user: Omit<User, 'id'>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthFlow: React.FC = () => {
    const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

    if (authScreen === 'login') {
        return <LoginScreen onSwitchToRegister={() => setAuthScreen('register')} />;
    }
    return <RegistrationScreen onSwitchToLogin={() => setAuthScreen('login')} />;
}


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(USERS);

  const authContextValue = useMemo(() => ({
    user,
    login: (email: string) => {
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (foundUser) {
        setUser(foundUser);
      } else {
        alert("Usuário não encontrado!");
      }
    },
    logout: () => {
      setUser(null);
    },
    register: (newUser: Omit<User, 'id'>) => {
        const userExists = users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
        if(userExists) {
            alert("Este email já está cadastrado.");
            return;
        }
        const userWithId = { ...newUser, id: Date.now() };
        setUsers(prev => [...prev, userWithId]);
        alert("Cadastro realizado com sucesso! Faça o login.");
    }
  }), [user, users]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {!user ? <AuthFlow /> : <MainLayout />}
    </AuthContext.Provider>
  );
};

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  
  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const navItems = {
    [Role.PROFESSOR]: [
      { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
      { id: 'my-activities', label: 'Minhas Atividades', icon: BookOpenIcon },
    ],
    [Role.COORDENADOR]: [
      { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
      { id: 'all-activities', label: 'Todas Atividades', icon: BookOpenIcon },
      { id: 'approval-queue', label: 'Fila de Aprovação', icon: CheckBadgeIcon },
    ],
    [Role.ALUNO]: [
        { id: 'dashboard', label: 'Minhas Atividades', icon: BookOpenIcon },
    ],
    [Role.RESPONSAVEL]: [
        { id: 'dashboard', label: 'Desempenho do Aluno', icon: UserGroupIcon },
    ],
    [Role.ADMIN]: [
       { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
       { id: 'all-activities', label: 'Todas Atividades', icon: BookOpenIcon },
    ]
  };

  const commonNavItems = [
      { id: 'profile', label: 'Meu Perfil', icon: UserCircleIcon },
      { id: 'chat', label: 'Chat', icon: ChatBubbleLeftRightIcon },
      { id: 'meet', label: 'Criar Sala Meet', icon: GoogleMeetIcon },
      { id: 'youtube', label: 'Aula ao Vivo (YouTube)', icon: YouTubeIcon },
      { id: 'classroom', label: 'Google Sala de Aula', icon: BookOpenIcon },
  ];

  const currentNavItems = user ? [...navItems[user.role], ...commonNavItems] : [];
  const activeViewLabel = currentNavItems.find(item => item.id === activeView)?.label || 'Dashboard';
  const userNotifications = notifications.filter(n => n.userId === user?.id);
  
  const renderContent = () => {
    switch(activeView) {
        case 'chat': return <Chat />;
        case 'profile': return <ProfileManager />;
        case 'meet': return <GoogleMeetManager />;
        case 'youtube': return <YouTubeLiveManager />;
        case 'classroom':
            return (
                <div className="p-8 text-center text-gray-500">
                    <h2 className="text-2xl font-bold mb-4">Funcionalidade em Construção</h2>
                    <p>Esta área está sendo desenvolvida e estará disponível em breve!</p>
                </div>
            );
        default:
            return (
                <div className="p-4 sm:p-6 lg:p-8">
                    <ActivityManager activeView={activeView} />
                </div>
            )
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b dark:border-gray-700 px-4">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">BNCC Bank</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
            {currentNavItems.map(item => (
                <a
                  key={item.id}
                  href="#"
                  onClick={(e) => { e.preventDefault(); setActiveView(item.id); }}
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${activeView === item.id ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </a>
            ))}
        </nav>
        <div className="p-4 border-t dark:border-gray-700">
           <p className="text-xs text-center text-gray-400">&copy; {new Date().getFullYear()} BNCC Activity Bank</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          activeViewLabel={activeViewLabel} 
          notifications={userNotifications}
          onMarkAsRead={handleMarkAsRead}
        />
        <main className="flex-1 overflow-y-auto">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;