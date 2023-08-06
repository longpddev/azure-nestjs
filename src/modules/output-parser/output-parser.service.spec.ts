import { Test, TestingModule } from '@nestjs/testing';
import { OutputParserService } from './output-parser.service';

describe('OutputParserService', () => {
  let service: OutputParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutputParserService],
    }).compile();

    service = module.get<OutputParserService>(OutputParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
