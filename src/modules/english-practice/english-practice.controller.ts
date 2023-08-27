import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AiModelService } from '../ai-model/ai-model.service';
import { IsArray, IsString } from 'class-validator';
import { COMMON_VOCABULARY, ENGLISH_TENSES, randomPick } from './constant';
import { VocabularyRepositoryService } from '../repository/vocabulary.repository.service';
import { Type } from 'class-transformer';
import { LeanedRepositoryService } from '../repository/leaned.repository.service';
import { ApiProperty } from '@nestjs/swagger';
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
}
