import React, { useState, useEffect } from 'react';
import { initGapiClient, initGisClient, handleAuthClick, listCourses, listCourseWorks } from '../../services/googleApiService';
import Spinner from '../common/Spinner';
import { GoogleClassroomIcon } from '../icons';
import { GoogleClassroomCourse, GoogleClassroomCourseWork } from '../../types';

const GoogleClassroomManager: React.FC = () => {
    const [courses, setCourses] = useState<GoogleClassroomCourse[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [courseWork, setCourseWork] = useState<GoogleClassroomCourseWork[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isApiReady, setIsApiReady] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const initializeApis = async () => {
            try {
                await initGapiClient();
                await initGisClient();
                setIsApiReady(true);
            } catch (err: any) {
                setError(`Falha ao carregar a API do Google: ${err.message}`);
                console.error(err);
            }
        };
        initializeApis();
    }, []);
    
    useEffect(() => {
        if (selectedCourseId) {
            fetchCourseWork(selectedCourseId);
        }
    }, [selectedCourseId]);


    const handleAuthorize = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await handleAuthClick();
            setIsAuthorized(true);
            await fetchCourses();
        } catch (err: any) {
            handleApiError(err, 'autenticar');
        }
        setIsLoading(false);
    }
    
    const fetchCourses = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const courseList = await listCourses();
            setCourses(courseList);
        } catch (err: any) {
             handleApiError(err, 'buscar suas turmas');
        }
        setIsLoading(false);
    };
    
    const fetchCourseWork = async (courseId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const workList = await listCourseWorks(courseId);
            setCourseWork(workList);
        } catch (err: any) {
            handleApiError(err, 'buscar as atividades da turma');
        }
        setIsLoading(false);
    };

    const handleApiError = (err: any, action: string) => {
        if (err.type === 'popup_closed') {
             setError(`A janela de autenticação foi fechada antes de ${action}. Por favor, tente novamente.`);
        } else {
             setError(`Ocorreu um erro ao ${action}. Verifique sua conexão e permissões.`);
        }
        console.error(err);
    }

    const formatDate = (date: { year: number, month: number, day: number } | undefined) => {
        if (!date) return 'Sem data de entrega';
        return new Date(date.year, date.month - 1, date.day).toLocaleDateString();
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="p-6 border-b dark:border-gray-700">
                    <div className="flex items-center mb-4">
                        <GoogleClassroomIcon className="w-8 h-8 mr-3"/>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Google Sala de Aula</h2>
                    </div>
                     <p className="text-gray-600 dark:text-gray-300">
                        Conecte sua conta para visualizar suas turmas e atividades diretamente aqui.
                    </p>
                </div>

                <div className="p-6">
                    {!isApiReady && !error && (
                        <div className="flex items-center text-gray-500"><Spinner /><span className="ml-2">Inicializando APIs...</span></div>
                    )}
                    {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
                    
                    {isApiReady && !isAuthorized && !error && (
                        <button onClick={handleAuthorize} disabled={isLoading} className="w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                           {isLoading ? <Spinner/> : 'Conectar Conta do Google'}
                        </button>
                    )}

                    {isAuthorized && (
                        <div>
                             <div className="mb-4">
                                <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selecione uma Turma:</label>
                                <select 
                                    id="course-select"
                                    value={selectedCourseId}
                                    onChange={e => setSelectedCourseId(e.target.value)}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                >
                                    <option value="">-- Suas Turmas --</option>
                                    {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
                                </select>
                            </div>
                            
                            {isLoading && <Spinner/>}

                            {selectedCourseId && courseWork.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">Atividades da Turma</h3>
                                    {courseWork.map(cw => (
                                        <div key={cw.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md border dark:border-gray-600 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{cw.title}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Entrega: {formatDate(cw.dueDate)}</p>
                                            </div>
                                            <a href={cw.alternateLink} target="_blank" rel="noopener noreferrer" className="text-sm px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-md hover:bg-blue-200">
                                                Ver no Classroom
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                             {selectedCourseId && !isLoading && courseWork.length === 0 && (
                                <p className="text-center text-gray-500">Nenhuma atividade encontrada para esta turma.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoogleClassroomManager;
