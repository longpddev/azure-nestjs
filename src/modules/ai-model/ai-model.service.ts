import { Injectable } from '@nestjs/common';
import { LLMChain, PromptTemplate } from 'langchain';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { ChainValues, SystemMessage } from 'langchain/schema';
import { AiToolsService } from '../ai-tools/ai-tools.service';
import { ChainInputs } from 'langchain/chains';
import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';

@Injectable()
export class AiModelService {
  constructor(private readonly tools: AiToolsService) {}
  public readonly openai = new ChatOpenAI({
    temperature: 0.75,
    maxConcurrency: 10,
    timeout: 60000,
  });

  public readonly openaiConsistent = new ChatOpenAI({
    temperature: 0,
    maxConcurrency: 10,
    timeout: 60000,
  });

  createMemory(systemPrompt = 'Answer as best as possible') {
    return new BufferMemory({
      memoryKey: 'chat_history',
      returnMessages: true,
      inputKey: 'input',
      outputKey: 'output',
      chatHistory: new ChatMessageHistory([new SystemMessage(systemPrompt)]),
    });
  }

  public getLLM(
    prompt: PromptTemplate | string = '{input}',
    systemPrompt?: string,
  ) {
    const promptTemplate =
      typeof prompt === 'string' ? PromptTemplate.fromTemplate(prompt) : prompt;
    console.log(
      '🚀 ~ file: ai-model.service.ts:20 ~ AiModelService ~ promptTemplate:',
      promptTemplate,
    );
    return new LLMChain({
      llm: this.openai,
      prompt: promptTemplate,
      outputKey: 'output',
      memory: this.createMemory(systemPrompt),
    });
  }

  public async agent(systemPrompt?: string) {
    return await initializeAgentExecutorWithOptions(
      this.tools.tools,
      this.openai,
      {
        memory: this.createMemory(systemPrompt),
        agentType: 'openai-functions',
      },
    );
  }

  public async agentTest() {
    return await initializeAgentExecutorWithOptions(
      [
        new DynamicStructuredTool({
          name: 'predictUserIntent',
          description: 'always use.',
          returnDirect: true,

          schema: z.object({
            question: z.string().describe('user question'),
          }),
          func({ question }) {
            return Promise.resolve(JSON.stringify({ question }));
          },
        }),
      ],
      this.openaiConsistent,
      {
        memory: this.createMemory(
          `You are financial assistance. And you just assist financial topic. otherwise call function predictUserIntent.`,
        ),
        agentType: 'openai-functions',
      },
    );
  }

  public agentPrompt(
    prompt: PromptTemplate | string = '{input}',
    systemPrompt?: string,
  ) {
    const promptTemplate =
      typeof prompt === 'string' ? PromptTemplate.fromTemplate(prompt) : prompt;

    return {
      predict: async (input: ChainValues) => {
        const executor = await this.agent(systemPrompt);

        const question = await promptTemplate.format(input);
        const answer = await executor.run(question);
        const outputParser = promptTemplate.outputParser;
        if (outputParser) {
          return (await outputParser.parse(answer)) as string;
        }

        return answer;
      },
    };
  }
}
