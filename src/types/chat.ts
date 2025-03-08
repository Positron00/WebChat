export type Role = 'user' | 'assistant';

export interface Source {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
  relevance?: number; // 0-1 score of relevance
  domain?: string;
}

export interface ChatMessage {
  role: Role;
  content: string;
  sources?: Source[]; // Sources used for this message
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
} 