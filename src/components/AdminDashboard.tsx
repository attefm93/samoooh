import React, { useState, useEffect } from 'react';
import { Users, Trash2, Plus, Check, Edit3, Search, Ban, MessageSquare } from 'lucide-react';
import { GlowingButton } from './GlowingButton';
import { 
  getStudentsFromFirebase, 
  updateStudentInFirebase, 
  deleteStudentFromFirebase 
} from '../utils/firebaseUtils';
import { Student } from '../types';

export const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingScore, setEditingScore] = useState<{ studentId: string; scoreIndex: number } | null>(null);
  const [newScore, setNewScore] = useState('');
  const [addingScore, setAddingScore] = useState<string | null>(null);
  const [newScoreData, setNewScoreData] = useState({ examName: '', score: '', maxScore: '' });

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.includes(searchTerm)
    );
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

  const loadStudents = async () => {
    const loadedStudents = await getStudentsFromFirebase();
    setStudents(loadedStudents);
    setFilteredStudents(loadedStudents);
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      await deleteStudentFromFirebase(id);
      await loadStudents();
    }
  };

  const handleAttendance = async (student: Student) => {
    await updateStudentInFirebase(student.id, { attendance: (student.attendance || 0) + 1 });
    await loadStudents();
  };

  const handleAddScore = async (studentId: string) => {
    if (!newScoreData.examName.trim() || !newScoreData.score.trim() || !newScoreData.maxScore.trim()) {
      alert('يرجى ملء جميع الحقول');
      return;
    }

    const numScore = Number(newScoreData.score);
    const numMax = Number(newScoreData.maxScore);
    if (!isNaN(numScore) && !isNaN(numMax) && numMax > 0 && numScore >= 0 && numScore <= numMax) {
      const student = students.find(s => s.id === studentId);
      if (student) {
        const newScores = [...(student.scores || []), {
          examName: newScoreData.examName,
          score: numScore,
          maxScore: numMax,
          date: new Date()
        }];
        await updateStudentInFirebase(student.id, { scores: newScores });
      }
      await loadStudents();
      setAddingScore(null);
      setNewScoreData({ examName: '', score: '', maxScore: '' });
    } else {
      alert('من فضلك أدخل درجة صحيحة (الدرجة لا تتجاوز الدرجة الكلية)');
    }
  };

  const handleEditScore = (studentId: string, scoreIndex: number, currentScore: number) => {
    setEditingScore({ studentId, scoreIndex });
    setNewScore(currentScore.toString());
  };

  const handleSaveScore = async () => {
    if (editingScore && !isNaN(Number(newScore))) {
      const numScore = Number(newScore);
      const student = students.find(s => s.id === editingScore.studentId);
      if (student) {
        const newScores = [...(student.scores || [])];
        if (newScores[editingScore.scoreIndex]) {
          newScores[editingScore.scoreIndex] = { ...newScores[editingScore.scoreIndex], score: numScore } as any;
          await updateStudentInFirebase(student.id, { scores: newScores });
          await loadStudents();
        }
      }
    }
    setEditingScore(null);
    setNewScore('');
  };

  const handleToggleBan = async (student: Student) => {
    const action = student.isBanned ? 'إلغاء منع' : 'منع';
    if (confirm(`هل أنت متأكد من ${action} هذا الطالب؟`)) {
      await updateStudentInFirebase(student.id, { isBanned: !student.isBanned });
      await loadStudents();
    }
  };

  const handleToggleCommentPermission = async (student: Student) => {
    await updateStudentInFirebase(student.id, { canComment: !student.canComment });
    await loadStudents();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-purple-400 ml-3" />
          <h2 className="text-3xl font-bold text-white">لوحة الإدارة</h2>
        </div>
      </div>

      {/* Search Bar */}
      {students.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث بالاسم أو الكود أو المرحلة..."
              className="w-full pl-4 pr-12 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
            />
          </div>
        </div>
      )}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
          <p className="text-gray-400 text-lg">
            {students.length === 0 ? 'لا يوجد طلاب مسجلين بعد' : 'لا توجد نتائج للبحث'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 ${
                student.isBanned ? 'opacity-60 border-red-500/50' : ''
              }`}
            >
              <div className="grid md:grid-cols-4 gap-6">
                {/* Student Info */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {student.name}
                    {student.isBanned && (
                      <span className="text-red-400 text-sm ml-2">(محظور)</span>
                    )}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-300">
                      <span className="text-gray-400">المرحلة:</span> {student.grade}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">الكود:</span> 
                      <span className="font-mono ml-2">{student.code}</span>
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">البريد:</span> {student.email}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">الحضور:</span> {student.attendance || 0} مرة
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">التعليق:</span> {student.canComment ? 'مسموح' : 'غير مسموح'}
                    </p>
                  </div>
                </div>

                {/* Scores */}
                <div>
                  <h4 className="text-white font-semibold mb-2">الدرجات</h4>
                  {student.scores && student.scores.length > 0 ? (
                    <div className="space-y-1">
                      {student.scores.map((s, index) => (
                        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                          {editingScore?.studentId === student.id && editingScore?.scoreIndex === index ? (
                            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                              <input
                                type="number"
                                value={newScore}
                                onChange={(e) => setNewScore(e.target.value)}
                                className="w-16 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                                min="0"
                                max={s.maxScore}
                              />
                              <button
                                onClick={handleSaveScore}
                                className="text-green-400 hover:text-green-300"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                <span className="text-yellow-400 font-semibold">{s.score} / {s.maxScore}</span>
                                <button
                                  onClick={() => handleEditScore(student.id, index, s.score)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="text-xs text-gray-400">{s.examName}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">لا توجد درجات</p>
                  )}
                  
                  {/* Add Score Form */}
                  {addingScore === student.id && (
                    <div className="mt-4 space-y-2">
                      <input
                        type="text"
                        value={newScoreData.examName}
                        onChange={(e) => setNewScoreData({ ...newScoreData, examName: e.target.value })}
                        placeholder="اسم الامتحان"
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={newScoreData.score}
                          onChange={(e) => setNewScoreData({ ...newScoreData, score: e.target.value })}
                          placeholder="الدرجة"
                          min="0"
                          className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                        />
                        <input
                          type="number"
                          value={newScoreData.maxScore}
                          onChange={(e) => setNewScoreData({ ...newScoreData, maxScore: e.target.value })}
                          placeholder="من (الدرجة الكلية)"
                          min="1"
                          className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                        />
                      </div>
                      <div className="flex space-x-1 rtl:space-x-reverse">
                        <button
                          onClick={() => handleAddScore(student.id)}
                          className="px-2 py-1 bg-green-500/20 border border-green-500/50 rounded text-green-400 hover:bg-green-500/30 transition-colors text-xs"
                        >
                          حفظ
                        </button>
                        <button
                          onClick={() => {
                            setAddingScore(null);
                            setNewScoreData({ examName: '', score: '', maxScore: '' });
                          }}
                          className="px-2 py-1 bg-gray-500/20 border border-gray-500/50 rounded text-gray-400 hover:bg-gray-500/30 transition-colors text-xs"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleAttendance(student)}
                    className="flex items-center justify-center px-3 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors text-sm"
                    disabled={student.isBanned}
                  >
                    <Check className="w-4 h-4 ml-1" />
                    تسجيل حضور
                  </button>
                  
                  <button
                    onClick={() => setAddingScore(student.id)}
                    className="flex items-center justify-center px-3 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-colors text-sm"
                    disabled={student.isBanned}
                  >
                    <Plus className="w-4 h-4 ml-1" />
                    إضافة درجة
                  </button>

                  <button
                    onClick={() => handleToggleCommentPermission(student)}
                    className={`flex items-center justify-center px-3 py-2 ${student.canComment ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30' : 'bg-gray-500/20 border border-gray-500/50 text-gray-300 hover:bg-gray-500/30'} rounded-lg transition-colors text-sm`}
                  >
                    <MessageSquare className="w-4 h-4 ml-1" />
                    {student.canComment ? 'تعطيل التعليق' : 'السماح بالتعليق'}
                  </button>
                  
                  <button
                    onClick={() => handleToggleBan(student)}
                    className={`flex items-center justify-center px-3 py-2 ${
                      student.isBanned 
                        ? 'bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30' 
                        : 'bg-orange-500/20 border border-orange-500/50 text-orange-400 hover:bg-orange-500/30'
                    } rounded-lg transition-colors text-sm`}
                  >
                    <Ban className="w-4 h-4 ml-1" />
                    {student.isBanned ? 'إلغاء المنع' : 'منع الطالب'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteStudent(student.id)}
                    className="flex items-center justify-center px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};