import { Model, FilterQuery, ProjectionType, UpdateQuery } from 'mongoose';
export class BaseDataAccess<T> {
  constructor(protected model: Model<T>) {}
  create(data: Partial<T>) {
    return this.model.create(data as any);
  }
  findById(id: string, projection?: ProjectionType<T>) {
    return this.model
      .findById(id, projection as any)
      .lean<T>()
      .exec();
  }
  findOne(filter: FilterQuery<T>, projection?: ProjectionType<T>) {
    return this.model
      .findOne(filter, projection as any)
      .lean<T>()
      .exec();
  }
  async findMany(
    filter: FilterQuery<T>,
    opts: { limit?: number; page?: number; sort?: Record<string, 1 | -1> } = {},
    projection?: ProjectionType<T>,
  ) {
    const limit = opts.limit ?? 20,
      page = opts.page ?? 1,
      skip = (page - 1) * limit,
      sorting = opts.sort ?? {};
    const [items, total] = await Promise.all([
      this.model
        .find(filter, projection as any)
        .sort(sorting)
        .skip(skip)
        .limit(limit)
        .lean<T>()
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    return { items, total, limit, skip };
  }
  updateById(
    id: string,
    update: UpdateQuery<T>,
    opt: { new?: boolean } = { new: true },
  ) {
    return this.model
      .findByIdAndUpdate(id, update, { ...opt })
      .lean<T>()
      .exec();
  }
  deleteById(id: string) {
    return this.model.findByIdAndDelete(id).lean<T>().exec();
  }
}
