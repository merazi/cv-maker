export interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  link: string;
}

export interface Skill {
  name: string;
  description: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    summary: string;
    photo?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: string[];
  projects: Project[];
  headerColor?: string;
  headerTextColor?: string;
  headerBgColor?: string;
}

export type Language = 'en' | 'es';
