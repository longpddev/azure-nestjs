import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import {
  StructuredOutputParser,
  OutputFixingParser,
} from 'langchain/output_parsers';
import { z } from 'zod';
import { OutputParserService } from '../output-parser/output-parser.service';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { LLMChain, PromptTemplate } from 'langchain';
import { AiToolsService } from '../ai-tools/ai-tools.service';
import { PromptTemplateService } from '../prompt-template/prompt-template.service';
import { ChainValues } from 'langchain/dist/schema';
import { AiModelService } from '../ai-model/ai-model.service';
@Injectable()
export class OpenAiService {
  constructor(
    private readonly tools: AiToolsService,
    private readonly prompt: PromptTemplateService,
    private readonly model: AiModelService,
  ) {}

  private _memory = new BufferMemory({
    memoryKey: 'chat_history',
    returnMessages: true,
    inputKey: 'input',
    outputKey: 'output',
  });

  private chatAgent = initializeAgentExecutorWithOptions(
    this.tools.tools,
    this.model.openai,
    {
      agentType: 'chat-zero-shot-react-description',
      returnIntermediateSteps: true,
    },
  );

  private completeAgent = initializeAgentExecutorWithOptions(
    this.tools.tools,
    this.model.openai,
    {
      agentType: 'zero-shot-react-description',
      returnIntermediateSteps: true,
    },
  );

  public async ask(question: string) {
    const llm = new LLMChain({
      llm: this.model.openai,
      prompt: this.prompt.answer,
    });

    return await llm.predict({ input: question });
    console.log(
      '🚀 ~ file: open-ai.service.ts:39 ~ OpenAiService ~ ask ~ question:',
      question,
    );

    const input = await this.prompt.answer.format({ input: question });
    console.log(
      '🚀 ~ file: open-ai.service.ts:66 ~ OpenAiService ~ ask ~ input:',
      input,
    );
    const result = await (
      await this.completeAgent
    ).call({
      input,
    });
    console.log(
      '🚀 ~ file: open-ai.service.ts:40 ~ OpenAiService ~ ask ~ result:',
      result,
    );

    return await this.prompt.answerSchema.parse(result.output);
  }

  public async call(template: string, data: ChainValues) {
    const prompt = PromptTemplate.fromTemplate(template);

    const llm = new LLMChain({
      llm: this.model.openai,
      prompt,
    });

    return await llm.predict(data);
  }

  public async extract(docs: string) {
    console.time('extracting');
    const llm = new LLMChain({
      llm: this.model.openai,
      prompt: this.prompt.extract,
    });
    const [result, explainAsIAmFive] = await Promise.all([
      llm.call({ input: docs }),
      this.explainAsIAmFive(docs),
    ]);
    console.log(
      '🚀 ~ file: open-ai.service.ts:81 ~ OpenAiService ~ extract ~ result:',
      result,
    );
    console.timeEnd('extracting');
    return result.text;
  }

  public async explainAsIAmFive(docs: string) {
    const llm = new LLMChain({
      llm: this.model.openai,
      prompt: PromptTemplate.fromTemplate(
        `Explain docs below as I'm five:\n{input}`,
      ),
    });

    return await llm.predict({ input: docs });
  }
}
