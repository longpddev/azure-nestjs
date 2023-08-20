import { Test, TestingModule } from '@nestjs/testing';
import { EnglishPracticeController } from './english-practice.controller';

describe('EnglishPracticeController', () => {
  let controller: EnglishPracticeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnglishPracticeController],
    }).compile();

    controller = module.get<EnglishPracticeController>(EnglishPracticeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
