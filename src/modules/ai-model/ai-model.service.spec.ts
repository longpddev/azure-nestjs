import { Test, TestingModule } from '@nestjs/testing';
import { AiModelService } from './ai-model.service';
import { ConfigModule } from '@nestjs/config';

describe('AiModelService', () => {
  let service: AiModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiModelService],
      imports: [ConfigModule.forRoot()],
    }).compile();

    service = module.get<AiModelService>(AiModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
