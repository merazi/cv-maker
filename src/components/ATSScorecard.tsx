import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import { CheckCircle, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';
import type { ResumeData, Language } from '../types/resume';

interface Props {
  data: ResumeData;
  lang: Language;
}

export const ATSScorecard: React.FC<Props> = ({ data, lang }) => {
  // Scoring configuration
  let score = 0;
  const checks: {
    id: string;
    label: string;
    status: 'success' | 'warning' | 'danger';
    message: string;
  }[] = [];

  // 1. Email check
  if (data.personalInfo.email && data.personalInfo.email.trim() !== '') {
    score += 20;
    checks.push({
      id: 'email',
      label: lang === 'en' ? 'Email Address' : 'Correo Electrónico',
      status: 'success',
      message: lang === 'en' ? 'Email is present.' : 'El correo electrónico está presente.',
    });
  } else {
    checks.push({
      id: 'email',
      label: lang === 'en' ? 'Email Address' : 'Correo Electrónico',
      status: 'danger',
      message: lang === 'en' ? 'Missing email address.' : 'Falta la dirección de correo electrónico.',
    });
  }

  // 2. Phone check
  if (data.personalInfo.phone && data.personalInfo.phone.trim() !== '') {
    score += 20;
    checks.push({
      id: 'phone',
      label: lang === 'en' ? 'Phone Number' : 'Número de Teléfono',
      status: 'success',
      message: lang === 'en' ? 'Phone number is present.' : 'El número de teléfono está presente.',
    });
  } else {
    checks.push({
      id: 'phone',
      label: lang === 'en' ? 'Phone Number' : 'Número de Teléfono',
      status: 'danger',
      message: lang === 'en' ? 'Missing phone number.' : 'Falta el número de teléfono.',
    });
  }

  // 3. Location check
  if (data.personalInfo.location && data.personalInfo.location.trim() !== '') {
    score += 10;
    checks.push({
      id: 'location',
      label: lang === 'en' ? 'Location' : 'Ubicación',
      status: 'success',
      message: lang === 'en' ? 'Location is present.' : 'La ubicación está presente.',
    });
  } else {
    checks.push({
      id: 'location',
      label: lang === 'en' ? 'Location' : 'Ubicación',
      status: 'warning',
      message: lang === 'en' ? 'Missing location (city and state/country is recommended).' : 'Falta la ubicación (se recomienda ciudad y país).',
    });
  }

  // 4. Professional Summary check
  if (data.personalInfo.summary && data.personalInfo.summary.trim() !== '') {
    const summaryLength = data.personalInfo.summary.trim().length;
    if (summaryLength >= 100) {
      score += 15;
      checks.push({
        id: 'summary',
        label: lang === 'en' ? 'Professional Summary' : 'Resumen Profesional',
        status: 'success',
        message: lang === 'en' ? 'Summary is long enough for ATS parsing.' : 'El resumen profesional es adecuado.',
      });
    } else {
      score += 10;
      checks.push({
        id: 'summary',
        label: lang === 'en' ? 'Professional Summary' : 'Resumen Profesional',
        status: 'warning',
        message: lang === 'en' ? 'Summary is a bit short. Aim for at least 100 characters.' : 'El resumen profesional es algo corto (mínimo 100 caracteres).',
      });
    }
  } else {
    checks.push({
      id: 'summary',
      label: lang === 'en' ? 'Professional Summary' : 'Resumen Profesional',
      status: 'warning',
      message: lang === 'en' ? 'Missing summary. A brief professional summary helps ATS match your profile.' : 'Falta el resumen profesional.',
    });
  }

  // 5. Experience check
  if (data.experience && data.experience.length > 0) {
    score += 20;
    checks.push({
      id: 'experience',
      label: lang === 'en' ? 'Work Experience' : 'Experiencia Laboral',
      status: 'success',
      message: lang === 'en' ? `${data.experience.length} work experience items listed.` : `${data.experience.length} experiencias registradas.`,
    });
  } else {
    checks.push({
      id: 'experience',
      label: lang === 'en' ? 'Work Experience' : 'Experiencia Laboral',
      status: 'danger',
      message: lang === 'en' ? 'No work experience listed (Highly critical).' : 'Falta la experiencia laboral (Muy crítico).',
    });
  }

  // 6. Education check
  if (data.education && data.education.length > 0) {
    score += 15;
    checks.push({
      id: 'education',
      label: lang === 'en' ? 'Education' : 'Educación',
      status: 'success',
      message: lang === 'en' ? `${data.education.length} education items listed.` : `${data.education.length} títulos/estudios registrados.`,
    });
  } else {
    checks.push({
      id: 'education',
      label: lang === 'en' ? 'Education' : 'Educación',
      status: 'danger',
      message: lang === 'en' ? 'No education items listed.' : 'Falta la sección de educación.',
    });
  }

  // 7. Profile Photo Warning (Important for ATS)
  if (data.personalInfo.photo && data.personalInfo.photo !== '' && data.personalInfo.showPhoto !== false) {
    checks.push({
      id: 'photo',
      label: lang === 'en' ? 'Profile Picture' : 'Foto de Perfil',
      status: 'warning',
      message: lang === 'en'
        ? 'Warning: Some ATS parsers in US/UK/Canada reject resumes with photos to prevent bias.'
        : 'Advertencia: Algunos sistemas ATS en EE. UU./Reino Unido/Canadá descartan CVs con fotos.',
    });
  } else {
    checks.push({
      id: 'photo',
      label: lang === 'en' ? 'Profile Picture' : 'Foto de Perfil',
      status: 'success',
      message: data.personalInfo.photo && data.personalInfo.photo !== ''
        ? (lang === 'en' ? 'Profile picture is hidden (Optimal for ATS parsing).' : 'Foto de perfil oculta (Óptimo para lectura de ATS).')
        : (lang === 'en' ? 'No profile picture included (Optimal for ATS parsing).' : 'Sin foto de perfil (Óptimo para lectura de ATS).'),
    });
  }

  // Determine color theme based on score
  let progressBarVariant = 'danger';
  if (score >= 80) progressBarVariant = 'success';
  else if (score >= 50) progressBarVariant = 'warning';

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-bottom py-3 px-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <ShieldCheck className="text-primary" size={20} />
          <span className="fw-bold text-dark">
            {lang === 'en' ? 'ATS Compatibility Score' : 'Puntaje de Compatibilidad ATS'}
          </span>
        </div>
        <span className={`badge bg-${progressBarVariant} px-2.5 py-1.5 rounded fw-bold fs-6`}>
          {score}%
        </span>
      </Card.Header>
      <Card.Body className="p-3">
        <ProgressBar
          variant={progressBarVariant}
          now={score}
          className="mb-3"
          style={{ height: '10px' }}
        />
        <div style={{ maxHeight: '180px', overflowY: 'auto' }} className="pe-1">
          {checks.map((check) => (
            <div key={check.id} className="d-flex gap-2.5 mb-2.5 align-items-start border-bottom pb-2">
              <div className="mt-0.5 flex-shrink-0">
                {check.status === 'success' && <CheckCircle size={16} className="text-success" />}
                {check.status === 'warning' && <AlertTriangle size={16} className="text-warning" />}
                {check.status === 'danger' && <XCircle size={16} className="text-danger" />}
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                <div className="fw-semibold text-dark mb-0.5">{check.label}</div>
                <div className="text-muted" style={{ fontSize: '0.8rem', lineHeight: '1.3' }}>
                  {check.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};
