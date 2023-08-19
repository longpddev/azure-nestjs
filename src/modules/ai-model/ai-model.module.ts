import { Module } from '@nestjs/common';
import { AiModelService } from './ai-model.service';
import { AiToolsModule } from '../ai-tools/ai-tools.module';

@Module({
  providers: [AiModelService],
  exports: [AiModelService],
  imports: [AiToolsModule],
})
export class AiModelModule {}
