import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { OpenAiController } from './open-ai.controller';
import { OutputParserModule } from '../output-parser/output-parser.module';

@Module({
  providers: [OpenAiService],
  controllers: [OpenAiController],
  imports: [OutputParserModule],
})
export class OpenAiModule {}
