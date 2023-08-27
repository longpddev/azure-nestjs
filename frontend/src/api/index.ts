import { WritingQuestion, WritingQuestionAnswer } from '../interfaces';
import client from './client';
import { OpenAIAskRes, OpenAIExtractDocs } from './interface';

export async function ask(docs: string) {
  const result = await client.get<OpenAIAskRes>('/open-ai/ask', {
    params: {
      message: docs,
    },
  });

  return result.data;
}

export async function extract(docs: string) {
  const result = await client.post<OpenAIExtractDocs>('/open-ai/extract', {
    docs,
  });

  return result.data;
}

export async function callAi(template: string, data: Record<string, string>) {
  const result = await client.post<{ result: string }>('/open-ai/call-ai', {
    template,
    keyValuePair: Object.entries(data).map(([key, value]) => ({ key, value })),
  });

  return result.data.result;
}

export async function askAI(question: string) {
  const result = await client.post<{ result: string }>('/open-ai/ask-ai', {
    question,
  });

  return result.data.result;
}

export async function simpleExplain(docs: string) {
  const result = await client.post<{ result: string }>(
    '/open-ai/simple-explain',
    {
      docs,
    },
  );

  return result.data.result;
}

export async function englishExercise() {
  return (await client.get<string>('/english-practice/exercise')).data;
}

export async function englishSentenceWriting() {
  return (
    await client.get<WritingQuestion>('/english-practice/sentence/writing')
  ).data;
}

export async function englishSentenceWritingAnswer(
  data: WritingQuestionAnswer,
) {
  return await client.post('/english-practice/sentence/writing/answer', {
    ...data,
  });
}

export async function englishCheck(question: string, answer: string) {
  return (
    await client.post<string>('/english-practice/evaluate', {
      question,
      answer,
    })
  ).data;
}
