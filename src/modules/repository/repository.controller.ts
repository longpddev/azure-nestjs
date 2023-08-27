import { Controller, Get } from '@nestjs/common';
import { VocabularyRepositoryService } from './vocabulary.repository.service';
import { COMMON_VOCABULARY } from '../english-practice/constant';

@Controller('repository')
export class RepositoryController {
  constructor(
    private readonly vocabularyRepository: VocabularyRepositoryService,
  ) {}
  @Get('feed')
  async feed() {
    return this.vocabularyRepository.feedVocabulary(
      COMMON_VOCABULARY.map((item) => ({ name: item })),
    );
  }
}
