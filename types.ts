export interface ProjectFile {
  name: string;
  content: string;
  language: 'html' | 'css' | 'javascript' | 'json' | 'text';
}

export interface Project {
  id: string;
  name: string;
  files: ProjectFile[];
  domain?: string;
  status: 'draft' | 'published';
  lastModified: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
  DOMAINS = 'DOMAINS',
}
