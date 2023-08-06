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
    summarize: z.string().describe('summarize context'),
    topics: z
      .array(z.string().describe('topic in context'))
      .describe('array of topics in context'),
    suggests: z.array(
      z
        .object({
          question: z
            .string()
            .nonempty()
            .describe('Questions should be specific and not too general'),
          topic: z.string().describe('topic this question relative to'),
        })
        .describe('array of suggest question base on context'),
    ),
    generalTakeaways: z.string().describe('General takeaways of context'),
  })
  .describe('Each attribute is independent and unrelated to each other');

export type IAiAnswer = z.infer<typeof AiAnswerSchema>;
