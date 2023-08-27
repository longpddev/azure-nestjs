export interface WritingQuestion {
  question: string;
  words: Array<{id: string, word: string, description: string}>;
  tense: string;
}

export interface WritingQuestionAnswer extends Omit<WritingQuestion, 'words'> {
  answer: string,
  words: string[]
}
