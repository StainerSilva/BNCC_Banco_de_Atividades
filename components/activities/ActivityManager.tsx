import React, { useState, useMemo, useEffect } from 'react';
import { Activity, ActivityStatus, Role, User, StudentSubmission, EducationLevel, Grade } from '../../types';
import { INITIAL_ACTIVITIES, INITIAL_SUBMISSIONS, USERS } from '../../constants';
import { useAuth } from '../../App';
import { PlusIcon, SparklesIcon, FilterIcon, XMarkIcon, GoogleMeetIcon, YouTubeIcon } from '../icons';
import { generateActivitySuggestion } from '../../services/geminiService';
import Spinner from '../common/Spinner';
import RichTextEditor from '../common/RichTextEditor';
import ConfirmationDialog from '../common/ConfirmationDialog';

const ActivityCard: React.FC<{ activity: Activity; onSelect: (activity: Activity) => void; }> = ({ activity, onSelect }) => {
    const statusColorMap: Record<ActivityStatus, string> = {
        [ActivityStatus.APPROVED]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        [ActivityStatus.PENDING_APPROVAL]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        [ActivityStatus.REVISION_REQUESTED]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
        [ActivityStatus.DRAFT]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        [ActivityStatus.ARCHIVED]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };

    return (
        <div onClick={() => onSelect(activity)} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transform hover:-translate-y-1">
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">{activity.title}</h3>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColorMap[activity.status]}`}>
                        {activity.status}
                    </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{activity.grade} - {activity.subject}</p>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    <p><span className="font-semibold">BNCC:</span> {activity.bnccCode}</p>
                    <p><span className="font-semibold">Autor:</span> {activity.authorName}</p>
                </div>
            </div>
             <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-3 border-t dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                Atualizado em: {new Date(activity.updatedAt).toLocaleDateString()}
            </div>
        </div>
    );
};

const ActivityDetailView: React.FC<{
    activity: Activity;
    onClose: () => void;
    onUpdateActivity: (updatedActivity: Activity) => void;
    onEdit: (activity: Activity) => void;
}> = ({ activity, onClose, onUpdateActivity, onEdit }) => {
    const { user } = useAuth();
    const [comment, setComment] = useState('');
    const [confirmation, setConfirmation] = useState<{
        title: string;
        message: string;
        confirmText: string;
        onConfirm: () => void;
        variant: 'success' | 'danger' | 'warning';
    } | null>(null);

    const handleStatusChange = (newStatus: ActivityStatus) => {
        const updatedActivity = { ...activity, status: newStatus, updatedAt: new Date().toISOString() };
        onUpdateActivity(updatedActivity);
    };

    const requestApprove = () => setConfirmation({
        title: 'Confirmar Aprovação',
        message: `Tem certeza que deseja aprovar a atividade "${activity.title}"?`,
        confirmText: 'Aprovar',
        onConfirm: () => handleStatusChange(ActivityStatus.APPROVED),
        variant: 'success'
    });

    const requestRevision = () => setConfirmation({
        title: 'Solicitar Revisão',
        message: `Tem certeza que deseja solicitar revisão para a atividade "${activity.title}"? O professor será notificado.`,
        confirmText: 'Solicitar Revisão',
        onConfirm: () => handleStatusChange(ActivityStatus.REVISION_REQUESTED),
        variant: 'warning'
    });
    
    const requestArchive = () => setConfirmation({
        title: 'Confirmar Arquivamento',
        message: `Tem certeza que deseja arquivar a atividade "${activity.title}"? Esta ação pode restringir o acesso a ela.`,
        confirmText: 'Arquivar',
        onConfirm: () => handleStatusChange(ActivityStatus.ARCHIVED),
        variant: 'danger'
    });


    const handleAddComment = () => {
        if (!comment.trim() || !user) return;
        const newComment = {
            id: Date.now(),
            authorId: user.id,
            authorName: user.name,
            timestamp: new Date().toISOString(),
            content: comment,
        };
        const updatedActivity = { ...activity, comments: [...activity.comments, newComment] };
        onUpdateActivity(updatedActivity);
        setComment('');
    };

    const canEdit = user?.role === Role.COORDENADOR || (user?.role === Role.PROFESSOR && user.id === activity.authorId);
    const canApprove = user?.role === Role.COORDENADOR || user?.role === Role.ADMIN;
    
    const submissions = useSubmissionsForActivity(activity.id, user);

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="p-6 border-b dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{activity.title}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <XMarkIcon className="w-7 h-7" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.grade} - {activity.educationLevel}</p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-6">
                            {(activity.googleMeetUrl || activity.youtubeLiveUrl) && (
                                <div>
                                    <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Links da Aula</h4>
                                    <div className="flex flex-wrap gap-4">
                                        {activity.googleMeetUrl && (
                                            <a href={activity.googleMeetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900">
                                                <GoogleMeetIcon className="w-5 h-5" />
                                                <span className="font-medium">Sala no Google Meet</span>
                                            </a>
                                        )}
                                        {activity.youtubeLiveUrl && (
                                            <a href={activity.youtubeLiveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900">
                                                <YouTubeIcon className="w-5 h-5" />
                                                <span className="font-medium">Aula no YouTube</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Conteúdo da Atividade</h4>
                                <div 
                                    className="prose prose-sm dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md border dark:border-gray-700"
                                    dangerouslySetInnerHTML={{ __html: activity.versions[activity.versions.length - 1].content }}
                                />
                            </div>

                            {user?.role === Role.ALUNO && (
                                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                                    <h4 className="font-semibold text-lg mb-2 text-blue-800 dark:text-blue-300">Entregar Atividade</h4>
                                    <textarea className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" rows={4} placeholder="Digite sua resposta aqui..."></textarea>
                                    <div className="flex items-center justify-between mt-2">
                                         <button className="text-sm px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Anexar foto</button>
                                         <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Enviar Resposta</button>
                                    </div>
                                </div>
                            )}

                            {(user?.role === Role.RESPONSAVEL || user?.role === Role.ALUNO) && submissions.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Minhas Entregas</h4>
                                    {submissions.map(sub => (
                                        <div key={sub.submittedAt} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border dark:border-gray-600">
                                            <p className="text-sm whitespace-pre-wrap">{sub.content}</p>
                                            <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span>Entregue em: {new Date(sub.submittedAt).toLocaleString()}</span>
                                                {sub.grade && <span className="font-bold text-green-600 dark:text-green-400">Nota: {sub.grade}/10</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            

                            {canApprove && (
                                <div className="border-t dark:border-gray-700 pt-4">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Ações do Coordenador</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={requestApprove} className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">Aprovar</button>
                                        <button onClick={requestRevision} className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600">Pedir Revisão</button>
                                        {canEdit && <button onClick={() => onEdit(activity)} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Editar</button>}
                                        <button onClick={requestArchive} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">Arquivar</button>
                                    </div>
                                </div>
                            )}

                             <div>
                                <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Comentários</h4>
                                <div className="space-y-4">
                                    {activity.comments.map(c => (
                                        <div key={c.id} className="flex items-start space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-bold text-sm text-gray-600 dark:text-gray-300">{c.authorName.charAt(0)}</div>
                                            <div className="flex-1">
                                                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                                                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{c.authorName}</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{c.content}</p>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(c.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {activity.comments.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum comentário ainda.</p>}
                                </div>
                                {user?.role === Role.COORDENADOR && (
                                    <div className="mt-4 flex space-x-2">
                                        <input value={comment} onChange={e => setComment(e.target.value)} type="text" placeholder="Adicionar comentário..." className="flex-1 p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600" />
                                        <button onClick={handleAddComment} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Enviar</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-1 space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Detalhes</h4>
                                <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                                    <li><strong>Status:</strong> {activity.status}</li>
                                    <li><strong>BNCC:</strong> {activity.bnccCode}</li>
                                    <li><strong>BNCC Estado:</strong> {activity.stateBnccCode}</li>
                                    <li><strong>Autor:</strong> {activity.authorName}</li>
                                    <li><strong>Criado em:</strong> {new Date(activity.createdAt).toLocaleDateString()}</li>
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Histórico de Versões</h4>
                                <ul className="text-sm space-y-3">
                                    {activity.versions.slice().reverse().map(v => (
                                        <li key={v.version} className="border-l-2 pl-3 border-blue-500">
                                            <p className="font-semibold">Versão {v.version} por {v.editorName}</p>
                                            <p className="text-gray-500 dark:text-gray-400 italic">"{v.changeReason}"</p>
                                            <p className="text-xs text-gray-400">{new Date(v.timestamp).toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {confirmation && (
                <ConfirmationDialog
                    isOpen={!!confirmation}
                    onClose={() => setConfirmation(null)}
                    {...confirmation}
                />
            )}
        </>
    );
};


const ActivityEditor: React.FC<{
    activityToEdit?: Activity | null;
    onClose: () => void;
    onSave: (activity: Activity) => void;
}> = ({ activityToEdit, onClose, onSave }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [educationLevel, setEducationLevel] = useState<EducationLevel>(EducationLevel.ENSINO_FUNDAMENTAL_1);
    const [grade, setGrade] = useState(Grade[EducationLevel.ENSINO_FUNDAMENTAL_1][0]);
    const [subject, setSubject] = useState('Português');
    const [bnccCode, setBnccCode] = useState('');
    const [stateBnccCode, setStateBnccCode] = useState('');
    const [content, setContent] = useState('');
    const [changeReason, setChangeReason] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [googleMeetUrl, setGoogleMeetUrl] = useState('');
    const [youtubeLiveUrl, setYoutubeLiveUrl] = useState('');


    useEffect(() => {
        if (activityToEdit) {
            setTitle(activityToEdit.title);
            setEducationLevel(activityToEdit.educationLevel);
            setGrade(activityToEdit.grade);
            setSubject(activityToEdit.subject);
            setBnccCode(activityToEdit.bnccCode);
            setStateBnccCode(activityToEdit.stateBnccCode);
            setContent(activityToEdit.versions[activityToEdit.versions.length - 1].content);
            setGoogleMeetUrl(activityToEdit.googleMeetUrl || '');
            setYoutubeLiveUrl(activityToEdit.youtubeLiveUrl || '');
        } else {
            setChangeReason('Criação inicial.');
        }
    }, [activityToEdit]);
    
    useEffect(() => {
        // Reset grade when education level changes
        setGrade(Grade[educationLevel][0]);
    }, [educationLevel]);

    const handleGenerateContent = async () => {
        setIsGenerating(true);
        const suggestion = await generateActivitySuggestion(grade, subject, bnccCode, title);
        setContent(suggestion);
        setIsGenerating(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !changeReason) {
            alert('Por favor, preencha o motivo da alteração.');
            return;
        }

        const newVersion = {
            version: (activityToEdit?.versions.length || 0) + 1,
            editorId: user.id,
            editorName: user.name,
            timestamp: new Date().toISOString(),
            changeReason: changeReason,
            content: content,
            file: attachedFile ? { name: attachedFile.name, url: '#' } : activityToEdit?.versions[activityToEdit.versions.length - 1].file
        };

        if (activityToEdit) {
            const updatedActivity: Activity = {
                ...activityToEdit,
                title, educationLevel, grade, subject, bnccCode, stateBnccCode,
                googleMeetUrl, youtubeLiveUrl,
                updatedAt: new Date().toISOString(),
                versions: [...activityToEdit.versions, newVersion],
                status: user.role === Role.COORDENADOR ? activityToEdit.status : ActivityStatus.PENDING_APPROVAL
            };
            onSave(updatedActivity);
        } else {
            const newActivity: Activity = {
                id: Date.now(),
                title, educationLevel, grade, subject, bnccCode, stateBnccCode,
                googleMeetUrl, youtubeLiveUrl,
                authorId: user.id,
                authorName: user.name,
                status: user.role === Role.COORDENADOR ? ActivityStatus.APPROVED : ActivityStatus.PENDING_APPROVAL,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                versions: [newVersion],
                comments: [],
            };
            onSave(newActivity);
        }
    };
    
    return (
         <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50 animate-fade-in">
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activityToEdit ? 'Editar Atividade' : 'Nova Atividade'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-400"><XMarkIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Título da Atividade" value={title} onChange={(e) => setTitle(e.target.value)} required className="md:col-span-2 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                        
                        <select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value as EducationLevel)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                            {Object.values(EducationLevel).map((level) => <option key={level} value={level}>{level}</option>)}
                        </select>
                        <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                            {Grade[educationLevel].map((g) => <option key={g} value={g}>{g}</option>)}
                        </select>

                         <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                            <option>Português</option><option>Matemática</option><option>Ciências</option><option>História</option><option>Geografia</option><option>Artes</option><option>Educação Física</option>
                        </select>
                        
                        <input type="text" placeholder="Disciplina (p/ Técnico/Superior)" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" disabled={![EducationLevel.TECNICO, EducationLevel.SUPERIOR_GRADUACAO, EducationLevel.SUPERIOR_POS_GRADUACAO].includes(educationLevel)}/>

                        <input type="text" placeholder="Código BNCC (Ex: EF15LP03)" value={bnccCode} onChange={(e) => setBnccCode(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                        <input type="text" placeholder="Código BNCC Adaptado (Ex: EF15LP03-SP)" value={stateBnccCode} onChange={(e) => setStateBnccCode(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Conteúdo</label>
                            <button type="button" onClick={handleGenerateContent} disabled={!title || isGenerating} className="flex items-center text-sm px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed">
                                <SparklesIcon className="w-4 h-4 mr-2" />
                                {isGenerating ? 'Gerando...' : 'Gerar com IA'}
                            </button>
                        </div>
                        {isGenerating && <div className="py-4"><Spinner /></div>}
                        <RichTextEditor value={content} onChange={setContent} />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Anexar Arquivo (Opcional)</label>
                        <input type="file" onChange={(e) => setAttachedFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/50 dark:file:text-blue-300 dark:hover:file:bg-blue-900"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Link Google Meet (Opcional)</label>
                            <input type="url" placeholder="https://meet.google.com/..." value={googleMeetUrl} onChange={(e) => setGoogleMeetUrl(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Link YouTube ao Vivo (Opcional)</label>
                            <input type="url" placeholder="https://youtube.com/watch?v=..." value={youtubeLiveUrl} onChange={(e) => setYoutubeLiveUrl(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                    </div>
                    <div>
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Motivo da alteração (obrigatório)</label>
                        <input type="text" placeholder="Ex: Criação inicial, correção ortográfica..." value={changeReason} onChange={(e) => setChangeReason(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                 </form>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
                    <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar</button>
                </div>
            </div>
        </div>
    );
};


const FilterBar: React.FC<{
    filters: any;
    setFilters: (filters: any) => void;
    activities: Activity[];
}> = ({ filters, setFilters, activities }) => {
    
    const grades = useMemo(() => [...new Set(activities.map(a => a.grade))].sort(), [activities]);
    const subjects = useMemo(() => [...new Set(activities.map(a => a.subject))].sort(), [activities]);
    const statuses = useMemo(() => Object.values(ActivityStatus), []);
    const educationLevels = useMemo(() => Object.values(EducationLevel), []);

    const handleFilterChange = (key: string, value: string) => {
        setFilters({ ...filters, [key]: value });
    };

    const resetFilters = () => {
        setFilters({ query: '', grade: 'all', subject: 'all', status: 'all', educationLevel: 'all' });
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 border dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <input
                    type="text"
                    placeholder="Buscar por título ou BNCC..."
                    value={filters.query}
                    onChange={(e) => handleFilterChange('query', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                <select value={filters.educationLevel} onChange={(e) => handleFilterChange('educationLevel', e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option value="all">Todos os Níveis</option>
                    {educationLevels.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
                <select value={filters.grade} onChange={(e) => handleFilterChange('grade', e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option value="all">Todas as Séries</option>
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <select value={filters.subject} onChange={(e) => handleFilterChange('subject', e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option value="all">Todas as Matérias</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option value="all">Todos os Status</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="flex justify-end mt-4">
                <button onClick={resetFilters} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">Limpar filtros</button>
            </div>
        </div>
    )
}

const useFilteredActivities = (activities: Activity[], activeView: string, user: User, filters: any) => {
    return useMemo(() => {
        if (!user) return [];
        
        let baseActivities: Activity[];
        switch (activeView) {
            case 'my-activities':
                baseActivities = activities.filter(a => a.authorId === user.id);
                break;
            case 'approval-queue':
                baseActivities = activities.filter(a => a.status === ActivityStatus.PENDING_APPROVAL);
                break;
            case 'all-activities':
                 baseActivities = activities;
                 break;
             case 'dashboard':
                 if (user.role === Role.ALUNO) {
                     return activities.filter(a => a.status === ActivityStatus.APPROVED);
                 }
                  if (user.role === Role.RESPONSAVEL) {
                    const child = USERS.find(u => user.childrenIds?.includes(u.id));
                    if (!child) return [];
                     return activities.filter(a => a.status === ActivityStatus.APPROVED);
                 }
                 baseActivities = activities;
                 break;
            default:
                 baseActivities = activities;
        }

        // Apply filters
        const { query, grade, subject, status, educationLevel } = filters;
        return baseActivities.filter(a => {
            const queryMatch = query.toLowerCase() === '' ||
                a.title.toLowerCase().includes(query.toLowerCase()) ||
                a.bnccCode.toLowerCase().includes(query.toLowerCase());

            const gradeMatch = grade === 'all' || a.grade === grade;
            const subjectMatch = subject === 'all' || a.subject === subject;
            const statusMatch = status === 'all' || a.status === status;
            const educationLevelMatch = educationLevel === 'all' || a.educationLevel === educationLevel;

            return queryMatch && gradeMatch && subjectMatch && statusMatch && educationLevelMatch;
        });

    }, [activities, activeView, user, filters]);
};

const useSubmissionsForActivity = (activityId: number, user: User | null) => {
    return useMemo(() => {
        if (!user) return [];
        const studentIds: number[] = [];
        if (user.role === Role.ALUNO) {
            studentIds.push(user.id);
        } else if (user.role === Role.RESPONSAVEL && user.childrenIds) {
            studentIds.push(...user.childrenIds);
        }
        
        return INITIAL_SUBMISSIONS.filter(
            sub => sub.activityId === activityId && studentIds.includes(sub.studentId)
        );
    }, [activityId, user]);
}

const ActivityManager: React.FC<{ activeView: string }> = ({ activeView }) => {
    const { user } = useAuth();
    const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
    const [filters, setFilters] = useState({ query: '', grade: 'all', subject: 'all', status: 'all', educationLevel: 'all' });


    const filteredActivities = useFilteredActivities(activities, activeView, user!, filters);
    
    const handleSaveActivity = (activity: Activity) => {
        const index = activities.findIndex(a => a.id === activity.id);
        if (index > -1) {
            const newActivities = [...activities];
            newActivities[index] = activity;
            setActivities(newActivities);
        } else {
            setActivities([activity, ...activities]);
        }
        setIsEditing(false);
        setActivityToEdit(null);
        setSelectedActivity(activity);
    };

    const handleUpdateActivity = (updatedActivity: Activity) => {
        handleSaveActivity(updatedActivity);
        setSelectedActivity(updatedActivity);
    };

    const handleEdit = (activity: Activity) => {
        setActivityToEdit(activity);
        setIsEditing(true);
        setSelectedActivity(null);
    };

    const handleCreateNew = () => {
        setActivityToEdit(null);
        setIsEditing(true);
        setSelectedActivity(null);
    };

    const handleSelectActivity = (activity: Activity) => {
        setSelectedActivity(activity);
    };

    const canCreate = user?.role === Role.PROFESSOR || user?.role === Role.COORDENADOR || user?.role === Role.ADMIN;
    
    if (selectedActivity) {
        return <ActivityDetailView activity={selectedActivity} onClose={() => setSelectedActivity(null)} onUpdateActivity={handleUpdateActivity} onEdit={handleEdit} />;
    }
    
    if (isEditing) {
        return <ActivityEditor activityToEdit={activityToEdit} onClose={() => setIsEditing(false)} onSave={handleSaveActivity} />;
    }

    const showFilters = ['dashboard', 'my-activities', 'all-activities', 'approval-queue'].includes(activeView);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 {/* This title is now in the header */}
                <div />
                {canCreate && activeView !== 'approval-queue' && (
                    <button onClick={handleCreateNew} className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-md">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Nova Atividade
                    </button>
                )}
            </div>
            
            {showFilters && <FilterBar filters={filters} setFilters={setFilters} activities={activities}/>}

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredActivities.length > 0 ? (
                    filteredActivities.map(activity => (
                        <ActivityCard key={activity.id} activity={activity} onSelect={handleSelectActivity} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">Nenhuma atividade encontrada para os filtros selecionados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityManager;