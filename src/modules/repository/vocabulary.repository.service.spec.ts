import { Test, TestingModule } from '@nestjs/testing';
import { VocabularyRepositoryService } from './vocabulary.repository.service';

describe('VocabularyRepositoryService', () => {
  let service: VocabularyRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VocabularyRepositoryService],
    }).compile();

    service = module.get<VocabularyRepositoryService>(VocabularyRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
