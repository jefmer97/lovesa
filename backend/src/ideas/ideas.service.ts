import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Idea, IdeaDocument } from '../schemas/idea.schema';

@Injectable()
export class IdeasService {
  constructor(@InjectModel(Idea.name) private ideaModel: Model<IdeaDocument>) {}

  async create(userId: string, data: any): Promise<IdeaDocument> {
    const newIdea = new this.ideaModel({ ...data, userId });
    return newIdea.save();
  }

  async findAll(userId: string): Promise<IdeaDocument[]> {
    return this.ideaModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<IdeaDocument> {
    const idea = await this.ideaModel.findOne({ _id: id, userId }).exec();
    if (!idea) throw new NotFoundException('Idea not found');
    return idea;
  }

  async update(id: string, userId: string, data: any): Promise<IdeaDocument> {
    const updated = await this.ideaModel.findOneAndUpdate({ _id: id, userId }, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Idea not found');
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.ideaModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Idea not found');
  }
}
