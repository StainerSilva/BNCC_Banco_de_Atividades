import React, { useState } from 'react';
import { USERS } from '../../constants';
import { useAuth } from '../../App';
import { User } from '../../types';

const Chat: React.FC = () => {
    const { user } = useAuth();
    const [selectedContact, setSelectedContact] = useState<User | null>(null);

    const contacts = USERS.filter(u => u.id !== user?.id);

    return (
        <div className="flex h-full">
            {/* Contact List */}
            <div className="w-1/3 max-w-xs bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
                <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Contatos</h2>
                    <input type="text" placeholder="Buscar contato..." className="w-full mt-2 p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <ul className="flex-1 overflow-y-auto">
                    {contacts.map(contact => (
                        <li key={contact.id}>
                            <button 
                                onClick={() => setSelectedContact(contact)}
                                className={`w-full text-left flex items-center p-3 space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedContact?.id === contact.id ? 'bg-blue-50 dark:bg-blue-900/50' : ''}`}
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">{contact.name.charAt(0)}</div>
                                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{contact.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{contact.role}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
                {selectedContact ? (
                    <>
                        <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center space-x-3">
                             <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">{selectedContact.name.charAt(0)}</div>
                             <div>
                                <h3 className="font-semibold text-gray-800 dark:text-white">{selectedContact.name}</h3>
                                <p className="text-sm text-green-500">Online</p>
                            </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-100 dark:bg-gray-900">
                            {/* Sample Messages */}
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 max-w-lg">
                                    <p className="text-sm text-gray-800 dark:text-gray-200">Olá! Vi que a atividade "Ciclo da Água" foi enviada para revisão. Precisa de ajuda?</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-lg">
                                    <p className="text-sm">Olá, {selectedContact.name}! Sim, agradeço. Poderia dar uma olhada na descrição das etapas?</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <input type="text" placeholder="Digite sua mensagem..." className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" />
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Enviar</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <p>Selecione um contato para iniciar a conversa.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
