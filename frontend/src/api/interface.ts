export interface OpenAIAskRes {
  helpful: number,
  answer: string,
  thoughts: Array<{ thought: string }>
}

export interface OpenAISuggest {
  question: string,
  topic: string
}

export interface OpenAIExtractDocs {
  keywords: string[],
  summarize: string,
  topics: string[],
  suggests: OpenAISuggest[],
  generalTakeaways: string
}