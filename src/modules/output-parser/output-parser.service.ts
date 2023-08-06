import { Injectable } from '@nestjs/common';
import { LLMChain, PromptTemplate } from 'langchain';
import { BaseLanguageModel } from 'langchain/base_language';
import { ConsoleCallbackHandler } from 'langchain/callbacks';
import {
  OutputFixingParser,
  StructuredOutputParser,
} from 'langchain/output_parsers';
import { AiAnswerSchema, AiExtractSchema } from 'src/schemas';
import { z } from 'zod';
@Injectable()
export class OutputParserService {
  public readonly parserSchema =
    StructuredOutputParser.fromZodSchema(AiAnswerSchema);

  public readonly extractParseSchema =
    StructuredOutputParser.fromZodSchema(AiExtractSchema);
  get parserSchemaDescription() {
    return this.parserSchema.getFormatInstructions();
  }

  extractPrompt = new PromptTemplate({
    template: `Answer the users question as best as possible.\n{schema}\n<context>{input}</context>`,
    inputVariables: ['input'],
    partialVariables: {
      schema: this.extractParseSchema.getFormatInstructions(),
    },
    outputParser: this.extractParseSchema,
  });

  prompt = new PromptTemplate({
    template:
      'Answer the users question as best as possible.\n{schema}\n{input}',
    inputVariables: ['input'],
    partialVariables: { schema: this.parserSchemaDescription },
    outputParser: this.parserSchema,
  });

  public async fixer(model: BaseLanguageModel, output: string) {
    const fixer = OutputFixingParser.fromLLM(model, this.parserSchema);
    return await fixer.parse(output);
  }

  public async extract(model: BaseLanguageModel, docs: string) {
    console.time('extracting');
    const outputParse = StructuredOutputParser.fromZodSchema(AiExtractSchema);
    const prompt = new PromptTemplate({
      template: `Answer by follow: {schema}\nContext: {input}`,
      inputVariables: ['input'],
      partialVariables: { schema: outputParse.getFormatInstructions() },
    });
    const llm = new LLMChain({
      llm: model,
      prompt,
    });

    const result = await llm.call({ input: docs });
    const fixer = OutputFixingParser.fromLLM(model, outputParse);
    try {
      const data = await outputParse.parse(result.text);
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
