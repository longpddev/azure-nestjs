import { z } from 'zod';

export const AiAnswerSchema = z
  .object({
    helpful: z.number().describe('number 0 - 100 helpful for user'),
    answer: z.string().describe('your fully response of question'),
    thoughts: z
      .array(
        z.object({
          thought: z.string().describe('your thought'),
        }),
      )
      .describe('array of thought to solve the problem before you answer.'),
  })
  .describe('Each attribute is independent and unrelated to each other');

export const AiExtractSchema = z
  .object({
    keywords: z
      .array(z.string().describe('keyword in context'))
      .describe('array of keywords'),
    summarize: z
      .string()
      .describe('summarize and condense the given context with 10 - 60 words.'),
    topics: z
      .array(z.string().describe('topic in context'))
      .describe('array of topics in context'),
    suggests: z.array(
      z
        .object({
          question: z
            .string()
            .describe('Should be wise question and not too general'),
          topic: z.string().describe('topic of this wise question relative to'),
        })
        .describe(
          'Array of wise question. Wise questions often challenge assumptions, encourage critical thinking, and open up new perspectives. They can inspire introspection, spark intellectual curiosity, and promote thoughtful discussions. The exact nature of a wise question can vary depending on the context and the subject matter being explored.',
        ),
    ),
    generalTakeaways: z.string().describe('General takeaways of context'),
  })
  .describe('Each attribute is independent and unrelated to each other');

export type IAiAnswer = z.infer<typeof AiAnswerSchema>;
