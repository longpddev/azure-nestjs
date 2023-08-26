import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
  }

  @Get('/learn-english')
  async learnEnglish() {
    return this.appService.getHello();
  }

  @Get('/sentence-writing')
  async sentenceWriting() {
    return this.appService.getHello();
  }
}
