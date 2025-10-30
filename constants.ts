import { Role, ActivityStatus, User, Activity, StudentSubmission, Notification, NotificationType, EducationLevel } from './types';

export const USERS: User[] = [
  { id: 1, name: 'Prof. Carlos Silva', role: Role.PROFESSOR, email: 'carlos@escola.com' },
  { id: 2, name: 'Coord. Ana Marques', role: Role.COORDENADOR, email: 'ana@escola.com' },
  { id: 3, name: 'Sr. João Pereira', role: Role.RESPONSAVEL, email: 'joao@email.com', childrenIds: [5] },
  { id: 4, name: 'Sra. Maria Costa', role: Role.RESPONSAVEL, email: 'maria@email.com', childrenIds: [6] },
  { id: 5, name: 'Lucas Pereira', role: Role.ALUNO, email: 'lucas@aluno.com' },
  { id: 6, name: 'Sofia Costa', role: Role.ALUNO, email: 'sofia@aluno.com' },
  { id: 7, name: 'Admin Geral', role: Role.ADMIN, email: 'admin@escola.com' },
  { id: 8, name: 'Prof. Beatriz Lima', role: Role.PROFESSOR, email: 'beatriz@escola.com' },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 1,
    title: 'Interpretação de Texto: A Raposa e as Uvas',
    educationLevel: EducationLevel.ENSINO_FUNDAMENTAL_1,
    grade: '3º Ano',
    subject: 'Português',
    bnccCode: 'EF15LP03',
    stateBnccCode: 'EF15LP03-SP',
    authorId: 1,
    authorName: 'Prof. Carlos Silva',
    status: ActivityStatus.APPROVED,
    createdAt: '2023-10-25T10:00:00Z',
    updatedAt: '2023-10-26T11:00:00Z',
    versions: [
      {
        version: 1,
        editorId: 1,
        editorName: 'Prof. Carlos Silva',
        timestamp: '2023-10-25T10:00:00Z',
        changeReason: 'Criação inicial da atividade.',
        content: '<h1>A Raposa e as Uvas</h1><p>Leia a fábula e responda às seguintes perguntas sobre a <b>moral da história</b>.</p><ul><li>Qual o principal dilema da raposa?</li><li>O que a atitude final da raposa nos ensina?</li></ul>',
      },
    ],
    comments: [
      {
        id: 1,
        authorId: 2,
        authorName: 'Coord. Ana Marques',
        timestamp: '2023-10-25T14:00:00Z',
        content: 'Ótima atividade, Prof. Carlos! Aprovada.',
      },
    ],
    googleMeetUrl: 'https://meet.google.com/exemplo-abc-def',
    youtubeLiveUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 2,
    title: 'Operações Matemáticas Básicas',
    educationLevel: EducationLevel.ENSINO_FUNDAMENTAL_1,
    grade: '2º Ano',
    subject: 'Matemática',
    bnccCode: 'EF02MA06',
    stateBnccCode: 'EF02MA06-RJ',
    authorId: 8,
    authorName: 'Prof. Beatriz Lima',
    status: ActivityStatus.PENDING_APPROVAL,
    createdAt: '2023-10-27T09:00:00Z',
    updatedAt: '2023-10-27T09:00:00Z',
    versions: [
      {
        version: 1,
        editorId: 8,
        editorName: 'Prof. Beatriz Lima',
        timestamp: '2023-10-27T09:00:00Z',
        changeReason: 'Criação inicial.',
        content: 'Resolva as seguintes operações de <b>adição</b> e <b>subtração</b>. <br>1. 15 + 7 = ?<br>2. 20 - 9 = ?',
      },
    ],
    comments: [],
  },
  {
    id: 3,
    title: 'Ciclo da Água',
    educationLevel: EducationLevel.ENSINO_FUNDAMENTAL_1,
    grade: '4º Ano',
    subject: 'Ciências',
    bnccCode: 'EF04CI02',
    stateBnccCode: 'EF04CI02-MG',
    authorId: 1,
    authorName: 'Prof. Carlos Silva',
    status: ActivityStatus.REVISION_REQUESTED,
    createdAt: '2023-10-26T15:00:00Z',
    updatedAt: '2023-10-26T17:00:00Z',
    versions: [
      {
        version: 1,
        editorId: 1,
        editorName: 'Prof. Carlos Silva',
        timestamp: '2023-10-26T15:00:00Z',
        changeReason: 'Versão inicial com imagem.',
        content: 'Desenhe o ciclo da água e explique cada etapa.',
        file: { name: 'ciclo_agua_rascunho.png', url: '#' }
      },
    ],
    comments: [
        {
        id: 2,
        authorId: 2,
        authorName: 'Coord. Ana Marques',
        timestamp: '2023-10-26T17:00:00Z',
        content: 'Por favor, adicione uma descrição mais detalhada para cada etapa do ciclo. A imagem está boa.',
      },
    ],
  },
];

export const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    activityId: 1,
    studentId: 5,
    studentName: 'Lucas Pereira',
    submissionType: 'text',
    content: 'A moral é que às vezes desdenhamos daquilo que não conseguimos alcançar.',
    submittedAt: '2023-10-28T14:30:00Z',
    grade: 9,
  }
];


export const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    userId: 1, // Prof. Carlos Silva
    type: NotificationType.APPROVAL,
    message: 'Sua atividade "A Raposa e as Uvas" foi aprovada.',
    activityId: 1,
    timestamp: '2023-10-25T14:01:00Z',
    read: true,
  },
  {
    id: 2,
    userId: 1, // Prof. Carlos Silva
    type: NotificationType.REVISION,
    message: 'Sua atividade "Ciclo da Água" precisa de revisão.',
    activityId: 3,
    timestamp: '2023-10-26T17:00:00Z',
    read: false,
  },
  {
    id: 3,
    userId: 8, // Prof. Beatriz Lima
    type: NotificationType.COMMENT,
    message: 'Coord. Ana Marques comentou na sua atividade.',
    activityId: 2,
    timestamp: '2023-10-27T10:00:00Z',
    read: true,
  },
   {
    id: 4,
    userId: 2, // Coord. Ana Marques
    type: NotificationType.APPROVAL,
    message: 'Nova atividade "Operações Matemáticas" aguarda sua aprovação.',
    activityId: 2,
    timestamp: '2023-10-27T09:05:00Z',
    read: false,
  },
  {
    id: 5,
    userId: 5, // Aluno Lucas Pereira
    type: NotificationType.ASSIGNMENT,
    message: 'Nova atividade de Português foi atribuída a você.',
    activityId: 1,
    timestamp: '2023-10-27T11:00:00Z',
    read: false,
  },
  {
    id: 6,
    userId: 3, // Pai João Pereira
    type: NotificationType.ASSIGNMENT,
    message: 'Lucas tem uma nova atividade de Português.',
    activityId: 1,
    timestamp: '2023-10-27T11:01:00Z',
    read: true,
  }
];