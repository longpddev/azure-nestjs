import { Test, TestingModule } from '@nestjs/testing';
import { OpenAiController } from './open-ai.controller';
import { OutputParserModule } from '../output-parser/output-parser.module';
import { AiToolsModule } from '../ai-tools/ai-tools.module';
import { PromptTemplateModule } from '../prompt-template/prompt-template.module';
import { AiModelModule } from '../ai-model/ai-model.module';
import { ConfigModule } from '@nestjs/config';
import { OpenAiService } from './open-ai.service';

describe('OpenAiController', () => {
  let controller: OpenAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenAiController],
      providers: [OpenAiService],
      imports: [
        OutputParserModule,
        AiToolsModule,
        PromptTemplateModule,
        AiModelModule,
        ConfigModule.forRoot(),
      ],
    }).compile();

    controller = module.get<OpenAiController>(OpenAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
