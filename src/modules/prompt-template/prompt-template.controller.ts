import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { PromptTemplateService } from './prompt-template.service';
import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ParseDto {
  @ApiProperty()
  @IsString()
  result: string;
}

@Controller('prompt-template')
export class PromptTemplateController {
  constructor(private readonly template: PromptTemplateService) {}

  @Get('/extract')
  async extract(@Query('input', new DefaultValuePipe('')) input: string) {
    const result = await this.template.extract.format({ input });

    return {
      result,
    };
  }

  @Get('/answer')
  async answer() {
    const result = await this.template.answer.format({ input: '' });
    return {
      result,
    };
  }

  @Post('/parse')
  async parse(@Body() body: ParseDto) {
    return body.result;
  }
}
