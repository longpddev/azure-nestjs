import { Injectable } from '@nestjs/common';
import { LLMChain, PromptTemplate } from 'langchain';
import { BaseLanguageModel } from 'langchain/dist/base_language';
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

  get parserSchemaDescription() {
    return this.parserSchema.getFormatInstructions();
  }

  get prompt() {
    return new PromptTemplate({
      template:
        'Answer the users question as best as possible.\n{schema}\n{input}',
      inputVariables: ['input'],
      partialVariables: { schema: this.parserSchemaDescription },
    });
  }

  public async fixer(model: BaseLanguageModel, output: string) {
    const fixer = OutputFixingParser.fromLLM(model, this.parserSchema);
    return await fixer.parse(output);
  }

  public async extract(model: BaseLanguageModel, docs: string) {
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
    return await fixer.parse(result.text);
  }
}
