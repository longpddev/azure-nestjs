import { Injectable } from '@nestjs/common';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { BufferMemory } from 'langchain/memory';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { AiToolsService } from '../ai-tools/ai-tools.service';
import { PromptTemplateService } from '../prompt-template/prompt-template.service';
import { ChainValues } from 'langchain/schema';
import { AiModelService } from '../ai-model/ai-model.service';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';

async function requestToBing(input: string): Promise<string> {
  const headers = { 'Ocp-Apim-Subscription-Key': process.env.BingApiKey };
  const params = { q: input, textDecorations: 'true', textFormat: 'HTML' };
  const searchUrl = new URL('https://api.bing.microsoft.com/v7.0/search');

  Object.entries(params).forEach(([key, value]) => {
    searchUrl.searchParams.append(key, value);
  });

  const response = await fetch(searchUrl, { headers });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const res = await response.json();
  const results: [] = res.webPages.value;

  if (results.length === 0) {
    return 'No good results found.';
  }
  const snippets = results
    .map((result: { snippet: string }) => result.snippet)
    .join(' ');

  return snippets;
}

@Injectable()
export class OpenAiService {
  constructor(
    private readonly prompt: PromptTemplateService,
    private readonly model: AiModelService,
  ) {}

  public async ask(question: string) {
    return (await this.model.agent()).run(question);
  }

  public async call(template: string, data: ChainValues) {
    return this.model.agentPrompt(template).predict(data);
  }

  public async extract(docs: string) {
    return this.model.agentPrompt(this.prompt.extract).predict({ input: docs });
  }

  public async explainAsIAmFive(docs: string) {
    return this.model
      .agentPrompt(
        "Explain docs below as I'm five and use markdown format to highlight and breakdown the point:\n{input}\n\n*Explain:",
      )
      .predict({ input: docs });
  }

  public async askBing(question: string) {
    return requestToBing(question);
  }

  public async createQuestionByQuestion(question: string) {
    const schema = StructuredOutputParser.fromZodSchema(
      z
        .array(z.string().describe('suggest question'))
        .describe('array of 5 different suggest questions'),
    );
    const rawAnswer = await this.model
      .getLLM(
        new PromptTemplate({
          template:
            '{schema}\nFollow 5 Ws: Who, What, When, Where, How. Create list of question about: "{input}"\nResponse (JSON):',
          inputVariables: ['input'],
          partialVariables: { schema: schema.getFormatInstructions() },
        }),
      )
      .predict({ input: question });

    const answer = await schema.parse(rawAnswer);
    console.log(
      '🚀 ~ file: open-ai.service.ts:91 ~ OpenAiService ~ research ~ answer:',
      answer,
    );

    return answer;
  }

  public async research(question: string) {
    const answer = await this.createQuestionByQuestion(question);

    const searchs: string[] = [];
    for (const item of [question, ...answer]) {
      searchs.push(await requestToBing(item));
    }

    return this.model
      .getLLM('General takeaways of:\n{input}\nResponse general takeaways:')
      .predict({ input: searchs.join('\n') });
  }
}
