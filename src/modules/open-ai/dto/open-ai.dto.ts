import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class ExtractDocsDto {
  @ApiProperty()
  @IsString()
  docs: string;
}

export class KeyValuePairDto {
  @ApiProperty()
  @IsString()
  key: string;
  @ApiProperty()
  @IsString()
  value: string;
}

export class CallAIDto {
  @ApiProperty()
  @IsString()
  template: string;

  @ApiProperty()
  @IsArray()
  keyValuePair: KeyValuePairDto[];
}

export class AskAIDto {
  @IsString()
  question: string;
}
