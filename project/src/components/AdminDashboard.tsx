import React, { useState, useEffect } from 'react';
import { Users, Trash2, Plus, Check, Edit3, Search, Ban } from 'lucide-react';
import { GlowingButton } from './GlowingButton';
import { getStudents, updateStudent, deleteStudent, deleteAllStudents } from '../utils/storage';
import { Student } from '../types';

export const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingScore, setEditingScore] = useState<{ studentId: string; scoreIndex: number } | null>(null);
  const [newScore, setNewScore] = useState('');
  const [addingScore, setAddingScore] = useState<string | null>(null);
  const [newScoreData, setNewScoreData] = useState({ examName: '', score: '' });

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
  const loadStudents = () => {
    const loadedStudents = getStudents();
    setStudents(loadedStudents);
    setFilteredStudents(loadedStudents);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      deleteStudent(id);
      loadStudents();
    }
  };

  const handleDeleteAllStudents = () => {
    if (confirm('هل أنت متأكد من حذف جميع الطلاب؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      deleteAllStudents();
      loadStudents();
    }
  };

  const handleAttendance = (student: Student) => {
    updateStudent(student.id, { attendance: student.attendance + 1 });
    loadStudents();
  };

  const handleAddScore = (studentId: string) => {
    if (!newScoreData.examName.trim() || !newScoreData.score.trim()) {
      alert('يرجى ملء جميع الحقول');
      return;
    }

    const numScore = Number(newScoreData.score);
    if (!isNaN(numScore)) {
      if (numScore >= 0 && numScore <= 100) {
        const student = students.find(s => s.id === studentId);
        if (student) {
          const newScores = [...student.scores, numScore];
          const newScoreDetails = [...(student.scoreDetails || []), {
            examName: newScoreData.examName,
            score: numScore,
            date: new Date()
          }];
          updateStudent(student.id, { 
            scores: newScores,
            scoreDetails: newScoreDetails
          });
        }
        loadStudents();
        setAddingScore(null);
        setNewScoreData({ examName: '', score: '' });
      } else {
        alert('يجب أن تكون الدرجة بين 0 و 100');
      }
    } else {
      alert('يرجى إدخال درجة صحيحة');
    }
  };

  const handleEditScore = (studentId: string, scoreIndex: number, currentScore: number) => {
    setEditingScore({ studentId, scoreIndex });
    setNewScore(currentScore.toString());
  };

  const handleSaveScore = () => {
    if (editingScore && !isNaN(Number(newScore))) {
      const numScore = Number(newScore);
      if (numScore >= 0 && numScore <= 100) {
        const student = students.find(s => s.id === editingScore.studentId);
        if (student) {
          const newScores = [...student.scores];
          newScores[editingScore.scoreIndex] = numScore;
          
          // Update score details if they exist
          const newScoreDetails = [...(student.scoreDetails || [])];
          if (newScoreDetails[editingScore.scoreIndex]) {
            newScoreDetails[editingScore.scoreIndex].score = numScore;
          }
          
          updateStudent(student.id, { 
            scores: newScores,
            scoreDetails: newScoreDetails
          });
          loadStudents();
        }
      } else {
        alert('يجب أن تكون الدرجة بين 0 و 100');
      }
    }
    setEditingScore(null);
    setNewScore('');
  };

  const handleBanStudent = (student: Student) => {
    const action = student.isBanned ? 'إلغاء منع' : 'منع';
    if (confirm(`هل أنت متأكد من ${action} هذا الطالب؟`)) {
      updateStudent(student.id, { isBanned: !student.isBanned });
      loadStudents();
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-purple-400 ml-3" />
          <h2 className="text-3xl font-bold text-white">لوحة الإدارة</h2>
        </div>
        
        {students.length > 0 && (
          <GlowingButton
            onClick={handleDeleteAllStudents}
            variant="danger"
          >
            <Trash2 className="w-4 h-4 ml-2" />
            حذف جميع الطلاب
          </GlowingButton>
        )}
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
                      <span className="text-gray-400">الحضور:</span> {student.attendance} مرة
                    </p>
                  </div>
                </div>

                {/* Scores */}
                <div>
                  <h4 className="text-white font-semibold mb-2">الدرجات</h4>
                  {student.scoreDetails && student.scoreDetails.length > 0 ? (
                    <div className="space-y-1">
                      {student.scoreDetails.map((scoreDetail, index) => (
                        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                          {editingScore?.studentId === student.id && editingScore?.scoreIndex === index ? (
                            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                              <input
                                type="number"
                                value={newScore}
                                onChange={(e) => setNewScore(e.target.value)}
                                className="w-16 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                                min="0"
                                max="100"
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
                                <span className="text-yellow-400 font-semibold">{scoreDetail.score}</span>
                                <button
                                  onClick={() => handleEditScore(student.id, index, scoreDetail.score)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="text-xs text-gray-400">{scoreDetail.examName}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : student.scores.length > 0 ? (
                    <div className="space-y-1">
                      {student.scores.map((score, index) => (
                        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                          {editingScore?.studentId === student.id && editingScore?.scoreIndex === index ? (
                            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                              <input
                                type="number"
                                value={newScore}
                                onChange={(e) => setNewScore(e.target.value)}
                                className="w-16 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                                min="0"
                                max="100"
                              />
                              <button
                                onClick={handleSaveScore}
                                className="text-green-400 hover:text-green-300"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                              <span className="text-yellow-400 font-semibold">{score}</span>
                              <button
                                onClick={() => handleEditScore(student.id, index, score)}
                                className="text-gray-400 hover:text-white"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
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
                      <input
                        type="number"
                        value={newScoreData.score}
                        onChange={(e) => setNewScoreData({ ...newScoreData, score: e.target.value })}
                        placeholder="الدرجة (0-100)"
                        min="0"
                        max="100"
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                      />
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
                            setNewScoreData({ examName: '', score: '' });
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
                    onClick={() => handleBanStudent(student)}
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