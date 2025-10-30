export enum Role {
  PROFESSOR = 'Professor',
  COORDENADOR = 'Coordenador',
  RESPONSAVEL = 'Responsável',
  ALUNO = 'Aluno',
  ADMIN = 'Admin',
}

export enum ActivityStatus {
  DRAFT = 'Rascunho',
  PENDING_APPROVAL = 'Pendente',
  APPROVED = 'Aprovado',
  REVISION_REQUESTED = 'Revisão Solicitada',
  ARCHIVED = 'Arquivado',
}

export enum EducationLevel {
  EDUCACAO_INFANTIL = 'Educação Infantil',
  ENSINO_FUNDAMENTAL_1 = 'Ensino Fundamental I',
  ENSINO_FUNDAMENTAL_2 = 'Ensino Fundamental II',
  ENSINO_MEDIO = 'Ensino Médio',
  TECNICO = 'Ensino Técnico',
  SUPERIOR_GRADUACAO = 'Ensino Superior - Graduação',
  SUPERIOR_POS_GRADUACAO = 'Ensino Superior - Pós-Graduação',
  EXTENSAO = 'Extensão',
}

export const Grade = {
  [EducationLevel.EDUCACAO_INFANTIL]: ['Creche', 'Pré-Escola (1º Período)', 'Pré-Escola (2º Período)'],
  [EducationLevel.ENSINO_FUNDAMENTAL_1]: ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano'],
  [EducationLevel.ENSINO_FUNDAMENTAL_2]: ['6º Ano', '7º Ano', '8º Ano', '9º Ano'],
  [EducationLevel.ENSINO_MEDIO]: ['1º Ano', '2º Ano', '3º Ano'],
  [EducationLevel.TECNICO]: ['Módulo I', 'Módulo II', 'Módulo III', 'Módulo IV'], // Example
  [EducationLevel.SUPERIOR_GRADUACAO]: ['1º Semestre', '2º Semestre', '3º Semestre', '4º Semestre', '5º Semestre', '6º Semestre', '7º Semestre', '8º Semestre'], // Example
  [EducationLevel.SUPERIOR_POS_GRADUACAO]: ['Especialização', 'Mestrado', 'Doutorado'],
  [EducationLevel.EXTENSAO]: ['Curso de Extensão'],
};


export interface User {
  id: number;
  name: string;
  role: Role;
  email: string;
  childrenIds?: number[]; // For parents
}

export interface ActivityVersion {
  version: number;
  editorId: number;
  editorName: string;
  timestamp: string;
  changeReason: string;
  content: string; // Can be markdown or HTML
  file?: { name: string; url: string };
}

export interface ActivityComment {
  id: number;
  authorId: number;
  authorName: string;
  timestamp: string;
  content: string;
}

export interface Activity {
  id: number;
  title: string;
  educationLevel: EducationLevel;
  grade: string; 
  subject: string;
  bnccCode: string;
  stateBnccCode: string;
  authorId: number;
  authorName: string;
  status: ActivityStatus;
  versions: ActivityVersion[];
  comments: ActivityComment[];
  createdAt: string;
  updatedAt: string;
  googleMeetUrl?: string;
  youtubeLiveUrl?: string;
}

export interface StudentSubmission {
  activityId: number;
  studentId: number;
  studentName: string;
  submissionType: 'text' | 'photo';
  content: string; // Text response or image URL
  submittedAt: string;
  grade?: number;
}


// New Notification types
export enum NotificationType {
  APPROVAL = 'Aprovação',
  COMMENT = 'Comentário',
  ASSIGNMENT = 'Atribuição',
  REVISION = 'Revisão',
}

export interface Notification {
  id: number;
  userId: number; // The user who receives the notification
  type: NotificationType;
  message: string;
  activityId?: number; // Link to the relevant activity
  timestamp: string;
  read: boolean;
}

// Google Classroom types
export interface GoogleClassroomCourse {
  id: string;
  name: string;
  section: string;
  alternateLink: string;
}

export interface GoogleClassroomCourseWork {
  id: string;
  title: string;
  alternateLink: string;
  dueDate?: {
    year: number;
    month: number;
    day: number;
  };
}