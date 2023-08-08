import { Test, TestingModule } from '@nestjs/testing';
import { PromptTemplateController } from './prompt-template.controller';
import { AiModelModule } from '../ai-model/ai-model.module';
import { ConfigModule } from '@nestjs/config';
import { PromptTemplateService } from './prompt-template.service';

describe('PromptTemplateController', () => {
  let controller: PromptTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromptTemplateController],
      providers: [PromptTemplateService],
      imports: [AiModelModule, ConfigModule.forRoot()],
    }).compile();

    controller = module.get<PromptTemplateController>(PromptTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
