import { IsArray, IsString } from 'class-validator';

export class ExtractDocsDto {
  @IsString()
  docs: string;
}

export class KeyValuePairDto {
  @IsString()
  key: string;
  @IsString()
  value: string;
}

export class CallAIDto {
  @IsString()
  template: string;

  @IsArray()
  keyValuePair: KeyValuePairDto[];
}

export class AskAIDto {
  @IsString()
  question: string;
}
