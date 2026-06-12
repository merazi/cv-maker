import { useState, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { ResumeForm } from './components/ResumeForm';
import { ATSResume } from './templates/ATSResume';
import type { ResumeData, Language } from './types/resume';
import { FileText, Download, Eye, Edit3 } from 'lucide-react';
import { translations } from './i18n/translations';

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
};

function App() {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resume-data');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('resume-data', JSON.stringify(data));
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">{t.title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Toggle */}
          <div className="flex sm:hidden bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setView('edit')}
              className={`p-2 rounded-md transition-all ${view === 'edit' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              <Edit3 size={20} />
            </button>
            <button
              onClick={() => setView('preview')}
              className={`p-2 rounded-md transition-all ${view === 'preview' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              <Eye size={20} />
            </button>
          </div>

          <PDFDownloadLink
            document={<ATSResume data={data} lang={lang} />}
            fileName={`resume_${data.personalInfo.fullName.replace(/\s+/g, '_') || 'generator'}.pdf`}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            {({ loading }) => (
              <>
                <Download size={18} />
                <span className="hidden sm:inline">{loading ? '...' : t.download}</span>
              </>
            )}
          </PDFDownloadLink>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className={`${view === 'edit' ? 'block' : 'hidden'} lg:block`}>
          <ResumeForm data={data} setData={setData} lang={lang} setLang={setLang} />
        </div>

        {/* Preview Section */}
        <div className={`${view === 'preview' ? 'block' : 'hidden'} lg:block lg:sticky lg:top-24 h-[calc(100vh-8rem)]`}>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.preview}</span>
            </div>
            <div className="flex-1 bg-gray-200 overflow-auto p-4 flex justify-center">
              <div className="w-full h-full min-h-[500px] lg:min-h-0 bg-white shadow-2xl origin-top transition-transform">
                <PDFViewer width="100%" height="100%" showToolbar={false} className="border-none">
                  <ATSResume data={data} lang={lang} />
                </PDFViewer>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile Footer (Optional, but could show download status) */}
    </div>
  );
}

export default App;
