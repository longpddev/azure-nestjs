import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { OpenAiController } from './open-ai.controller';
import { OutputParserModule } from '../output-parser/output-parser.module';
import { AiToolsModule } from '../ai-tools/ai-tools.module';

@Module({
  providers: [OpenAiService],
  controllers: [OpenAiController],
  imports: [OutputParserModule, AiToolsModule],
})
export class OpenAiModule {}
