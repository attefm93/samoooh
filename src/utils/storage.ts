import { Student } from '../types';

const STUDENTS_KEY = 'arabic_teacher_students';
const QUESTIONS_KEY = 'arabic_teacher_questions';

export const saveStudents = (students: Student[]) => {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

export const getStudents = (): Student[] => {
  const stored = localStorage.getItem(STUDENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveQuestions = (questions: any[]) => {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
};

export const getQuestions = (): any[] => {
  const stored = localStorage.getItem(QUESTIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};
export const generateStudentCode = (): string => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

export const findStudentByCode = (code: string): Student | null => {
  const students = getStudents();
  return students.find(student => student.code === code) || null;
};

export const findStudentByEmailAndPassword = (email: string, password: string): Student | null => {
  const students = getStudents();
  return students.find(student => student.email === email && student.password === password) || null;
};

export const findStudentByCodeAndPassword = (code: string, password: string): Student | null => {
  const students = getStudents();
  return students.find(student => student.code === code && student.password === password) || null;
};
export const addStudent = (student: Omit<Student, 'id' | 'code' | 'scores' | 'scoreDetails' | 'attendance' | 'isBanned' | 'createdAt'>): Student => {
  const students = getStudents();
  const newStudent: Student = {
    ...student,
    id: Date.now().toString(),
    code: generateStudentCode(),
    scores: [],
    scoreDetails: [],
    attendance: 0,
    isBanned: false,
    createdAt: new Date()
  };
  
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
};

export const updateStudent = (id: string, updates: Partial<Student>) => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...updates };
    saveStudents(students);
  }
};

export const deleteStudent = (id: string) => {
  const students = getStudents();
  const filtered = students.filter(s => s.id !== id);
  saveStudents(filtered);
};

export const deleteAllStudents = () => {
  localStorage.removeItem(STUDENTS_KEY);
};