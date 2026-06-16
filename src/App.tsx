import { useState, useEffect, useRef } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { ResumeForm } from './components/ResumeForm';
import { ATSResume } from './templates/ATSResume';
import { ATSScorecard } from './components/ATSScorecard';
import type { ResumeData, Language } from './types/resume';
import { FileText, Download, Eye, Edit3, GitBranch, Info, Globe, Upload, FileJson } from 'lucide-react';
import { translations } from './i18n/translations';
import { Container, Navbar, Nav, Button, Row, Col, Card, ButtonGroup, Form } from 'react-bootstrap';

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    summary: '',
    showPhoto: true,
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  headerColor: '#000000',
  headerTextColor: '#000000',
  headerBgColor: '#ffffff',
};

function App() {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resume-data');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const t = translations[lang];
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = `resume_${data.personalInfo.fullName.replace(/\s+/g, '_') || 'data'}.json`;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as ResumeData;
        if (!parsed.personalInfo) throw new Error('Invalid structure');
        setData(parsed);
      } catch {
        alert(t.importJsonError);
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-imported
    e.target.value = '';
  };

  useEffect(() => {
    localStorage.setItem('resume-data', JSON.stringify(data));
  }, [data]);

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <Navbar bg="white" expand="lg" sticky="top" className="border-bottom shadow-sm px-3 py-2">
        <Container fluid>
          <Navbar.Brand className="d-flex align-items-center gap-2">
            <div className="bg-primary p-2 rounded text-white d-flex align-items-center justify-content-center">
              <FileText size={24} />
            </div>
            <span className="fw-bold d-none d-sm-inline">{t.title}</span>
          </Navbar.Brand>

          <Nav className="me-auto d-none d-md-flex align-items-center gap-3 ms-3 ps-3 border-start">
            <Nav.Link
              href="https://github.com/merazi/cv-maker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary d-flex align-items-center gap-1.5 small"
            >
              <GitBranch size={16} />
              <span>GitHub</span>
            </Nav.Link>
            <Nav.Link
              href={lang === 'es' ? 'https://es.wikipedia.org/wiki/Sistema_de_seguimiento_de_candidatos' : 'https://en.wikipedia.org/wiki/Applicant_tracking_system'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary d-flex align-items-center gap-1.5 small"
            >
              <Info size={16} />
              <span>{t.whatIsAts}</span>
            </Nav.Link>

            <div className="d-flex align-items-center gap-2 ms-2 ps-3 border-start">
              <Globe size={16} className="text-secondary" />
              <Form.Select
                size="sm"
                className="bg-transparent border-0 text-secondary fw-medium small"
                style={{ width: 'auto', paddingRight: '1.5rem', cursor: 'pointer' }}
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
              </Form.Select>
            </div>
          </Nav>

          <Nav className="ms-auto d-flex flex-row align-items-center gap-2">
            {/* Mobile Toggle */}
            <ButtonGroup className="d-sm-none me-2">
              <Button
                variant={view === 'edit' ? 'primary' : 'outline-secondary'}
                onClick={() => setView('edit')}
                size="sm"
              >
                <Edit3 size={18} />
              </Button>
              <Button
                variant={view === 'preview' ? 'primary' : 'outline-secondary'}
                onClick={() => setView('preview')}
                size="sm"
              >
                <Eye size={18} />
              </Button>
            </ButtonGroup>

            {/* JSON Import */}
            <input
              ref={importInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportJson}
              style={{ display: 'none' }}
              id="json-import-input"
            />
            <Button
              variant="outline-secondary"
              className="d-flex align-items-center gap-2 fw-semibold"
              onClick={() => importInputRef.current?.click()}
              title={t.importJson}
            >
              <Upload size={18} />
              <span className="d-none d-md-inline">{t.importJson}</span>
            </Button>

            {/* JSON Export */}
            <Button
              variant="outline-secondary"
              className="d-flex align-items-center gap-2 fw-semibold"
              onClick={handleExportJson}
              title={t.exportJson}
            >
              <FileJson size={18} />
              <span className="d-none d-md-inline">{t.exportJson}</span>
            </Button>

            <PDFDownloadLink
              document={<ATSResume data={data} lang={lang} />}
              fileName={`resume_${data.personalInfo.fullName.replace(/\s+/g, '_') || 'generator'}.pdf`}
            >
              {({ loading }) => (
                <Button variant="primary" className="d-flex align-items-center gap-2 fw-semibold shadow-sm">
                  <Download size={18} />
                  <span className="d-none d-sm-inline">{loading ? '...' : t.download}</span>
                </Button>
              )}
            </PDFDownloadLink>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid="xl" className="py-4 py-md-5">
        <Row className="g-4">
          {/* Form Section */}
          <Col lg={6} className={`${view === 'edit' ? 'd-block' : 'd-none'} d-lg-block`}>
            <ResumeForm data={data} setData={setData} lang={lang} />
          </Col>

          {/* Preview Section */}
          <Col lg={6} className={`${view === 'preview' ? 'd-block' : 'd-none'} d-lg-block`}>
            <div className="sticky-top d-flex flex-column gap-3" style={{ top: '5rem', height: 'calc(125vh - 10rem)' }}>
              <Card className="shadow flex-grow-1 overflow-hidden">
                <Card.Header className="bg-light d-flex justify-content-between align-items-center py-2 px-3">
                  <span className="text-muted small fw-bold text-uppercase tracking-wider">{t.preview}</span>
                </Card.Header>
                <Card.Body className="p-0 bg-secondary bg-opacity-10 overflow-hidden">
                  <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: 'none' }}>
                    <ATSResume data={data} lang={lang} />
                  </PDFViewer>
                </Card.Body>
              </Card>
              <ATSScorecard data={data} lang={lang} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
