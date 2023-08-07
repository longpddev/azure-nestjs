import { Injectable } from '@nestjs/common';
import { PromptTemplate } from 'langchain';
import {
  OutputFixingParser,
  StructuredOutputParser,
} from 'langchain/output_parsers';
import { AiAnswerSchema, AiExtractSchema } from 'src/schemas';
import { AiModelService } from '../ai-model/ai-model.service';

@Injectable()
export class PromptTemplateService {
  constructor(private readonly model: AiModelService) {}
  public readonly extractSchema =
    StructuredOutputParser.fromZodSchema(AiExtractSchema);
  public readonly answerSchema =
    StructuredOutputParser.fromZodSchema(AiAnswerSchema);
  public readonly answer = new PromptTemplate({
    template:
      'Answer the users question as best as possible.\n{schema}\n{input}',
    inputVariables: ['input'],
    partialVariables: { schema: this.answerSchema.getFormatInstructions() },
    outputParser: OutputFixingParser.fromLLM(
      this.model.openai,
      this.answerSchema,
    ),
  });
  public readonly extract = new PromptTemplate({
    template: `Extract information in side context by follow JSON schema below.\n{schema}\n------CONTEXT------\n{input}`,
    inputVariables: ['input'],
    partialVariables: {
      schema: this.extractSchema.getFormatInstructions(),
    },
    outputParser: OutputFixingParser.fromLLM(
      this.model.openai,
      this.extractSchema,
    ),
  });
}
