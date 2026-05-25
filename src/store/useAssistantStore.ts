import { create } from 'zustand';
import type { ChatMessage } from '@/types';

interface AssistantState {
  messages: ChatMessage[];
  isTyping: boolean;
  inputValue: string;

  // Actions
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  setInputValue: (value: string) => void;
  clearMessages: () => void;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hello! I'm **AGRIMIND Assistant**, your intelligent farming assistant. I can help you with crop disease analysis, sensor data interpretation, weather insights, chemical recommendations, and sustainability strategies.\n\nTry asking me something like:\n- \"Why are my tomato leaves turning yellow?\"\n- \"What's the best organic treatment for early blight?\"\n- \"How can I reduce water usage by 20%?\"",
  timestamp: new Date(),
};

export const useAssistantStore = create<AssistantState>((set) => ({
  messages: [WELCOME_MESSAGE],
  isTyping: false,
  inputValue: '',

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setTyping: (isTyping) => set({ isTyping }),

  setInputValue: (inputValue) => set({ inputValue }),

  clearMessages: () => set({ messages: [WELCOME_MESSAGE] }),
}));
