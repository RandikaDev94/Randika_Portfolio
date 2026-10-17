export interface CertificateItem {
  id?: string;
  title: string;
  issuer: string;
  year: string;
  category: "Educational Qualification" | "Other Qualification" | "Service Letter";
  file: string;
  createdAt?: number;
}

export interface ExperienceItem {
  id?: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  order?: number;
  createdAt?: number;
}

export interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  year: string;
  order?: number;
  createdAt?: number;
}

export interface ProjectItem {
  id?: string;
  title: string;
  tech: string[];
  description: string;
  liveUrl?: string;
  githubUrl?: string;
  image?: string;
  order?: number;
  createdAt?: number;
}
