import { Injectable } from '@nestjs/common';
import { Document, Model } from 'mongoose';
import { Vocabulary } from './schemas/vocabulary.schema';
import { InjectModel } from '@nestjs/mongoose';
import RepositoryService from './abstract/repository-service.abstract';

// interface RepositoryBase {

// }

function group<T>(list: Array<T>, length: number) {
  if (length === 0) return [list];
  const result: T[][] = [];
  let start = 0;

  while (start <= list.length - 1) {
    const end = start + length;
    result.push(list.slice(start, end));
    start = end;
  }

  return result;
}

@Injectable()
export class VocabularyRepositoryService extends RepositoryService<Vocabulary> {
  constructor(
    @InjectModel(Vocabulary.name) protected readonly model: Model<Vocabulary>,
  ) {
    super();
  }

  async getByName(name: string) {
    return this.model.findOne({ name });
  }

  async getAllLearned(state: boolean) {
    return this.model.find({
      learned: state,
    });
  }

  async save(docs: Vocabulary) {
    const result = await this.model.findOne({
      name: docs.name,
    });

    if (result) return result;
    return super.save(docs);
  }

  async deleteByName(name: string) {
    return this.model.deleteOne({ name });
  }

  async feedVocabulary(source: Array<{ name: string; description?: string }>) {
    return Promise.all(
      group(source, 100).map((item) =>
        Promise.all(
          item.map((i) =>
            this.save({
              name: i.name,
              description: i.description ?? '',
              learned: false,
            }),
          ),
        ),
      ),
    );
  }
}
