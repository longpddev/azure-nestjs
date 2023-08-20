import { Module } from '@nestjs/common';
import { EnglishPracticeController } from './english-practice.controller';
import { AiModelModule } from '../ai-model/ai-model.module';

@Module({
  controllers: [EnglishPracticeController],
  imports: [AiModelModule],
})
export class EnglishPracticeModule {}
