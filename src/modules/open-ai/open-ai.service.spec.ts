import { Test, TestingModule } from '@nestjs/testing';
import { OpenAiService } from './open-ai.service';
import { OutputParserModule } from '../output-parser/output-parser.module';
import { AiToolsModule } from '../ai-tools/ai-tools.module';
import { PromptTemplateModule } from '../prompt-template/prompt-template.module';
import { AiModelModule } from '../ai-model/ai-model.module';
import { ConfigModule } from '@nestjs/config';

describe('OpenAiService', () => {
  let service: OpenAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenAiService],
      imports: [
        OutputParserModule,
        AiToolsModule,
        PromptTemplateModule,
        AiModelModule,
        ConfigModule.forRoot(),
      ],
    }).compile();

    service = module.get<OpenAiService>(OpenAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
