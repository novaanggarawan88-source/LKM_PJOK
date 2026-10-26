import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentHome } from './components/StudentHome';
import { ExamScreen } from './components/ExamScreen';
import { ResultScreen } from './components/ResultScreen';
import { ReflectionSidebar } from './components/ReflectionSidebar';
import { TeacherDashboard } from './components/TeacherDashboard';
import { PrintReportModal } from './components/PrintReportModal';
import { lkmEngine } from './services/lkmEngine';
import { googleSheetsService } from './services/googleSheetsService';
import { Student, LKMInfo, QuestionClient, SubmissionResult } from './types/lkm';
import { GraduationCap, Heart, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'murid' | 'guru'>('murid');
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState(false);

  // Student flow state
  const [examStep, setExamStep] = useState<'home' | 'taking' | 'result'>('home');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentLKM, setCurrentLKM] = useState<LKMInfo | null>(null);
  const [clientQuestions, setClientQuestions] = useState<QuestionClient[]>([]);
  const [activeSubmission, setActiveSubmission] = useState<SubmissionResult | null>(null);
  const [isReflectionSidebarOpen, setIsReflectionSidebarOpen] = useState(false);
  
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    // Attempt automatic sync if user has configured custom spreadsheet or Web App
    if (googleSheetsService.isCustomSheetConnected()) {
      googleSheetsService.syncFromSpreadsheet();
    }
  }, []);

  // Handle starting exam
  const handleStartExam = ({
    student,
    lkm
  }: {
    student: Student;
    lkm: LKMInfo;
  }) => {
    setCurrentStudent(student);
    setCurrentLKM(lkm);
    // Security: Only client-safe questions (no answer keys or explanations sent!)
    const questions = lkmEngine.getQuestionsForStudent(lkm.id);
    setClientQuestions(questions);
    setExamStep('taking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle submission from ExamScreen
  const handleFinishExam = async (answers: Record<string, string>) => {
    if (!currentStudent || !currentLKM) return;

    // Secure backend calculation
    const submissionResult = lkmEngine.submitExam({
      namaMurid: currentStudent.nama,
      kelas: currentStudent.kelas,
      nis: currentStudent.nis,
      lkmId: currentLKM.id,
      materi: currentLKM.materi,
      jawabanMurid: answers
    });

    // Push to Google Spreadsheet via Apps Script Web App
    await googleSheetsService.pushSubmissionToGoogleSheet(submissionResult);

    setActiveSubmission(submissionResult);
    setExamStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // View existing result from previous submission
  const handleViewPreviousResult = (sub: SubmissionResult) => {
    setActiveSubmission(sub);
    setExamStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retake exam
  const handleRetakeExam = () => {
    if (currentStudent && currentLKM) {
      handleStartExam({
        student: currentStudent,
        lkm: currentLKM
      });
    } else if (activeSubmission) {
      const studentObj: Student = {
        nama: activeSubmission.namaMurid,
        kelas: activeSubmission.kelas,
        nis: activeSubmission.nis
      };
      const lkmObj = lkmEngine.getLKMById(activeSubmission.lkmId) || lkmEngine.getActiveLKMs()[0];
      handleStartExam({
        student: studentObj,
        lkm: lkmObj
      });
    } else {
      setExamStep('home');
    }
  };

  const handleBackToHome = () => {
    setExamStep('home');
    setCurrentStudent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'murid' && examStep === 'taking') {
            // Keep in exam step if in progress
          }
        }}
        isTeacherAuthenticated={isTeacherAuthenticated}
        onTeacherLogin={(auth) => setIsTeacherAuthenticated(auth)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'murid' && (
          <>
            {examStep === 'home' && (
              <StudentHome
                onStartExam={handleStartExam}
                onViewPreviousResult={handleViewPreviousResult}
              />
            )}

            {examStep === 'taking' && currentStudent && currentLKM && (
              <ExamScreen
                student={currentStudent}
                lkm={currentLKM}
                questions={clientQuestions}
                onFinishExam={handleFinishExam}
                onCancel={handleBackToHome}
              />
            )}

            {examStep === 'result' && activeSubmission && (
              <ResultScreen
                submission={activeSubmission}
                onRetake={currentLKM?.allowRetake ? handleRetakeExam : undefined}
                onBackToHome={handleBackToHome}
                onOpenPrintModal={() => setShowPrintModal(true)}
                onOpenReflectionSidebar={() => setIsReflectionSidebarOpen(true)}
              />
            )}
          </>
        )}

        {activeTab === 'guru' && (
          <TeacherDashboard onBackToStudent={() => setActiveTab('murid')} />
        )}
      </main>

      {/* Dedicated Student Reflection Sidebar / Drawer */}
      <ReflectionSidebar
        isOpen={isReflectionSidebarOpen}
        onClose={() => setIsReflectionSidebarOpen(false)}
        submission={activeSubmission}
        onSavedSuccess={() => {
          if (activeSubmission) {
            setActiveSubmission({ ...activeSubmission, refleksiTersimpan: true });
          }
        }}
      />

      {/* Single Submission Print Modal */}
      {showPrintModal && activeSubmission && (
        <PrintReportModal
          submission={activeSubmission}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 border-t border-slate-800 text-xs print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                LKM Digital PJOK • SMA Negeri 1 Tejakula
              </p>
              <p className="text-slate-400 text-[11px]">
                Kurikulum Merdeka • Fase F • Guru: I Ketut Agus Nova Anggarawan, S.Pd.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Google Spreadsheet Single Source of Truth</span>
            </span>
            <span className="text-slate-600">•</span>
            <span>Penilaian Otomatis & Analisis Indikator</span>
          </div>

          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} SMAN 1 Tejakula. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
