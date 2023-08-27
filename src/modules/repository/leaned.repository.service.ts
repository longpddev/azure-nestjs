import { Injectable } from '@nestjs/common';
import { Learned } from './schemas/learned.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import RepositoryService from './abstract/repository-service.abstract';
import { VocabularyRepositoryService } from './vocabulary.repository.service';

@Injectable()
export class LeanedRepositoryService extends RepositoryService<Learned> {
  constructor(
    @InjectModel(Learned.name) protected readonly model: Model<Learned>,
    private readonly vocabularyRepository: VocabularyRepositoryService,
  ) {
    super();
  }

  async saveLeaned(docs: Learned) {
    const leanSaved = await this.save(docs);

    try {
      await this.vocabularyRepository.updateByIds(docs.vocabularies, {
        learned: true,
      });
    } catch (e) {
      console.error(e);
      await this.delete(leanSaved.id);
    }
  }

  async deleteLearned(id: string) {
    const result = await this.delete(id);
    this.vocabularyRepository.updateByIds(result.vocabularies, {
      learned: false,
    });
  }
}
