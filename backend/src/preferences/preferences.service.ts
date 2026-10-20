import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Preference, PreferenceDocument } from '../schemas/preference.schema';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectModel(Preference.name)
    private preferenceModel: Model<PreferenceDocument>,
  ) {}

  async create(userId: string, data: any): Promise<PreferenceDocument> {
    const created = new this.preferenceModel({ ...data, userId });
    return created.save();
  }

  async findAll(userId: string): Promise<PreferenceDocument[]> {
    return this.preferenceModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async update(
    id: string,
    userId: string,
    data: any,
  ): Promise<PreferenceDocument | null> {
    return this.preferenceModel
      .findOneAndUpdate({ _id: id, userId }, data, { new: true })
      .exec();
  }

  async delete(id: string, userId: string): Promise<any> {
    return this.preferenceModel.findOneAndDelete({ _id: id, userId }).exec();
  }
}
