import { IsString } from 'class-validator';

export class ExtractDocsDto {
  @IsString()
  docs: string;
}
