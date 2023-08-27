import { Module } from '@nestjs/common';
import { VocabularyRepositoryService } from './vocabulary.repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vocabulary, VocabularySchema } from './schemas/vocabulary.schema';
import { Learned, LearnedSchema } from './schemas/learned.schema';
import { LeanedRepositoryService } from './leaned.repository.service';

const repositories = [VocabularyRepositoryService, LeanedRepositoryService];

@Module({
  providers: repositories,
  exports: repositories,
  imports: [
    MongooseModule.forFeature([
      { name: Vocabulary.name, schema: VocabularySchema },
      { name: Learned.name, schema: LearnedSchema },
    ]),
  ],
})
export class RepositoryModule {}
