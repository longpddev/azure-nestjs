import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppStatus } from '../../constants';
import {WritingQuestion} from '../../interfaces';

interface LearnEnglishStatus {
  question: AppStatus;
  answer: 'typing' | 'submit' | AppStatus;
  evaluate: AppStatus;
}

interface EnglishSentenceStore {
  question: WritingQuestion | undefined;
  progress: LearnEnglishStatus;
  evaluate: string;
  setQuestion: (q: WritingQuestion) => void;
  answer: string;
  setAnswer: (str: string) => void;
  setEvaluate: (str: string) => void;
  setProgress: (status: Partial<LearnEnglishStatus>) => void;
  reset: (types: Array<'question' | 'answer' | "evaluate">) => void
}

export const useEnglishSentenceStore = create(
  persist<EnglishSentenceStore>(
    (set, get) => ({
      question: undefined,
      progress: {
        question: 'initialized',
        evaluate: 'initialized',
        answer: 'initialized',
      },
      answer: '',
      evaluate: '',
      reset(types) {
        const state = get()
        for(const type of types) {
          switch (type) {
            case 'answer':
              set({answer: ''})
              state.setProgress({answer: 'initialized'})
              break;
            case 'question':
              set({question: undefined})
              state.setProgress({question: 'initialized'})
              break;
            case 'evaluate':
              set({evaluate: ''})
              state.setProgress({evaluate: 'initialized'})
              break;
          }
        }
      },
      setProgress(status) {
        set({
          progress: {
            ...get().progress,
            ...status,
          },
        });
      },
      setAnswer(str) {
        set({ answer: str, progress: { ...get().progress, answer: 'typing' } });
      },
      setQuestion(q) {
        set({ question: q });
      },
      setEvaluate(e) {
        set({ evaluate: e });
      },
    }),
    { name: 'useEnglishSentenceStore' },
  ),
);
