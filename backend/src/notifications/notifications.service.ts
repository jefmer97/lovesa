import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as webpush from 'web-push';
import {
  PushSubscription,
  PushSubscriptionDocument,
} from '../schemas/push-subscription.schema';
import { Reminder, ReminderDocument } from '../schemas/reminder.schema';
import { Activity, ActivityDocument } from '../schemas/activity.schema';
import { Idea, IdeaDocument } from '../schemas/idea.schema';

const DEFAULT_VAPID_PUBLIC =
  process.env.VAPID_PUBLIC_KEY ||
  'BI1NPpct1Y8e_eRdBeVBY8VygG3ex9nsq53FmoQEnOD1-AWZ73mnu-AQaor7-ADugSjWg9Bxotwlg0gqjASiubM';
const DEFAULT_VAPID_PRIVATE =
  process.env.VAPID_PRIVATE_KEY ||
  'oIya2C0XeQwzaaxdPQsUQWy48vrsk06sleLZgEh7jY8';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(PushSubscription.name)
    private subModel: Model<PushSubscriptionDocument>,
    @InjectModel(Reminder.name)
    private reminderModel: Model<ReminderDocument>,
    @InjectModel(Activity.name)
    private activityModel: Model<ActivityDocument>,
    @InjectModel(Idea.name)
    private ideaModel: Model<IdeaDocument>,
  ) {
    webpush.setVapidDetails(
      'mailto:jeff@lovesa.app',
      DEFAULT_VAPID_PUBLIC,
      DEFAULT_VAPID_PRIVATE,
    );
  }

  onModuleInit() {
    // Chequea cada 60 segundos recordatorios vencidos y citas próximas
    setInterval(() => {
      this.processDueRemindersAndUpcomingEvents().catch((err) =>
        this.logger.error('Error processing reminders:', err),
      );
    }, 60 * 1000);
  }

  getVapidPublicKey() {
    return { publicKey: DEFAULT_VAPID_PUBLIC };
  }

  async saveSubscription(userId: string, sub: any, userAgent?: string) {
    if (!sub || !sub.endpoint || !sub.keys) {
      throw new Error('Invalid push subscription payload');
    }

    const updated = await this.subModel
      .findOneAndUpdate(
        { endpoint: sub.endpoint },
        {
          userId,
          endpoint: sub.endpoint,
          keys: sub.keys,
          userAgent,
        },
        { upsert: true, new: true },
      )
      .exec();

    // Enviar notificación de confirmación inmediata
    await this.sendPushToUser(userId, {
      title: '🔔 ¡Alertas de Lovesa Activadas!',
      body: 'Te avisaré al teléfono cuando venga una cita con Dei, aniversario o tengas algo pendiente por hacer ❤️',
      url: '/timeline',
    });

    return updated;
  }

  async sendPushToUser(
    userId: string,
    payload: { title: string; body: string; url?: string; tag?: string },
  ) {
    const subs = await this.subModel.find({ userId }).exec();
    let sentCount = 0;

    for (const s of subs) {
      try {
        await webpush.sendNotification(
          {
            endpoint: s.endpoint,
            keys: s.keys,
          },
          JSON.stringify(payload),
        );
        sentCount++;
      } catch (err: any) {
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await this.subModel.deleteOne({ _id: s._id }).exec();
        } else {
          this.logger.warn(`Failed push to ${s.endpoint}: ${err.message}`);
        }
      }
    }

    return { sentCount, totalSubscriptions: subs.length };
  }

  async createReminder(
    userId: string,
    data: { title: string; body?: string; remindAt: Date | string; url?: string },
  ) {
    const reminder = new this.reminderModel({
      userId,
      title: data.title,
      body: data.body || data.title,
      remindAt: new Date(data.remindAt),
      url: data.url || '/timeline',
      isCompleted: false,
      sent: false,
    });
    return reminder.save();
  }

  async getReminders(userId: string) {
    return this.reminderModel
      .find({ userId })
      .sort({ isCompleted: 1, remindAt: 1 })
      .exec();
  }

  async updateReminder(userId: string, id: string, data: any) {
    return this.reminderModel
      .findOneAndUpdate({ _id: id, userId }, data, { new: true })
      .exec();
  }

  async deleteReminder(userId: string, id: string) {
    return this.reminderModel.deleteOne({ _id: id, userId }).exec();
  }

  async processDueRemindersAndUpcomingEvents() {
    const now = new Date();

    // 1. Disparar recordatorios cuya hora ya llegó
    const dueReminders = await this.reminderModel
      .find({
        sent: false,
        isCompleted: false,
        remindAt: { $lte: now },
      })
      .exec();

    for (const rem of dueReminders) {
      await this.sendPushToUser(rem.userId.toString(), {
        title: `⏰ Recordatorio: ${rem.title}`,
        body: rem.body || 'Tienes un pendiente para Dei que aún no has completado.',
        url: rem.url || '/timeline',
        tag: `reminder-${rem._id}`,
      });
      rem.sent = true;
      await rem.save();
    }

    // 2. Revisar actividades en las próximas 24 horas para usuarios con suscripción activa
    const distinctUsers = await this.subModel.distinct('userId').exec();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    for (const uid of distinctUsers) {
      const userIdStr = uid.toString();
      const upcomingActivities = await this.activityModel
        .find({
          userId: userIdStr,
          startDate: { $gte: now, $lte: in24h },
        })
        .exec();

      for (const act of upcomingActivities) {
        const autoTagTitle = `Cita próxima: ${act.title}`;
        const alreadyReminded = await this.reminderModel
          .findOne({ userId: userIdStr, title: autoTagTitle })
          .exec();

        if (!alreadyReminded) {
          await this.reminderModel.create({
            userId: userIdStr,
            title: autoTagTitle,
            body: `Se acerca "${act.title}". ¡Asegúrate de tener todo listo para sorprender a Dei! ❤️`,
            remindAt: now,
            sent: true,
            isCompleted: false,
            url: '/calendar',
          });

          await this.sendPushToUser(userIdStr, {
            title: `📅 ¡Se acerca tu cita con Dei!`,
            body: `"${act.title}" está programada en las próximas 24 horas. ¡Revisa los detalles!`,
            url: '/calendar',
            tag: `activity-${act._id}`,
          });
        }
      }
    }
  }
}
