import { Module } from '@nestjs/common';
import { OutputParserService } from './output-parser.service';

@Module({
  providers: [OutputParserService],
  exports: [OutputParserService],
})
export class OutputParserModule {}
