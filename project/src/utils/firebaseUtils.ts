import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Student, Question, Answer } from '../types';

// Students operations
export const addStudentToFirebase = async (student: Omit<Student, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'students'), {
      ...student,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

export const getStudentsFromFirebase = async (): Promise<Student[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'students'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Student));
  } catch (error) {
    console.error('Error getting students:', error);
    return [];
  }
};

export const getStudentByCodeFromFirebase = async (code: string): Promise<Student | null> => {
  try {
    const q = query(collection(db, 'students'), where('code', '==', code));
    const qs = await getDocs(q);
    if (qs.empty) return null;
    const d = qs.docs[0];
    return { id: d.id, ...(d.data() as any) } as Student;
  } catch (e) {
    console.error('Error finding student by code', e);
    return null;
  }
};

export const getStudentByEmailAndPasswordFromFirebase = async (email: string, password: string): Promise<Student | null> => {
  try {
    const q = query(collection(db, 'students'), where('email', '==', email), where('password', '==', password));
    const qs = await getDocs(q);
    if (qs.empty) return null;
    const d = qs.docs[0];
    return { id: d.id, ...(d.data() as any) } as Student;
  } catch (e) {
    console.error('Error finding student by email/password', e);
    return null;
  }
};

export const getStudentByCodeAndPasswordFromFirebase = async (code: string, password: string): Promise<Student | null> => {
  try {
    const q = query(collection(db, 'students'), where('code', '==', code), where('password', '==', password));
    const qs = await getDocs(q);
    if (qs.empty) return null;
    const d = qs.docs[0];
    return { id: d.id, ...(d.data() as any) } as Student;
  } catch (e) {
    console.error('Error finding student by code/password', e);
    return null;
  }
};

export const updateStudentInFirebase = async (id: string, updates: Partial<Student>) => {
  try {
    const studentRef = doc(db, 'students', id);
    await updateDoc(studentRef, updates as any);
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const deleteStudentFromFirebase = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'students', id));
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

// Questions operations
export const addQuestionToFirebase = async (question: Omit<Question, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'questions'), {
      ...question,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};

export const getQuestionsFromFirebase = async (): Promise<Question[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'questions'), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Question));
  } catch (error) {
    console.error('Error getting questions:', error);
    return [];
  }
};

export const updateQuestionInFirebase = async (id: string, updates: Partial<Question>) => {
  try {
    const questionRef = doc(db, 'questions', id);
    await updateDoc(questionRef, updates as any);
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

export const deleteQuestionFromFirebase = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'questions', id));
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

export const approveQuestionInFirebase = async (id: string, isApproved: boolean) => {
  return updateQuestionInFirebase(id, { isApproved } as any);
};

export const approveAnswerInFirebase = async (questionId: string, answerId: string, isApproved: boolean) => {
  try {
    const ref = doc(db, 'questions', questionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data() as Question;
    const updatedAnswers = (data.answers || []).map((a: any) => a.id === answerId ? { ...a, isApproved } : a);
    await updateDoc(ref, { answers: updatedAnswers } as any);
  } catch (e) {
    console.error('Error approving answer', e);
  }
};