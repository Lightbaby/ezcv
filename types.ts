export type Language = 'en' | 'zh';

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'backend' | 'design' | 'tools';
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  year: number;
  description: string;
  achievements: string[];
  techStack: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: number;
  period: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  link?: string;
}

export interface Profile {
  name: string;
  title: string;
  level: number; // Years of experience
  bio: string;
  contact: {
    email: string;
    github: string;
    linkedin: string;
    phone?: string;
    location?: string;
  };
  stats: {
    intelligence: number;
    creativity: number;
    endurance: number;
    charisma: number;
    agility: number;
    luck: number;
  };
}

export enum TabView {
  STATS = 'STATS',
  TIMELINE = 'TIMELINE',
  EDUCATION = 'EDUCATION',
  PROJECTS = 'PROJECTS',
}

export interface AppConfig {
  modules: TabView[]; // Ordered list of visible modules
  hiddenModules: TabView[]; // List of hidden modules
}

export interface ResumeData {
  profile: Profile;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  config: AppConfig;
}
