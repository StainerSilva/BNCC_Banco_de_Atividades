import React, { useState } from 'react';
import { useAuth } from '../../App';
import { Role, User } from '../../types';

interface RegistrationScreenProps {
  onSwitchToLogin: () => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.PROFESSOR);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: Omit<User, 'id'> = { name, email, role };
    register(newUser);
    onSwitchToLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center brazil-gradient p-4">
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">Crie sua Conta</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">Junte-se à nossa comunidade</p>
        <form onSubmit={handleRegister}>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome Completo</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div className="mb-4">
                <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senha</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div className="mb-6">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Eu sou</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cadastrar
          </button>
        </form>
        <div className="mt-6 text-center">
            <button onClick={onSwitchToLogin} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Já tem uma conta? Faça o login
            </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationScreen;