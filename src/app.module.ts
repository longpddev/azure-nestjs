import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OpenAiModule } from './modules/open-ai/open-ai.module';
import { OutputParserService } from './modules/output-parser/output-parser.service';
import { OutputParserModule } from './modules/output-parser/output-parser.module';
import { AiToolsModule } from './modules/ai-tools/ai-tools.module';
import { join } from 'path';
import { PromptTemplateModule } from './modules/prompt-template/prompt-template.module';
import { AiModelModule } from './modules/ai-model/ai-model.module';
import { EnglishPracticeModule } from './modules/english-practice/english-practice.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    ConfigModule.forRoot(),
    OpenAiModule,
    OutputParserModule,
    AiToolsModule,
    PromptTemplateModule,
    AiModelModule,
    EnglishPracticeModule,
    RepositoryModule,
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@cluster0.sfpeoxa.mongodb.net/english-store`,
    ),
  ],
  controllers: [AppController],
  providers: [AppService, OutputParserService],
})
export class AppModule {}
