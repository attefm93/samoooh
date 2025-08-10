export interface Student {
  id: string;
  name: string;
  email: string;
  password: string;
  grade: string;
  code: string;
  scores: { score: number; maxScore: number; examName: string; date: Date }[];
  attendance: number;
  isBanned: boolean;
  canComment: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'parent' | 'admin';
}

export interface Question {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  question: string;
  answers: Answer[];
  createdAt: Date;
  isApproved: boolean;
}

export interface Answer {
  id: string;
  authorId: string;
  authorName: string;
  authorType: 'student' | 'teacher';
  content: string;
  createdAt: Date;
  isApproved: boolean;
}
export type Grade = 
  | 'اولى ابتدائي'
  | 'تانية ابتدائي'
  | 'تالتة ابتدائي'
  | 'رابعة ابتدائي'
  | 'خامسة ابتدائي'
  | 'سادسة ابتدائي'
  | 'اولى اعدادي'
  | 'تانية اعدادي'
  | 'تالتة اعدادي'
  | 'اولى ثانوي'
  | 'تانية ثانوي'
  | 'تالتة ثانوي';