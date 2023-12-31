import { Test, TestingModule } from '@nestjs/testing';
import { PromptTemplateService } from './prompt-template.service';
import { AiModelModule } from '../ai-model/ai-model.module';
import { ConfigModule } from '@nestjs/config';

describe('PromptTemplateService', () => {
  let service: PromptTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromptTemplateService],
      imports: [AiModelModule, ConfigModule.forRoot()],
    }).compile();

    service = module.get<PromptTemplateService>(PromptTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
