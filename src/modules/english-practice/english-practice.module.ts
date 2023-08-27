import { Module } from '@nestjs/common';
import { EnglishPracticeController } from './english-practice.controller';
import { AiModelModule } from '../ai-model/ai-model.module';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  controllers: [EnglishPracticeController],
  imports: [AiModelModule, RepositoryModule],
})
export class EnglishPracticeModule {}
