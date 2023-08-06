import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OpenAiModule } from './modules/open-ai/open-ai.module';
import { OutputParserService } from './modules/output-parser/output-parser.service';
import { OutputParserModule } from './modules/output-parser/output-parser.module';
import { AiToolsModule } from './modules/ai-tools/ai-tools.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    OpenAiModule,
    OutputParserModule,
    AiToolsModule,
  ],
  controllers: [AppController],
  providers: [AppService, OutputParserService],
})
export class AppModule {}
