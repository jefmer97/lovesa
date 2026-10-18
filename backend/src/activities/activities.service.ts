import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from '../schemas/activity.schema';

@Injectable()
export class ActivitiesService {
  constructor(@InjectModel(Activity.name) private activityModel: Model<ActivityDocument>) {}

  async create(userId: string, data: any): Promise<ActivityDocument> {
    const newActivity = new this.activityModel({ ...data, userId });
    return newActivity.save();
  }

  async findAll(userId: string, search?: string): Promise<ActivityDocument[]> {
    const filter: any = { userId };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }
    return this.activityModel.find(filter).exec();
  }

  async findOne(id: string, userId: string): Promise<ActivityDocument> {
    const activity = await this.activityModel.findOne({ _id: id, userId }).exec();
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  async update(id: string, userId: string, data: any): Promise<ActivityDocument> {
    const updated = await this.activityModel.findOneAndUpdate({ _id: id, userId }, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Activity not found');
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.activityModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Activity not found');
  }
}
