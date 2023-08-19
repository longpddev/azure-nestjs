import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  Post,
  Query,
} from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { AskAIDto, CallAIDto, ExtractDocsDto } from './dto/open-ai.dto';

@Controller('open-ai')
export class OpenAiController {
  constructor(private readonly aiService: OpenAiService) {}
  @Get('/ask')
  async ask(@Query('message') message: string) {
    if (!message) throw new NotAcceptableException('message is not empty');
    return await this.aiService.ask(message);
  }

  @Get('test')
  async test(@Query('question') question: string) {
    return this.aiService.createQuestionByQuestion(question);
  }

  @Get('/ask-bing')
  async askBing(@Query('question') question: string) {
    return this.aiService.askBing(question);
  }

  @Get('/research')
  async research(@Query('question') question: string) {
    return this.aiService.research(question);
  }

  @Post('/extract')
  async extract(@Body() body: ExtractDocsDto) {
    return await this.aiService.extract(body.docs);
  }

  @Post('/call-ai')
  async callAi(@Body() body: CallAIDto) {
    const chainValues = body.keyValuePair.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);
    const result = await this.aiService.call(body.template, chainValues);
    return { result };
  }

  @Post('/ask-ai')
  async askAi(@Body() body: AskAIDto) {
    const result = await this.aiService.ask(body.question);
    return { result };
  }

  @Post('/simple-explain')
  async simpleExplain(@Body() body: ExtractDocsDto) {
    const result = await this.aiService.explainAsIAmFive(body.docs);

    return { result };
  }
}
