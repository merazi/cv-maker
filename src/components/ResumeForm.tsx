import React from 'react';
import type { ResumeData, Language } from '../types/resume';
import { translations } from '../i18n/translations';
import { Plus, Trash2, Globe, User, Briefcase, GraduationCap, Code, Languages, Folder } from 'lucide-react';
import { Form, Row, Col, Card, Button, InputGroup } from 'react-bootstrap';

interface Props {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const ResumeForm: React.FC<Props> = ({ data, setData, lang, setLang }) => {
  const t = translations[lang];

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: any) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
      setData(prev => ({ ...prev, skills: [...prev.skills, { name: '', description: '' }] }));
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
    <div className="pb-5">
      {/* Language Switcher */}
      <div className="d-flex justify-content-end align-items-center gap-2 mb-4">
        <Globe size={18} className="text-muted" />
        <Form.Select
          size="sm"
          style={{ width: 'auto' }}
          value={lang}
          onChange={(e) => setLang(e.target.value as Language)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </Form.Select>
      </div>

      {/* Personal Info */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center gap-2 mb-4">
            <User className="text-primary" size={20} />
            <h5 className="mb-0 fw-bold text-dark">{t.personalInfo}</h5>
          </div>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.fullName}</Form.Label>
                <Form.Control
                  type="text"
                  value={data.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  placeholder="John Doe"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.email}</Form.Label>
                <Form.Control
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.photo}</Form.Label>
                {data.personalInfo.photo ? (
                  <div className="d-flex align-items-center gap-3 p-2 border rounded bg-white">
                    <img
                      src={data.personalInfo.photo}
                      alt="Profile preview"
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div className="flex-grow-1">
                      <Form.Check
                        type="switch"
                        id="toggle-photo"
                        label={lang === 'en' ? 'Show on CV' : 'Mostrar en CV'}
                        checked={data.personalInfo.showPhoto !== false}
                        onChange={(e) => updatePersonalInfo('showPhoto', e.target.checked)}
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        updatePersonalInfo('photo', '');
                        updatePersonalInfo('showPhoto', true);
                      }}
                      className="d-flex align-items-center justify-content-center p-1.5"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ) : (
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.headerTextColor}</Form.Label>
                <Form.Control
                  type="color"
                  value={data.headerTextColor || data.headerColor || '#000000'}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    headerTextColor: e.target.value,
                    headerColor: e.target.value
                  }))}
                  title={t.headerTextColor}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <Form.Label className="small fw-bold text-muted text-uppercase mb-0">{t.headerBgColor}</Form.Label>
                  <Form.Check
                    type="checkbox"
                    id="use-header-bg"
                    checked={!!data.headerBgColor && data.headerBgColor !== '#ffffff' && data.headerBgColor !== 'transparent'}
                    onChange={(e) => {
                      setData(prev => ({
                        ...prev,
                        headerBgColor: e.target.checked ? '#f3f4f6' : '#ffffff'
                      }));
                    }}
                    style={{ fontSize: '0.8rem' }}
                    label={t.useHeaderBg}
                  />
                </div>
                <Form.Control
                  type="color"
                  value={data.headerBgColor && data.headerBgColor !== 'transparent' ? data.headerBgColor : '#ffffff'}
                  disabled={!data.headerBgColor || data.headerBgColor === '#ffffff' || data.headerBgColor === 'transparent'}
                  onChange={(e) => setData(prev => ({ ...prev, headerBgColor: e.target.value }))}
                  title={t.headerBgColor}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.phone}</Form.Label>
                <Form.Control
                  type="text"
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+1 234 567 890"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.location}</Form.Label>
                <Form.Control
                  type="text"
                  value={data.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  placeholder="City, Country"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.website}</Form.Label>
                <Form.Control
                  type="text"
                  value={data.personalInfo.website}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  placeholder="https://portfolio.com"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.linkedin}</Form.Label>
                <Form.Control
                  type="text"
                  value={data.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.summary}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={data.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  placeholder="A brief overview of your professional background..."
                  style={{ resize: 'none' }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Experience */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <Briefcase className="text-primary" size={20} />
              <h5 className="mb-0 fw-bold text-dark">{t.experience}</h5>
            </div>
            <Button
              variant="light"
              className="rounded-circle p-2 text-primary"
              onClick={() => addItem('experience')}
            >
              <Plus size={20} />
            </Button>
          </div>
          <div className="d-flex flex-column gap-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="p-3 border rounded position-relative">
                <Button
                  variant="link"
                  className="position-absolute top-0 end-0 mt-2 me-2 text-muted p-0"
                  onClick={() => removeItem('experience', index)}
                >
                  <Trash2 size={18} />
                </Button>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.company}</Form.Label>
                      <Form.Control
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateItem('experience', index, 'company', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.position}</Form.Label>
                      <Form.Control
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateItem('experience', index, 'position', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Row className="g-2">
                      <Col>
                        <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.startDate}</Form.Label>
                        <Form.Control
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateItem('experience', index, 'startDate', e.target.value)}
                          placeholder="MM/YYYY"
                        />
                      </Col>
                      <Col>
                        <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.endDate}</Form.Label>
                        <Form.Control
                          type="text"
                          value={exp.endDate}
                          disabled={exp.current}
                          onChange={(e) => updateItem('experience', index, 'endDate', e.target.value)}
                          placeholder="MM/YYYY"
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6} className="d-flex align-items-end">
                    <Form.Check
                      type="checkbox"
                      label={t.current}
                      checked={exp.current}
                      onChange={(e) => updateItem('experience', index, 'current', e.target.checked)}
                      id={`current-${index}`}
                      className="mb-2"
                    />
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.description}</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={exp.description}
                        onChange={(e) => updateItem('experience', index, 'description', e.target.value)}
                        style={{ resize: 'none' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Education */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <GraduationCap className="text-primary" size={20} />
              <h5 className="mb-0 fw-bold text-dark">{t.education}</h5>
            </div>
            <Button
              variant="light"
              className="rounded-circle p-2 text-primary"
              onClick={() => addItem('education')}
            >
              <Plus size={20} />
            </Button>
          </div>
          <div className="d-flex flex-column gap-4">
            {data.education.map((edu, index) => (
              <div key={index} className="p-3 border rounded position-relative">
                <Button
                  variant="link"
                  className="position-absolute top-0 end-0 mt-2 me-2 text-muted p-0"
                  onClick={() => removeItem('education', index)}
                >
                  <Trash2 size={18} />
                </Button>
                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.school}</Form.Label>
                      <Form.Control
                        type="text"
                        value={edu.school}
                        onChange={(e) => updateItem('education', index, 'school', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.degree}</Form.Label>
                      <Form.Control
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateItem('education', index, 'degree', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Row className="g-2">
                      <Col>
                        <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.startDate}</Form.Label>
                        <Form.Control
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => updateItem('education', index, 'startDate', e.target.value)}
                        />
                      </Col>
                      <Col>
                        <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.endDate}</Form.Label>
                        <Form.Control
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => updateItem('education', index, 'endDate', e.target.value)}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Skills & Languages */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2">
                  <Code className="text-primary" size={20} />
                  <h5 className="mb-0 fw-bold text-dark">{t.skills}</h5>
                </div>
                <Button
                  variant="light"
                  className="rounded-circle p-1 text-primary"
                  onClick={() => addItem('skills')}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="d-flex flex-column gap-3">
                {data.skills.map((skill, index) => (
                  <div key={index} className="p-2 border rounded position-relative">
                    <Button
                      variant="link"
                      className="position-absolute top-0 end-0 text-muted p-0 me-1"
                      onClick={() => removeItem('skills', index)}
                    >
                      <Trash2 size={14} className="text-danger" />
                    </Button>
                    <Form.Group className="mb-1">
                      <Form.Control
                        size="sm"
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateItem('skills', index, 'name', e.target.value)}
                        placeholder={t.addSkill}
                        className="bg-light border-0 fw-bold"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Control
                        size="sm"
                        type="text"
                        value={skill.description}
                        onChange={(e) => updateItem('skills', index, 'description', e.target.value)}
                        placeholder={t.skillDescription}
                        className="bg-light border-0"
                      />
                    </Form.Group>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2">
                  <Languages className="text-primary" size={20} />
                  <h5 className="mb-0 fw-bold text-dark">{t.languages}</h5>
                </div>
                <Button
                  variant="light"
                  className="rounded-circle p-1 text-primary"
                  onClick={() => addItem('languages')}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {data.languages.map((langItem, index) => (
                  <InputGroup key={index} size="sm" style={{ width: 'auto' }}>
                    <Form.Control
                      type="text"
                      value={langItem}
                      onChange={(e) => updateItem('languages', index, '', e.target.value)}
                      placeholder="English"
                      className="bg-light border-0"
                      style={{ width: '80px' }}
                    />
                    <Button
                      variant="light"
                      className="border-0"
                      onClick={() => removeItem('languages', index)}
                    >
                      <Trash2 size={14} className="text-danger" />
                    </Button>
                  </InputGroup>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Projects */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <Folder className="text-primary" size={20} />
              <h5 className="mb-0 fw-bold text-dark">{t.projects}</h5>
            </div>
            <Button
              variant="light"
              className="rounded-circle p-2 text-primary"
              onClick={() => addItem('projects')}
            >
              <Plus size={20} />
            </Button>
          </div>
          <div className="d-flex flex-column gap-4">
            {data.projects.map((project, index) => (
              <div key={index} className="p-3 border rounded position-relative">
                <Button
                  variant="link"
                  className="position-absolute top-0 end-0 mt-2 me-2 text-muted p-0"
                  onClick={() => removeItem('projects', index)}
                >
                  <Trash2 size={18} />
                </Button>
                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.projectName}</Form.Label>
                      <Form.Control
                        type="text"
                        value={project.name}
                        onChange={(e) => updateItem('projects', index, 'name', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.link}</Form.Label>
                      <Form.Control
                        type="text"
                        value={project.link}
                        onChange={(e) => updateItem('projects', index, 'link', e.target.value)}
                        placeholder="https://github.com/..."
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase mb-1">{t.description}</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={project.description}
                        onChange={(e) => updateItem('projects', index, 'description', e.target.value)}
                        style={{ resize: 'none' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
