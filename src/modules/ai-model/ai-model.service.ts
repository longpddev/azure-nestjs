import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';

@Injectable()
export class AiModelService {
  public readonly openai = new ChatOpenAI({
    temperature: 0,
    maxConcurrency: 5,
  });
}
