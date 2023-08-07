import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { OpenAiController } from './open-ai.controller';
import { OutputParserModule } from '../output-parser/output-parser.module';
import { AiToolsModule } from '../ai-tools/ai-tools.module';
import { PromptTemplateModule } from '../prompt-template/prompt-template.module';
import { AiModelModule } from '../ai-model/ai-model.module';

@Module({
  providers: [OpenAiService],
  controllers: [OpenAiController],
  imports: [
    OutputParserModule,
    AiToolsModule,
    PromptTemplateModule,
    AiModelModule,
  ],
})
export class OpenAiModule {}
