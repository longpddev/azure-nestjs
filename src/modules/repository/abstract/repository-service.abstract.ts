import { Model } from 'mongoose';

export default abstract class RepositoryService<D> {
  protected abstract readonly model: Model<D>;

  async getAll() {
    return this.model.find();
  }

  async getById(id: string) {
    return this.model.findById(id);
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async save(docs: D) {
    return new this.model(docs).save();
  }

  async updateByIds(ids: string[], docs: Partial<D>) {
    const result = await Promise.allSettled(
      ids.map(async (item) => this.update(item, docs)),
    );
    if (result.findIndex((item) => item.status === 'rejected') !== -1) {
      await Promise.all(
        result.map((item) => {
          if (item.status === 'fulfilled') {
            return this.delete(item.value.id);
          } else {
            return Promise.resolve();
          }
        }),
      );
      console.error(result);
      throw new Error('save error');
    }

    return result
      .map((item) => (item.status === 'fulfilled' ? item.value : undefined))
      .filter(Boolean);
  }

  async update(id: string, docs: Partial<D>) {
    const result = await this.getById(id);

    Object.entries(docs).forEach(([key, value]) => {
      result.set(key, value);
    });

    return result.save();
  }
}
