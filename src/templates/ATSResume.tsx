import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import type { ResumeData, Language } from '../types/resume';
import { translations } from '../i18n/translations';

// Register standard fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Oblique.ttf', fontStyle: 'italic' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginLeft: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  contact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    color: '#666',
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
    paddingBottom: 2,
  },
  item: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 11,
    color: '#000',
  },
  itemSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontStyle: 'italic',
    color: '#444',
    marginBottom: 3,
  },
  description: {
    textAlign: 'justify',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillItem: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 3,
    width: '48%',
  },
  skillName: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#000',
  },
  skillDesc: {
    fontSize: 9,
    color: '#666',
  }
});

interface Props {
  data: ResumeData;
  lang: Language;
}

export const ATSResume = ({ data, lang }: Props) => {
  const t = translations[lang];
  const headerColor = data.headerColor || '#000';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerContent, { borderBottomColor: headerColor }]}>
            <Text style={[styles.name, { color: headerColor }]}>{data.personalInfo.fullName}</Text>
            <View style={styles.contact}>
              {data.personalInfo.email && <Text>{data.personalInfo.email}</Text>}
              {data.personalInfo.phone && <Text>{data.personalInfo.phone}</Text>}
              {data.personalInfo.location && <Text>{data.personalInfo.location}</Text>}
              {data.personalInfo.website && <Text>{data.personalInfo.website}</Text>}
              {data.personalInfo.linkedin && <Text>{data.personalInfo.linkedin}</Text>}
            </View>
          </View>
          {data.personalInfo.photo && (
            <Image src={data.personalInfo.photo} style={styles.photo} />
          )}
        </View>

        {/* Summary */}
        {data.personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.summary}</Text>
            <Text style={styles.description}>{data.personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.experience}</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text>{exp.position}</Text>
                  <Text>{exp.startDate} - {exp.current ? (lang === 'en' ? 'Present' : 'Presente') : exp.endDate}</Text>
                </View>
                <View style={styles.itemSubHeader}>
                  <Text>{exp.company}</Text>
                  <Text>{exp.location}</Text>
                </View>
                <Text style={styles.description}>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.education}</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text>{edu.degree}</Text>
                  <Text>{edu.startDate} - {edu.endDate}</Text>
                </View>
                <View style={styles.itemSubHeader}>
                  <Text>{edu.school}</Text>
                  <Text>{edu.location}</Text>
                </View>
                {edu.description && <Text style={styles.description}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.skills}</Text>
            <View style={styles.skillsGrid}>
              {data.skills.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  {skill.description && <Text style={styles.skillDesc}>{skill.description}</Text>}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.projects}</Text>
            {data.projects.map((project, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text>{project.name}</Text>
                  {project.link && <Text>{project.link}</Text>}
                </View>
                <Text style={styles.description}>{project.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.languages}</Text>
            <View style={styles.skillsGrid}>
              {data.languages.map((langItem, index) => (
                <View key={index} style={[styles.skillItem, { width: 'auto' }]}>
                  <Text>{langItem}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};
