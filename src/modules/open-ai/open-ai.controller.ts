import {
  Controller,
  Get,
  NotAcceptableException,
  Param,
  Query,
} from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { OutputParserService } from '../output-parser/output-parser.service';

@Controller('open-ai')
export class OpenAiController {
  constructor(
    private readonly aiService: OpenAiService,
    private readonly outputParse: OutputParserService,
  ) {}
  @Get('/ask')
  async ask(@Query('message') message: string) {
    if (!message) throw new NotAcceptableException('message is not empty');
    const airesponse = await this.aiService.ask(message);

    const answer = airesponse.answer;
    let extract;
    if (answer) {
      extract = await this.outputParse.extract(this.aiService.model, answer);
    }
    return {
      ...airesponse,
      ...extract,
    };
  }
}
