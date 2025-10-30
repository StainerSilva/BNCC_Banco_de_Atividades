import React, { useState } from 'react';
import { useAuth } from '../../App';
import { GoogleIcon, UserPlusIcon } from '../icons';

interface LoginScreenProps {
  onSwitchToRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center brazil-gradient p-4">
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">BNCC - Banco de atividades</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">Acesse sua conta para continuar</p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="seu.email@escola.com"
              required
            />
          </div>
           <div className="mb-6">
            <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition transform hover:scale-105">
            Entrar
          </button>
        </form>
         <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Ou continue com</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <GoogleIcon className="w-5 h-5 mr-2"/>
                Entrar com Google
              </button>
               <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <span className="font-bold mr-2">gov.br</span>
                Entrar com gov.br
              </button>
          </div>
          <div className="mt-6 text-center">
            <button onClick={onSwitchToRegister} className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center">
                <UserPlusIcon className="w-5 h-5 mr-1"/>
                Não tem uma conta? Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;