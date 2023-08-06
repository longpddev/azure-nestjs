import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  StructuredOutputParser,
  OutputFixingParser,
} from 'langchain/output_parsers';
import { z } from 'zod';
import { OutputParserService } from '../output-parser/output-parser.service';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { LLMChain } from 'langchain';
@Injectable()
export class OpenAiService {
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

  private _llm: LLMChain<string, ChatOpenAI>;

  constructor(private readonly outputParse: OutputParserService) {
    this._llm = new LLMChain({
      llm: this._model,
      prompt: outputParse.prompt,
    });
  }

  get model() {
    return this._model;
  }

  public async ask(question: string) {
    console.log(
      '🚀 ~ file: open-ai.service.ts:39 ~ OpenAiService ~ ask ~ question:',
      question,
    );
    const result = await this._llm.call({ input: question });
    console.log(
      '🚀 ~ file: open-ai.service.ts:40 ~ OpenAiService ~ ask ~ result:',
      result,
    );
    return await this.outputParse.fixer(this._model, result.text);
  }
}
