export interface PendingStudent {
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

const KEY = 'pending_students_cache_v1';

const readAll = (): PendingStudent[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as PendingStudent[];
    return arr.map(s => ({ ...s, createdAt: new Date(s.createdAt) }));
  } catch {
    return [];
  }
};

const writeAll = (list: PendingStudent[]) => {
  localStorage.setItem(KEY, JSON.stringify(list));
};

export const savePendingStudent = (student: PendingStudent) => {
  const all = readAll();
  all.push(student);
  writeAll(all);
};

export const findPendingByCode = (code: string): PendingStudent | null => {
  return readAll().find(s => s.code === code) || null;
};

export const findPendingByEmailAndPassword = (email: string, password: string): PendingStudent | null => {
  return readAll().find(s => s.email === email && s.password === password) || null;
};

export const findPendingByCodeAndPassword = (code: string, password: string): PendingStudent | null => {
  return readAll().find(s => s.code === code && s.password === password) || null;
};