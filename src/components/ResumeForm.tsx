import React from 'react';
import type { ResumeData, Language } from '../types/resume';
import { translations } from '../i18n/translations';
import { Plus, Trash2, Globe, User, Briefcase, GraduationCap, Code, Languages, Folder } from 'lucide-react';

interface Props {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const ResumeForm: React.FC<Props> = ({ data, setData, lang, setLang }) => {
  const t = translations[lang];

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addItem = (section: 'experience' | 'education' | 'projects' | 'skills' | 'languages') => {
    if (section === 'experience') {
      setData(prev => ({
        ...prev,
        experience: [...prev.experience, { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }]
      }));
    } else if (section === 'education') {
      setData(prev => ({
        ...prev,
        education: [...prev.education, { school: '', degree: '', location: '', startDate: '', endDate: '', description: '' }]
      }));
    } else if (section === 'projects') {
      setData(prev => ({
        ...prev,
        projects: [...prev.projects, { name: '', description: '', link: '' }]
      }));
    } else if (section === 'skills') {
      setData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
    } else if (section === 'languages') {
      setData(prev => ({ ...prev, languages: [...prev.languages, ''] }));
    }
  };

  const removeItem = (section: keyof ResumeData, index: number) => {
    setData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((_, i) => i !== index)
    }));
  };

  const updateItem = (section: keyof ResumeData, index: number, field: string, value: any) => {
    setData(prev => {
      const newSection = [...(prev[section] as any[])];
      if (typeof newSection[index] === 'object') {
        newSection[index] = { ...newSection[index], [field]: value };
      } else {
        newSection[index] = value;
      }
      return { ...prev, [section]: newSection };
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Language Switcher */}
      <div className="flex justify-end items-center gap-2 mb-4">
        <Globe size={18} className="text-gray-500" />
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Language)}
          className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>

      {/* Personal Info */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <User className="text-blue-600" size={20} />
          <h2 className="text-lg font-bold text-gray-800">{t.personalInfo}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.fullName}</label>
            <input
              type="text"
              value={data.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.email}</label>
            <input
              type="email"
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.phone}</label>
            <input
              type="text"
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="+1 234 567 890"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.location}</label>
            <input
              type="text"
              value={data.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="City, Country"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.website}</label>
            <input
              type="text"
              value={data.personalInfo.website}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://portfolio.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.linkedin}</label>
            <input
              type="text"
              value={data.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.summary}</label>
            <textarea
              value={data.personalInfo.summary}
              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="A brief overview of your professional background..."
            />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-800">{t.experience}</h2>
          </div>
          <button
            onClick={() => addItem('experience')}
            className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="space-y-6">
          {data.experience.map((exp, index) => (
            <div key={index} className="p-4 border border-gray-100 rounded-lg relative group">
              <button
                onClick={() => removeItem('experience', index)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.company}</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateItem('experience', index, 'company', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.position}</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateItem('experience', index, 'position', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.startDate}</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateItem('experience', index, 'startDate', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="MM/YYYY"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.endDate}</label>
                    <input
                      type="text"
                      value={exp.endDate}
                      disabled={exp.current}
                      onChange={(e) => updateItem('experience', index, 'endDate', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                      placeholder="MM/YYYY"
                    />
                  </div>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateItem('experience', index, 'current', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{t.current}</span>
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.description}</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateItem('experience', index, 'description', e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-800">{t.education}</h2>
          </div>
          <button
            onClick={() => addItem('education')}
            className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="space-y-6">
          {data.education.map((edu, index) => (
            <div key={index} className="p-4 border border-gray-100 rounded-lg relative">
              <button
                onClick={() => removeItem('education', index)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.school}</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateItem('education', index, 'school', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.degree}</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateItem('education', index, 'degree', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.startDate}</label>
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => updateItem('education', index, 'startDate', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.endDate}</label>
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => updateItem('education', index, 'endDate', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills & Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-gray-800">{t.skills}</h2>
            </div>
            <button
              onClick={() => addItem('skills')}
              className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-md px-2 py-1">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateItem('skills', index, '', e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-24"
                  placeholder="React"
                />
                <button onClick={() => removeItem('skills', index)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Languages className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-gray-800">{t.languages}</h2>
            </div>
            <button
              onClick={() => addItem('languages')}
              className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((langItem, index) => (
              <div key={index} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-md px-2 py-1">
                <input
                  type="text"
                  value={langItem}
                  onChange={(e) => updateItem('languages', index, '', e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-24"
                  placeholder="English"
                />
                <button onClick={() => removeItem('languages', index)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Projects */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Folder className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-800">{t.projects}</h2>
          </div>
          <button
            onClick={() => addItem('projects')}
            className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="space-y-6">
          {data.projects.map((project, index) => (
            <div key={index} className="p-4 border border-gray-100 rounded-lg relative">
              <button
                onClick={() => removeItem('projects', index)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.projectName}</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateItem('projects', index, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.link}</label>
                  <input
                    type="text"
                    value={project.link}
                    onChange={(e) => updateItem('projects', index, 'link', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t.description}</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateItem('projects', index, 'description', e.target.value)}
                    rows={2}
                    className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
