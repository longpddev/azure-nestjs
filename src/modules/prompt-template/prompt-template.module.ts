import { Module } from '@nestjs/common';
import { PromptTemplateService } from './prompt-template.service';
import { AiModelModule } from '../ai-model/ai-model.module';
import { PromptTemplateController } from './prompt-template.controller';

@Module({
  providers: [PromptTemplateService],
  exports: [PromptTemplateService],
  imports: [AiModelModule],
  controllers: [PromptTemplateController],
})
export class PromptTemplateModule {}
