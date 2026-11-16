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

    const distinctUsers = await this.subModel.distinct('userId').exec();

    // 2. Comprobar Aniversarios de cada día 15 (Panamá UTC-5)
    // - Notificación 48 horas antes (Día 13) para anticipar flor/regalo
    // - Notificación el Día 15 a las 8:00 AM para celebrar
    const panamaTimeStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Panama',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      hour12: false,
    }).format(now);
    // Parse "M/D/YYYY, H"
    const [datePart, hourPart] = panamaTimeStr.split(', ');
    const [pMonth, pDay, pYear] = (datePart || '').split('/').map((n) => parseInt(n, 10));
    const pHour = parseInt(hourPart || '0', 10);

    for (const uid of distinctUsers) {
      const userIdStr = uid.toString();

      // Día 13: Alerta preventiva 48h antes del aniversario del 15
      if (pDay === 13 && pHour >= 8) {
        const annivPreTag = `anniversary-pre-${pYear}-${pMonth}`;
        const alreadyNotified = await this.reminderModel.findOne({ userId: userIdStr, title: annivPreTag }).exec();
        if (!alreadyNotified) {
          await this.reminderModel.create({
            userId: userIdStr,
            title: annivPreTag,
            body: 'En 48 horas es su día 15 con Dei ❤️. Recuerda tener listo el detalle, flor o carta.',
            remindAt: now,
            sent: true,
            isCompleted: true,
            url: '/experiencias',
          });
          await this.sendPushToUser(userIdStr, {
            title: '💐 ¡En 48h es su Aniversario con Dei (Día 15)!',
            body: 'Prepara el detalle o sorpresa para celebrar el día 15 como ella lo merece ❤️',
            url: '/experiencias',
            tag: annivPreTag,
          });
        }
      }

      // Día 15: Alerta oficial del aniversario
      if (pDay === 15 && pHour >= 8) {
        const annivDayTag = `anniversary-day-${pYear}-${pMonth}`;
        const alreadyNotified = await this.reminderModel.findOne({ userId: userIdStr, title: annivDayTag }).exec();
        if (!alreadyNotified) {
          // Calcular número de meses desde 15 agosto 2026
          const monthsTogether = (pYear - 2026) * 12 + (pMonth - 8);
          const mesTexto = monthsTogether > 0 ? `${monthsTogether}° Mes` : 'Aniversario';
          await this.reminderModel.create({
            userId: userIdStr,
            title: annivDayTag,
            body: `¡Hoy es su ${mesTexto} de Novios! Recuerda recordarle lo hermosa que es y consentirla.`,
            remindAt: now,
            sent: true,
            isCompleted: true,
            url: '/experiencias',
          });
          await this.sendPushToUser(userIdStr, {
            title: `❤️ ¡Feliz ${mesTexto} de Aniversario con Dei!`,
            body: 'Hoy cumplen otro mes juntos. Hazla sentir la reina de tu universo desde temprano ✨',
            url: '/experiencias',
            tag: annivDayTag,
          });
        }
      }
    }

    // 3. Revisar actividades en las próximas 24 horas y alertar checklist PRE pendiente
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
          // Revisar si tiene checklist PRE de mitigación de riesgos con items pendientes
          let pendingTasksNote = '';
          const pendingChecks = act.datePlan?.pre?.mitigacionRiesgosChecklist?.filter((c: any) => !c.done);
          if (pendingChecks && pendingChecks.length > 0) {
            pendingTasksNote = ` Tienes ${pendingChecks.length} tarea(s) pendiente(s) en tu checklist PRE.`;
          }

          await this.reminderModel.create({
            userId: userIdStr,
            title: autoTagTitle,
            body: `Se acerca "${act.title}".${pendingTasksNote} ¡Asegúrate de tener todo listo! ❤️`,
            remindAt: now,
            sent: true,
            isCompleted: false,
            url: '/calendar',
          });

          await this.sendPushToUser(userIdStr, {
            title: `📅 ¡Se acerca tu cita con Dei!`,
            body: `"${act.title}" está programada en las próximas 24 horas.${pendingTasksNote}`,
            url: '/calendar',
            tag: `activity-${act._id}`,
          });
        }
      }
    }
  }
}
