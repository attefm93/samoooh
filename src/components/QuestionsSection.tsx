import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Send, Trash2, Check } from 'lucide-react';
import { GlowingButton } from './GlowingButton';
import { 
  getQuestionsFromFirebase, 
  addQuestionToFirebase, 
  updateQuestionInFirebase,
  deleteQuestionFromFirebase,
  approveQuestionInFirebase,
  approveAnswerInFirebase,
  getStudentByCodeAndPasswordFromFirebase
} from '../utils/firebaseUtils';
import { Question, Answer, Grade, Student } from '../types';

interface QuestionsSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const grades: Grade[] = [
  'اولى ابتدائي', 'تانية ابتدائي', 'تالتة ابتدائي', 'رابعة ابتدائي', 'خامسة ابتدائي', 'سادسة ابتدائي',
  'اولى اعدادي', 'تانية اعدادي', 'تالتة اعدادي',
  'اولى ثانوي', 'تانية ثانوي', 'تالتة ثانوي'
];

export const QuestionsSection: React.FC<QuestionsSectionProps> = ({ isOpen, onClose }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<Grade>('اولى ابتدائي');
  const [newQuestion, setNewQuestion] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [studentLogin, setStudentLogin] = useState({ code: '', password: '' });

  useEffect(() => {
    if (isOpen) {
      loadQuestions();
    }
  }, [isOpen]);

  const loadQuestions = async () => {
    const qs = await getQuestionsFromFirebase();
    setQuestions(qs);
  };

  const handleAdminLogin = () => {
    if (adminPassword === '00025') {
      setIsAdmin(true);
      setAdminPassword('');
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const handleStudentAuth = async () => {
    if (!studentLogin.code.trim() || !studentLogin.password.trim()) return;
    const student = await getStudentByCodeAndPasswordFromFirebase(studentLogin.code.trim().toUpperCase(), studentLogin.password.trim());
    if (!student) {
      alert('بيانات الطالب غير صحيحة');
      return;
    }
    if (student.isBanned) {
      alert('تم حظر هذا الحساب');
      return;
    }
    if (!student.canComment) {
      alert('في انتظار موافقة المدرس للسماح بالتعليق');
      return;
    }
    setCurrentStudent(student);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) {
      alert('يجب تسجيل الدخول كطالب وموافقة المدرس أولاً');
      return;
    }
    if (!newQuestion.trim()) {
      alert('يرجى كتابة السؤال');
      return;
    }

    const question: Omit<Question, 'id'> = {
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      grade: selectedGrade,
      question: newQuestion,
      answers: [],
      createdAt: new Date(),
      isApproved: false
    } as any;

    await addQuestionToFirebase(question);
    setNewQuestion('');
    await loadQuestions();
  };

  const handleSubmitReply = async (questionId: string) => {
    if (!replyText.trim()) return;

    const q = questions.find(q => q.id === questionId);
    if (!q) return;

    const newAnswer: Answer = {
      id: Date.now().toString(),
      authorId: isAdmin ? 'admin' : (currentStudent?.id || ''),
      authorName: isAdmin ? 'الأستاذ سامح' : (currentStudent?.name || ''),
      authorType: isAdmin ? 'teacher' : 'student',
      content: replyText,
      createdAt: new Date(),
      isApproved: isAdmin ? true : false
    };

    const updated = { ...q, answers: [...(q.answers || []), newAnswer] } as Question;
    await updateQuestionInFirebase(questionId, { answers: updated.answers } as any);
    setReplyText('');
    setReplyingTo(null);
    await loadQuestions();
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      await deleteQuestionFromFirebase(questionId);
      await loadQuestions();
    }
  };

  const handleDeleteAnswer = async (questionId: string, answerId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الرد؟')) return;
    const q = questions.find(q => q.id === questionId);
    if (!q) return;
    const updatedAnswers = (q.answers || []).filter(a => a.id !== answerId);
    await updateQuestionInFirebase(questionId, { answers: updatedAnswers } as any);
    await loadQuestions();
  };

  const filteredQuestions = questions.filter(q => q.grade === selectedGrade && (isAdmin || q.isApproved));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 max-w-4xl w-full mx-4 border border-white/20 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <MessageCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-white mb-2">أسأل ؟</h2>
          <p className="text-gray-300">اسأل واحصل على إجابات من زملائك والمدرس</p>
        </div>

        {/* Admin Login */}
        {!isAdmin && (
          <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="كلمة مرور الإدارة (اختياري)"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors text-sm"
              />
              <GlowingButton onClick={handleAdminLogin} variant="secondary">
                دخول كإدارة
              </GlowingButton>
            </div>
          </div>
        )}

        {/* Student Auth to comment */}
        {!currentStudent && (
          <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="grid md:grid-cols-3 gap-2">
              <input
                type="text"
                value={studentLogin.code}
                onChange={(e) => setStudentLogin({ ...studentLogin, code: e.target.value })}
                placeholder="كود الطالب"
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors text-sm text-center"
              />
              <input
                type="password"
                value={studentLogin.password}
                onChange={(e) => setStudentLogin({ ...studentLogin, password: e.target.value })}
                placeholder="كلمة المرور"
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors text-sm"
              />
              <GlowingButton onClick={handleStudentAuth} variant="primary">
                تفعيل الكتابة
              </GlowingButton>
            </div>
            <p className="text-xs text-gray-400 mt-2">لا يمكن لأي طالب الكتابة إلا بعد تسجيل حسابه وموافقة المدرس</p>
          </div>
        )}

        {/* Grade Selection */}
        <div className="mb-6">
          <label className="block text-white mb-2">اختر المرحلة</label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as Grade)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
          >
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>

        {/* New Question Form */}
        <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">اسأل سؤال جديد</h3>
          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors resize-none"
              required
              disabled={!currentStudent}
            />
            <GlowingButton type="submit" variant="primary" animated={!!currentStudent}>
              <Send className="w-4 h-4 ml-2" />
              إرسال السؤال
            </GlowingButton>
          </form>
          {!currentStudent && <p className="text-xs text-red-400 mt-2">سجّل وأفعّل الكتابة أولاً</p>}
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">أسئلة {selectedGrade}</h3>
          
          {questions.filter(q => q.grade === selectedGrade && (isAdmin || q.isApproved)).length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400 text-lg">لا توجد أسئلة في هذه المرحلة بعد</p>
            </div>
          ) : (
            questions
              .filter(q => q.grade === selectedGrade && (isAdmin || q.isApproved))
              .map(question => (
              <div key={question.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white">{question.studentName}</h4>
                    <p className="text-sm text-gray-400">
                      {new Date(question.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                    {!question.isApproved && isAdmin && (
                      <div className="mt-1 text-xs text-yellow-400">بانتظار الموافقة</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => approveQuestionInFirebase(question.id, !question.isApproved).then(loadQuestions)}
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{question.question}</p>

                {/* Answers */}
                {question.answers && question.answers.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {question.answers.filter(a => isAdmin || a.isApproved).map(answer => (
                      <div key={answer.id} className="bg-gray-800/50 rounded-lg p-4 border-r-4 border-purple-400">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className={`font-semibold ${answer.authorType === 'teacher' ? 'text-yellow-400' : 'text-purple-400'}`}>
                              {answer.authorName}
                              {answer.authorType === 'teacher' && ' (المدرس)'}
                            </span>
                            <p className="text-xs text-gray-400">
                              {new Date(answer.createdAt).toLocaleDateString('ar-EG')}
                            </p>
                          </div>
                          {isAdmin && (
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <button
                                onClick={() => approveAnswerInFirebase(question.id, answer.id, !answer.isApproved).then(loadQuestions)}
                                className="text-green-400 hover:text-green-300 transition-colors"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteAnswer(question.id, answer.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-300">{answer.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {(isAdmin || currentStudent) && (replyingTo === question.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="اكتب ردك هنا..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors resize-none"
                    />
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <GlowingButton
                        onClick={() => handleSubmitReply(question.id)}
                        variant="primary"
                      >
                        إرسال الرد
                      </GlowingButton>
                      <GlowingButton
                        onClick={() => setReplyingTo(null)}
                        variant="secondary"
                      >
                        إلغاء
                      </GlowingButton>
                    </div>
                  </div>
                ) : (
                  <GlowingButton
                    onClick={() => setReplyingTo(question.id)}
                    variant="secondary"
                  >
                    <MessageCircle className="w-4 h-4 ml-2" />
                    رد على السؤال
                  </GlowingButton>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};