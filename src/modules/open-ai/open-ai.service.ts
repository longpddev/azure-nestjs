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
import { LLMChain } from 'langchain';
import { AiToolsService } from '../ai-tools/ai-tools.service';
import { ConsoleCallbackHandler } from 'langchain/callbacks';
@Injectable()
export class OpenAiService {
  constructor(
    private readonly outputParse: OutputParserService,
    private readonly tools: AiToolsService,
  ) {}
  private _model = new ChatOpenAI({
    temperature: 0,
    maxConcurrency: 3,
  });

  private _memory = new BufferMemory({
    memoryKey: 'chat_history',
    returnMessages: true,
    inputKey: 'input',
    outputKey: 'output',
  });

  private _llm = new LLMChain({
    llm: this._model,
    prompt: this.outputParse.prompt,
  });

  private chatAgent = initializeAgentExecutorWithOptions(
    this.tools.tools,
    this.model,
    {
      agentType: 'chat-zero-shot-react-description',
      returnIntermediateSteps: true,
    },
  );

  private completeAgent = initializeAgentExecutorWithOptions(
    this.tools.tools,
    this.model,
    {
      agentType: 'zero-shot-react-description',
      returnIntermediateSteps: true,
    },
  );

  get model() {
    return this._model;
  }

  public async ask(question: string) {
    console.log(
      '🚀 ~ file: open-ai.service.ts:39 ~ OpenAiService ~ ask ~ question:',
      question,
    );

    const input = await this.outputParse.prompt.format({ input: question });
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

    return await this.outputParse.parserSchema.parse(result.output);
    // return await this.outputParse.fixer(this._model, result.text);
  }

  public async extract(docs: string) {
    console.log(
      '🚀 ~ file: open-ai.service.ts:85 ~ OpenAiService ~ extract ~ docs:',
      docs,
    );
    console.time('extracting');
    const llm = new LLMChain({
      llm: this.model,
      prompt: this.outputParse.extractPrompt,
    });
    const result = await llm.call({ input: docs }, [
      new ConsoleCallbackHandler(),
    ]);
    console.log(
      '🚀 ~ file: open-ai.service.ts:81 ~ OpenAiService ~ extract ~ result:',
      result,
    );
    console.timeEnd('extracting');
    return result.text;
    const fixer = OutputFixingParser.fromLLM(
      this.model,
      this.outputParse.extractParseSchema,
    );
    try {
      const data = await this.outputParse.extractParseSchema.parse(result.text);
      return data;
    } catch (e) {
      console.error(e);
      const data = await fixer.parse(result.text, [
        new ConsoleCallbackHandler(),
      ]);
      return data;
    } finally {
      console.timeEnd('extracting');
    }
  }
}
