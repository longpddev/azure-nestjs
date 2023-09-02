import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AiModelService } from '../ai-model/ai-model.service';
import { IsArray, IsString } from 'class-validator';
import { COMMON_VOCABULARY, ENGLISH_TENSES, randomPick } from './constant';
import { VocabularyRepositoryService } from '../repository/vocabulary.repository.service';
import { Type } from 'class-transformer';
import { LeanedRepositoryService } from '../repository/leaned.repository.service';
import { ApiProperty } from '@nestjs/swagger';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import * as fs from 'fs/promises';
import { Chroma } from 'langchain/vectorstores/chroma';
import { Document } from 'langchain/document';
import { ChromaClient } from 'chromadb';
import { ONE_THOUSAND_COMMON_WORDS } from './ONE_THOUSAND_COMMON_WORDS';
class EvaluateBodyDto {
  @ApiProperty()
  @IsString()
  question: string;
  @ApiProperty()
  @IsString()
  answer: string;
}

class SentenceAnsweredDTO extends EvaluateBodyDto {
  @ApiProperty()
  @IsArray()
  @Type(() => String)
  words: string[];
  @IsString()
  tense: string;
}

class Embedding extends OpenAIEmbeddings {
  groupBy<T>(source: Array<T>, parallel = 5) {
    if (parallel === 0) throw new Error('parallel must large than 0');
    const lengthPerItem = Math.ceil(
      source.length / Math.min(parallel, source.length),
    );
    let i = 0;
    const result: T[][] = [];
    while (i < source.length) {
      result.push(source.slice(i, i + lengthPerItem));
      i += lengthPerItem;
    }

    return result;
  }
  async embedDocumentsParallel(texts: string[], parallel = 10) {
    return (
      await Promise.all(
        this.groupBy(texts, parallel).map((item) => this.embedDocuments(item)),
      )
    ).flat();
  }
}

const unknowItem = Embedding as any;
const old = unknowItem.prototype.embeddingWithRetry;
unknowItem.prototype.embeddingWithRetry = function (...args) {
  console.count('---embeddingWithRetry---');
  return old.apply(this, args);
};
@Controller('english-practice')
export class EnglishPracticeController {
  private topics = [
    'Solve problems in life',
    'plan something',
    'target hobby',
    'interest',
    'game',
    'travel',
    'Animals',
    'Education',
    'Ethics',
    'Health',
    'Sports',
    'Technology',
    'random',
  ];

  pickTopic() {
    return this.topics.at(Math.round(Math.random() * (this.topics.length - 1)));
  }

  constructor(
    private readonly aiModel: AiModelService,
    private readonly vocabularyRepository: VocabularyRepositoryService,
    private readonly leanedRepository: LeanedRepositoryService,
  ) {}
  @Get('exercise')
  async exercise() {
    let prompt = '';
    prompt =
      'As an English teacher, you design a writing exercise for your beginner students. Within this exercise, you construct a random scenario or context. Subsequently, your students are required to write a response based on the given scenario. This type of question is commonly encountered in the TOEIC test, a proficiency exam for English learners.';

    prompt = `You create an open-ended question by follow ${this.pickTopic()} topic.
    For example:
    - Tell me about your day.
    - You want to ask your friend to go to a new city on Saturday. how will you invite, what city has,...
    - You have 5 situations involved: 
        1. You go home.
        2. It suddenly rains heavily. 
        3. Your tile is flipped.
        4. You call your relatives. 
        5. You are happy to see them coming. 
        Let's string together the situations above and tell them like a story.
    ....et cetera
    
    And of course, you need some advice or guidance to answer this question better.`;
    return (await this.aiModel.agent()).run(prompt);
  }

  @Post('evaluate')
  async evaluate(@Body() body: EvaluateBodyDto) {
    return this.aiModel
      .getLLM(
        `Writing exercise:\n${body.question.trim()}\nThe answer of exercise:\n{input}\n\nYou response will evaluate, for example, give advice on what is good and what is not good...:`,
      )
      .predict({ input: body.answer.trim() });
  }

  @Get('/sentence/writing')
  async sentenceWriting() {
    const result = await this.vocabularyRepository.getAllLearned(false);
    const words = Array(randomPick([1, 2, 3, 4]))
      .fill('')
      .map(() => randomPick(result));
    const tense = randomPick(ENGLISH_TENSES);

    const question = await this.aiModel
      .getLLM()
      .run(
        `You are the teacher preparing a question for students. Follow the instructions below to create a complete question:\n- Tell the Student to make complete sentences in the "${tense}" with the words ${words.join(
          ', ',
        )}.\n\nYour question must contain 3 part:\n1. the question\n2. the guide you tell the student how to thing and break down the question.\n3. Which topic is suitable for make a good sentence.`,
      );

    return {
      question,
      words: words.map((item) => ({
        id: item.id,
        word: item.name,
        description: item.description,
      })),
      tense,
    };
  }

  @Post('sentence/writing/answer')
  async sentenceAnswered(@Body() body: SentenceAnsweredDTO) {
    return this.leanedRepository.saveLeaned({
      tense: body.tense,
      question: body.question,
      answer: body.answer,
      vocabularies: body.words,
      title: await this.aiModel.getLLM().predict({
        input: `Create title by text below:\n${body.question}\n\nTitle:`,
      }),
    });
  }

  @Get('sentence/reset')
  async sentenceReset() {
    const result = await this.leanedRepository.getAll();
    return Promise.all(
      result.map((item) => this.leanedRepository.deleteLearned(item.id)),
    );
  }

  @Get('/question')
  async question(@Query('question') question: string) {
    return (await this.aiModel.agentTest()).run(question);
  }

  @Get('vector-vocabulary')
  async vectorVocabulary() {
    console.log('ONE_THOUSAND_COMMON_WORDS', ONE_THOUSAND_COMMON_WORDS.length);
    const embedding = new Embedding();
    const vector = await embedding.embedDocumentsParallel(
      ONE_THOUSAND_COMMON_WORDS,
      50,
    );

    const result = Array(ONE_THOUSAND_COMMON_WORDS.length)
      .fill(0)
      .map((_item, index) => ({
        word: ONE_THOUSAND_COMMON_WORDS[index],
        vector: vector[index],
      }));

    await fs.writeFile(
      `./common-vocabulary-vector-${result.length}`,
      JSON.stringify(result),
    );

    return result.length;
  }

  get chroma() {
    return new ChromaClient();
  }

  langchainChroma(collectionName: string) {
    return new Chroma(new Embedding(), {
      collectionName: collectionName,
    });
  }

  get allCollection() {
    return (async () => {
      const listCollection = await this.chroma.listCollections();
      return Promise.all(
        listCollection.map((item) =>
          this.chroma.getCollection({ name: item.name }),
        ),
      );
    })();
  }

  @Get('vector-store-search')
  async vectorStoreSearch(@Query('search') search: string) {
    return Promise.all(
      (await this.allCollection).map(async (collection) => ({
        collectionName: collection.name,
        result: (
          await this.langchainChroma(collection.name).similaritySearchWithScore(
            search,
          )
        ).map((item) => [item[0], (1 - item[1]) * 100]),
      })),
    );
  }
  @Get('vector-store-collection')
  async vectorStoreCollection() {
    return Promise.all(
      (await this.allCollection).map(async (item) => ({
        name: item.name,
        count: await item.count(),
      })),
    );
  }

  @Get('feed')
  async feed() {
    const data = JSON.parse(
      await fs.readFile('common-vocabulary-vector-10000.json', {
        encoding: 'utf-8',
      }),
    ) as Array<{ word: string; vector: number[] }>;

    const collection = new Chroma(new Embedding(), {
      collectionName: 'one-thousand-common-vocabulary',
    });

    return await collection.addVectors(
      data.map((item) => item.vector),
      data.map((item) => new Document({ pageContent: item.word })),
    );
  }
}
