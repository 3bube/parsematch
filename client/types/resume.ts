export interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  location?: string;
  graduationDate?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
}

// Add new types for job matching
interface JobCriteria {
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  title: string;
}

interface ResumeMatch extends ResumeData {
  fileName: string;
  matchScore: number;
  skillMatches: {
    matched: string[];
    missing: string[];
  };
}

// Add these to existing exports
export type { JobCriteria, ResumeMatch };
