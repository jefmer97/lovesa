import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { Activity, ActivitySchema } from '../schemas/activity.schema';
import { Idea, IdeaSchema } from '../schemas/idea.schema';
import { Reminder, ReminderSchema } from '../schemas/reminder.schema';
import { ChatMessage, ChatMessageSchema } from '../schemas/chat-message.schema';
import { Preference, PreferenceSchema } from '../schemas/preference.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
      { name: Idea.name, schema: IdeaSchema },
      { name: Reminder.name, schema: ReminderSchema },
      { name: ChatMessage.name, schema: ChatMessageSchema },
      { name: Preference.name, schema: PreferenceSchema },
    ]),
    NotificationsModule,
  ],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
