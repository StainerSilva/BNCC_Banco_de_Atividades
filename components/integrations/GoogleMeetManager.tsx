import React, { useState, useEffect } from 'react';
import { initGapiClient, initGisClient, createMeetSpace } from '../../services/googleApiService';
import Spinner from '../common/Spinner';
import { GoogleMeetIcon } from '../icons';

const GoogleMeetManager: React.FC = () => {
    const [meetLink, setMeetLink] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isApiReady, setIsApiReady] = useState(false);

    useEffect(() => {
        const initializeApis = async () => {
            try {
                await initGapiClient();
                await initGisClient();
                setIsApiReady(true);
            } catch (err) {
                setError('Falha ao carregar a API do Google. Verifique sua conexão e a configuração de API Key/Client ID.');
                console.error(err);
            }
        };
        initializeApis();
    }, []);

    const handleCreateMeeting = async () => {
        setIsLoading(true);
        setError(null);
        setMeetLink(null);
        try {
            const link = await createMeetSpace();
            if (link) {
                setMeetLink(link);
            } else {
                setError('Não foi possível criar a sala. Verifique as permissões da sua conta Google.');
            }
        } catch (err: any) {
            if (err.type === 'popup_closed') {
                 setError('A janela de autenticação foi fechada antes da conclusão. Por favor, tente novamente.');
            } else {
                 setError('Ocorreu um erro ao criar a sala. Tente novamente mais tarde.');
            }
            console.error(err);
        }
        setIsLoading(false);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                    <GoogleMeetIcon className="w-8 h-8 mr-3"/>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Criar Sala no Google Meet</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Gere um link de videoconferência instantaneamente para suas aulas ou reuniões. Você precisará autorizar o acesso à sua conta Google.
                </p>

                {!isApiReady && !error && (
                    <div className="flex items-center text-gray-500">
                        <Spinner />
                        <span className="ml-2">Inicializando APIs do Google...</span>
                    </div>
                )}
                
                {isApiReady && (
                    <button 
                        onClick={handleCreateMeeting} 
                        disabled={isLoading}
                        className="w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
                    >
                        {isLoading ? <Spinner /> : 'Gerar Novo Link do Meet'}
                    </button>
                )}

                {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
                
                {meetLink && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500">
                        <h3 className="font-semibold text-green-800 dark:text-green-300">Link da Sala Criado com Sucesso!</h3>
                        <div className="flex items-center mt-2">
                            <input 
                                type="text" 
                                value={meetLink} 
                                readOnly 
                                className="flex-grow p-2 border rounded-l-md bg-white dark:bg-gray-700 dark:border-gray-600"
                            />
                            <button 
                                onClick={() => navigator.clipboard.writeText(meetLink)}
                                className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700"
                            >
                                Copiar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoogleMeetManager;
