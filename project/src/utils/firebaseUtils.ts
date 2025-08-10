import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Student, Question } from '../types';

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

export const updateStudentInFirebase = async (id: string, updates: Partial<Student>) => {
  try {
    const studentRef = doc(db, 'students', id);
    await updateDoc(studentRef, updates);
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
    await updateDoc(questionRef, updates);
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