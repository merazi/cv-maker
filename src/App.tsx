import { useState, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { ResumeForm } from './components/ResumeForm';
import { ATSResume } from './templates/ATSResume';
import { ATSScorecard } from './components/ATSScorecard';
import type { ResumeData, Language } from './types/resume';
import { FileText, Download, Eye, Edit3 } from 'lucide-react';
import { translations } from './i18n/translations';
import { Container, Navbar, Nav, Button, Row, Col, Card, ButtonGroup } from 'react-bootstrap';

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
            <ResumeForm data={data} setData={setData} lang={lang} setLang={setLang} />
          </Col>

          {/* Preview Section */}
          <Col lg={6} className={`${view === 'preview' ? 'd-block' : 'd-none'} d-lg-block`}>
            <div className="sticky-top d-flex flex-column gap-3" style={{ top: '5rem', height: 'calc(100vh - 8rem)' }}>
              <ATSScorecard data={data} lang={lang} />
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
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
