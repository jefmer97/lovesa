import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import {
  PushSubscription,
  PushSubscriptionSchema,
} from '../schemas/push-subscription.schema';
import { Reminder, ReminderSchema } from '../schemas/reminder.schema';
import { Activity, ActivitySchema } from '../schemas/activity.schema';
import { Idea, IdeaSchema } from '../schemas/idea.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PushSubscription.name, schema: PushSubscriptionSchema },
      { name: Reminder.name, schema: ReminderSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: Idea.name, schema: IdeaSchema },
    ]),
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
