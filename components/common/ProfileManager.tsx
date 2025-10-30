import React from 'react';
import { useAuth } from '../../App';
import { UserCircleIcon } from '../icons';

const ProfileManager: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Usuário não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start">
                    <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                        <div className="w-24 h-24 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-300">
                           <UserCircleIcon className="w-20 h-20" />
                        </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        <p className="text-md text-gray-500 dark:text-gray-400">{user.role}</p>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                    </div>
                </div>

                <div className="mt-6 border-t dark:border-gray-700 pt-6">
                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informações da Conta</h3>
                     <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Nome Completo</label>
                            <p className="mt-1 text-md text-gray-900 dark:text-white">{user.name}</p>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                            <p className="mt-1 text-md text-gray-900 dark:text-white">{user.email}</p>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Função</label>
                            <p className="mt-1 text-md text-gray-900 dark:text-white">{user.role}</p>
                        </div>
                     </div>
                </div>

                 <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Editar Perfil
                    </button>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default ProfileManager;
