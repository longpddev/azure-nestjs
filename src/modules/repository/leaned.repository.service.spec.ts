import { Test, TestingModule } from '@nestjs/testing';
import { LeanedRepositoryService } from './leaned.repository.service';

describe('LeanedRepositoryService', () => {
  let service: LeanedRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeanedRepositoryService],
    }).compile();

    service = module.get<LeanedRepositoryService>(LeanedRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
