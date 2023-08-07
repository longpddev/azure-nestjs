import { Module } from '@nestjs/common';
import { PromptTemplateService } from './prompt-template.service';
import { AiModelModule } from '../ai-model/ai-model.module';

@Module({
  providers: [PromptTemplateService],
  exports: [PromptTemplateService],
  imports: [AiModelModule],
})
export class PromptTemplateModule {}
