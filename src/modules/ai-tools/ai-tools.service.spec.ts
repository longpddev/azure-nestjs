import { Test, TestingModule } from '@nestjs/testing';
import { AiToolsService } from './ai-tools.service';
import { ConfigModule } from '@nestjs/config';

describe('AiToolsService', () => {
  let service: AiToolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiToolsService],
      imports: [ConfigModule.forRoot()],
    }).compile();

    service = module.get<AiToolsService>(AiToolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
