import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AiModelService } from '../ai-model/ai-model.service';
import { IsString } from 'class-validator';
class EvaluateBodyDto {
  @IsString()
  question: string;
  @IsString()
  answer: string;
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

  constructor(private readonly aiModel: AiModelService) {}
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
}
