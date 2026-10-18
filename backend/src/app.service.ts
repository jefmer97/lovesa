import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { Idea, IdeaDocument } from './schemas/idea.schema';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Idea.name) private ideaModel: Model<IdeaDocument>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    try {
      const users = await this.userModel.find().exec();
      for (const u of users) {
        const res = await this.seedHistoryForUser((u as any)._id.toString());
        if (res.activitiesAdded > 0 || res.ideasAdded > 0) {
          this.logger.log(
            `Seeded ${res.activitiesAdded} activities and ${res.ideasAdded} ideas for ${u.email}`,
          );
        }
      }
    } catch (err) {
      this.logger.error('Error in onModuleInit seed check', err);
    }
  }

  async seedHistory() {
    const users = await this.userModel.find().exec();
    if (!users.length) {
      return { status: 'no_users_found', activitiesAdded: 0, ideasAdded: 0 };
    }

    let totalActivitiesAdded = 0;
    let totalIdeasAdded = 0;

    for (const u of users) {
      const res = await this.seedHistoryForUser((u as any)._id.toString());
      totalActivitiesAdded += res.activitiesAdded;
      totalIdeasAdded += res.ideasAdded;
    }

    return {
      status: 'ok',
      usersProcessed: users.length,
      activitiesAdded: totalActivitiesAdded,
      ideasAdded: totalIdeasAdded,
    };
  }

  private async seedHistoryForUser(userId: string) {
    const historicalActivities = [
      {
        title: 'Cena juntos y primera clase de manejo a Dei 🚗',
        description:
          'Compartimos comida juntos, la llevé a casa y le enseñé a manejar por primera vez. ("Gracias por la comida y traerme... Aaa y también enseñarme a manejar").',
        startDate: new Date('2026-06-10T21:00:00.000Z'),
        endDate: new Date('2026-06-10T23:59:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Salida especial juntos ✨',
        description: 'Noche de risas y conexión hasta la madrugada. ("¡La pasé súper!").',
        startDate: new Date('2026-06-21T20:00:00.000Z'),
        endDate: new Date('2026-06-21T23:59:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Cita especial y desayuno sorpresa 🥐',
        description:
          'Compartimos una gran noche juntos y por la mañana le llevé desayuno. ("¡La pasé súper nuevamente! Gracias por compartir").',
        startDate: new Date('2026-06-28T15:00:00.000Z'),
        endDate: new Date('2026-06-28T23:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Cita en Multiplaza y primer "Te quiero mucho Dei" 🛍️❤️',
        description:
          'Nos vimos en Multiplaza para que me ayudara a elegir el regalo de Cheskis, comimos juntos y cerramos el día diciéndole "Te quiero mucho Dei".',
        startDate: new Date('2026-06-30T18:00:00.000Z'),
        endDate: new Date('2026-06-30T22:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Cita romántica inolvidable 🌙',
        description:
          'Una cita que nos encantó a los dos. ("Me súper encantó nuestra cita, quiero muchas más y pronto. Gracias por darme un poquito de tu tiempo hoy, lo valoro mucho").',
        startDate: new Date('2026-07-17T20:00:00.000Z'),
        endDate: new Date('2026-07-17T23:59:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Cita juntos y caballerosidad 🌹',
        description:
          'Tiempo de calidad juntos después del turno. Dei: "A ti, gracias por invitarme y ser tan caballeroso".',
        startDate: new Date('2026-07-21T20:00:00.000Z'),
        endDate: new Date('2026-07-21T23:59:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Confesión de amor: "Todo de ti me enamora y me derrite" 💌',
        description:
          'Le confesé lo enamorado que estaba de ella: "Cuando no estoy a tu lado estoy pensando en ti, a cada instante... disfrutar tu compañía, tu forma de ser, tu presencia, tu voz, todo, todo de ti me enamora y me derrite".',
        startDate: new Date('2026-07-24T12:00:00.000Z'),
        endDate: new Date('2026-07-24T23:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Cita de música y complicidad ("Loco loco") 🎶',
        description:
          'Noche mágica compartiendo canciones y promesas de cantarnos. ("Gracias por ser tan lindo" / "Quedé como la canción... Loco loco. Me encantó").',
        startDate: new Date('2026-07-29T20:00:00.000Z'),
        endDate: new Date('2026-07-29T23:59:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Cena juntos y cuidados de corazón 🫶🏼',
        description:
          'Salimos a comer y la cuidé con su medicamento. Dei: "Descansa, gracias por ser tan caballeroso, por alimentarme y ser más lindo 🫶🏼🥺😽❤️".',
        startDate: new Date('2026-07-31T20:00:00.000Z'),
        endDate: new Date('2026-07-31T23:59:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Regalo sorpresa de Dei: Mi pulsera favorita 🎁✨',
        description:
          'Dei me sorprendió regalándome una pulsera elegida por ella. ("Gracias por la pulsera mi Dei, estoy muy contento con tu regalito, más contento aún que te hayas tomado el tiempo para elegirlo").',
        startDate: new Date('2026-08-06T18:00:00.000Z'),
        endDate: new Date('2026-08-06T23:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Tarde juntos en El Dorado Mall 🏬',
        description: 'Nos encontramos en El Dorado para pasear y compartir la tarde juntos.',
        startDate: new Date('2026-08-08T15:00:00.000Z'),
        endDate: new Date('2026-08-08T21:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Cita de Sushi juntos 🍣❤️',
        description:
          'Comimos un sushi riquísimo juntos. ("Gracias por el sushi Dei, estaba riquísimo" / Dei: "Descansa cariño, te quiero Jeff").',
        startDate: new Date('2026-08-13T19:00:00.000Z'),
        endDate: new Date('2026-08-13T23:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: '¡Inicio de Nuestro Noviazgo! (Aniversario Oficial) 💑🍷',
        description:
          'Nuestra fecha oficial de aniversario (día 15). Noche especial con Whisky Sour, Pork Belly, vino, uvas, quesos y película juntos, cerrando con la confirmación más feliz: "¡Soy muy feliz de ser tu novio!".',
        startDate: new Date('2026-08-15T12:00:00.000Z'),
        endDate: new Date('2026-08-15T23:59:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Inicio del Planeador: Mr. Bono (El Dorado) y Multiplaza 🥐🍽️',
        description:
          'Hito inaugural del Planeador de Experiencias: fuimos por los pancitos de Mr. Bono en El Dorado y luego a comer rico en Multiplaza.',
        startDate: new Date('2026-08-20T14:00:00.000Z'),
        endDate: new Date('2026-08-20T20:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Cita especial y detallito con amor 💝',
        description:
          'Noche especial juntos. ("Gracias por el detallito... Todos los días me levanto feliz de saber que eres mi novia Dei").',
        startDate: new Date('2026-08-28T20:00:00.000Z'),
        endDate: new Date('2026-08-28T23:59:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Primer "Te amo ❤️"',
        description: 'Un momento inolvidable en nuestra historia diciéndole "TE AMO ❤️" con todo el corazón.',
        startDate: new Date('2026-09-03T12:33:00.000Z'),
        endDate: new Date('2026-09-03T23:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Aniversario 1er Mes: Flores y Canción Original 💐🎸',
        description:
          'Celebración de nuestro primer mes de novios (15/09) con regalo de flores y la canción compuesta especialmente para Dei ("Todo de ti me enamora y me derrite, eres mi paz, mi locura y mi escondite").',
        startDate: new Date('2026-09-15T18:00:00.000Z'),
        endDate: new Date('2026-09-15T23:59:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Día de las Flores Amarillas 🌻',
        description: 'Detalle especial del 21 de septiembre en el Día de las Flores Amarillas.',
        startDate: new Date('2026-09-21T15:00:00.000Z'),
        endDate: new Date('2026-09-21T22:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Mi Cumpleaños con Dei: Cita Especial y Regalo del Reloj 🎂⌚❤️',
        description:
          'Dei me sorprendió en mi día con una cita hermosa y me regaló un reloj y detallitos. ("Me encantaron tus regalitos mi vida 😍 Me encantaste tú sobre todo, linda y hermosa... Con gusto cariño, yo encantada de poder darte detallitos y más en tu día").',
        startDate: new Date('2026-09-24T14:00:00.000Z'),
        endDate: new Date('2026-09-24T23:59:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Noches durmiendo juntos abrazaditos 🌙🛌❤️',
        description:
          'Fin de semana durmiendo juntos acurrucaditos. ("Me encantó dormir contigo hoy y ayer. Gracias por la confianza y por compartir conmigo. Te amo ❤️").',
        startDate: new Date('2026-09-27T22:00:00.000Z'),
        endDate: new Date('2026-09-28T10:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'La Historia de la Lancha: "Eres la mujer de mi vida" 🚤💫',
        description:
          'Mirándola mientras me contaba la historia de la lancha, viajé a su pasado, la vi en mi presente y la imaginé en todo mi futuro: "Te juro Dei que eres la mujer de mi vida. Soy feliz contigo Dei, quiero llorar de la felicidad".',
        startDate: new Date('2026-10-01T01:00:00.000Z'),
        endDate: new Date('2026-10-01T03:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Consintiéndola con almuerzos y tardes juntos ("Gracias por alimentarme cariño") 🍽️🫶🏼',
        description:
          'Llevándole su comidita rica al trabajo y cuidándola de sus dolorcitos. Dei: "Está muy rico, gracias mor... Gracias por alimentarme cariño ❤️🫶🏼".',
        startDate: new Date('2026-10-03T13:00:00.000Z'),
        endDate: new Date('2026-10-03T18:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Noche juntos: "Tú friita y yo calientito, me complementas en todo" 🔥❄️❤️',
        description:
          'Despertar y dormir abrazados. Dei: "Más rico es despertar contigo... Gracias a ti por siempre ser el hombre que tengo al lado ❤️".',
        startDate: new Date('2026-10-06T02:00:00.000Z'),
        endDate: new Date('2026-10-06T10:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Cita de madrugada: Shawarma y Juguitos 🥙🥤',
        description:
          'Salimos de madrugada por shawarma y juguitos naturales. ("Qué bien estaba el shawarma y los juguitos mi vida... Estoy telepáticamente abrazaditos").',
        startDate: new Date('2026-10-08T01:30:00.000Z'),
        endDate: new Date('2026-10-08T03:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'El Día del Temblor y las Réplicas: Cuidándonos a distancia 🌍🙏❤️',
        description:
          'Día de sismo fuerte y réplicas en la noche; pendientes el uno del otro a cada minuto sin poner el celular en modo sueño ("Quisiera tenerte a mi lado para abrazarte fuerte mi amor... Te amo Dei").',
        startDate: new Date('2026-10-09T15:00:00.000Z'),
        endDate: new Date('2026-10-09T23:59:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: '¡Dei conoce de sorpresa a mi Mamá y a mi Abuelito! 👨‍👩‍👦💓',
        description:
          'Mi mamá y mi abuelito fueron de sorpresa a conocer a Dei en Sabroso. ("Casi se me sale el corazón... YO QUEDÉ ICE, HIELO, TAQUITAQUIRUMBA... Tu abuelo tan cálido, gracias por presentarme a tus seres queridos" / "Yo estaba feliz de presentarle la mujer de mi vida a mi mamá y mi abuelito").',
        startDate: new Date('2026-10-12T14:00:00.000Z'),
        endDate: new Date('2026-10-12T22:00:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Día Familiar y Apoyo Incondicional de Dei 🏥👨‍👩‍👧‍👦❤️',
        description:
          'Dei me acompañó en mi susto médico y compartió con mi abuelito, mi mamá, su novio y Dani. Dei: "No hay de qué, para eso y más soy tu novia ❤️". Jeff: "Ante el susto que pasé, al verte me sentí mucho mejor, y la razón de que fuera un día para recordar es que hayas estado ahí conmigo junto a los míos".',
        startDate: new Date('2026-10-13T14:30:00.000Z'),
        endDate: new Date('2026-10-13T23:30:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Aniversario 2do Mes: "¡Te amo ❤️, Feliz Aniversario!" 🥂💐',
        description:
          'Cumplimos 2 meses de novios (15/10). Dei me escribió "Te amo ❤️ Feliz aniversario" ("Me derrite que me digas eso"), le llevé heladito de naranja-piña y salimos a celebrar nuestra cena de 2do mes.',
        startDate: new Date('2026-10-15T14:50:00.000Z'),
        endDate: new Date('2026-10-15T23:59:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
      {
        title: 'Cena nocturna y paseo juntos en moto 🛵🌙',
        description:
          'Salimos a comer juntos al cerrar turno y nos fuimos paseando en moto ("Vamos a comer mi vida y nos vamos en moto 🛵").',
        startDate: new Date('2026-10-16T23:20:00.000Z'),
        endDate: new Date('2026-10-16T23:59:00.000Z'),
        isAllDay: true,
        notes: '',
        media: [],
      },
    ];

    const initialIdeas = [
      // Ideas de Dei (inboxElla)
      {
        title: 'Tour de avistamiento de ballenas 🐋',
        description: 'Idea de Dei (Inbox de Ella): Ir juntos a un tour para ver ballenas en el mar.',
        timeframe: 'medium-term',
        isCompleted: false,
      },
      {
        title: 'Plan Artístico de Moldeado de Arcilla 🎨',
        description: 'Idea de Dei (Inbox de Ella): Taller o cita creativa moldeando y pintando arcilla juntos.',
        timeframe: 'short-term',
        isCompleted: false,
      },
      {
        title: 'Desayuno en restaurante Koreano y tomar té 🍵',
        description: 'Idea de Dei (Inbox de Ella): Ir a desayunar comida coreana y compartir té.',
        timeframe: 'short-term',
        isCompleted: false,
      },
      {
        title: 'Día de Playa juntos 🏖️',
        description: 'Idea de Dei (Inbox de Ella): Escapada de día completo a la playa con sol y mar.',
        timeframe: 'short-term',
        isCompleted: false,
      },
      {
        title: 'Día de Casa: Yo le cocino, ella disfruta 👨‍🍳🍷',
        description: 'Idea de Dei (Inbox de Ella): Consentirla en casa cocinándole su plato favorito mientras ella descansa.',
        timeframe: 'short-term',
        isCompleted: false,
      },
      {
        title: 'Salir a Bailar Música Latina 💃🕺',
        description: 'Idea de Dei (Inbox de Ella): Noche de baile, salsa, bachata y merengue juntos.',
        timeframe: 'short-term',
        isCompleted: false,
      },
      {
        title: 'Ir a la Iglesia juntos 🙏✨',
        description: 'Idea compartida ("Hay que dar gracias por lo que tenemos, siempre"): Asistir juntos a la iglesia.',
        timeframe: 'anytime',
        isCompleted: false,
      },
      {
        title: 'Enseñanza de Skateboard 🛹',
        description: 'Idea de Dei (Inbox de Ella): Tarde divertida enseñándole o practicando skateboard juntos.',
        timeframe: 'anytime',
        isCompleted: false,
      },
      // Ideas de Jeff (inboxJeff)
      {
        title: 'Tour en Tren Interoceánico 🚂',
        description: 'Idea de Jeff (Inbox de Jeff): Paseo escénico de costa a costa en el tren.',
        timeframe: 'medium-term',
        isCompleted: false,
      },
      {
        title: 'Cita Romántica a Solas, Flores y Serenata 💐🎶',
        description: 'Idea de Jeff (Inbox de Jeff): Velada íntima con flores y serenata dedicada.',
        timeframe: 'medium-term',
        isCompleted: false,
      },
      {
        title: 'Concierto de Romeo Santos 🎤',
        description: 'Idea de Jeff (Inbox de Jeff): Ir juntos a cantar bachatas en vivo en concierto.',
        timeframe: 'long-term',
        isCompleted: false,
      },
      {
        title: 'Dedicatoria Sorpresa en Bar con Música en Vivo 🎸',
        description: 'Idea de Jeff (Inbox de Jeff): Sorprenderla dedicándole o cantándole una canción en vivo.',
        timeframe: 'short-term',
        isCompleted: false,
      },
      {
        title: 'Cita de Planeación Íntima 🔥',
        description: 'Idea de Jeff (Inbox de Jeff): Noche especial de conexión, confianza y complicidad en pareja.',
        timeframe: 'short-term',
        isCompleted: false,
      },
      {
        title: 'Día de Casa (Salón VIP): Rizos y comida 💆‍♀️🍽️',
        description: 'Idea de Jeff (Inbox de Jeff): Día de spa en casa consintiéndola, haciéndole sus rizos y cocinándole.',
        timeframe: 'short-term',
        isCompleted: false,
      },
      {
        title: 'Correr en carritos de playa (Buggies) 🏎️',
        description: 'Idea de Jeff (Inbox de Jeff): Aventura y adrenalina manejando buggies en la playa.',
        timeframe: 'medium-term',
        isCompleted: false,
      },
      // Planes futuros del Mapa Anual, Chat Reciente y Banco Musical
      {
        title: 'Celebrar Halloween Juntos Disfrazados (31/10) 🎃',
        description: 'Mapa Anual (Octubre 2026): Elegir disfraces en pareja y salir a celebrar Halloween.',
        timeframe: 'short-term',
        isCompleted: false,
      },
      {
        title: 'Cenar en Casco Antiguo y Noche en Hotel Boutique 🍷🏨',
        description: 'Mapa Anual: Cena especial en Casco Antiguo seguida de noche romántica en Hotel Boutique.',
        timeframe: 'short-term',
        isCompleted: false,
      },
      {
        title: 'Escapada en día de lluvia: Acurrucados viendo películas y One Piece 🌧️🍿',
        description: 'Del chat (01/10): Escaparnos un día entero de lluvia para estar acurrucaditos viendo películas o anime (One Piece).',
        timeframe: 'short-term',
        isCompleted: false,
      },
      {
        title: 'Conocer al Abuelito de Dei 🤝❤️',
        description: 'Del chat (13/10): Conocer al abuelito de Dei que también es súper amable y cálido.',
        timeframe: 'medium-term',
        isCompleted: false,
      },
      {
        title: 'Tocarle una canción en el Acordeón a Dei 🪗🎶',
        description: 'Del chat (05/10): Sorprender a Dei tocándole una canción practicada en el acordeón.',
        timeframe: 'medium-term',
        isCompleted: false,
      },
      {
        title: 'Regalo de Flores Trimestral (15/12 y 15/03) 💐',
        description: 'Mapa Anual: Mantener la tradición de sorprenderla con flores en nuestros aniversarios trimestrales.',
        timeframe: 'medium-term',
        isCompleted: false,
      },
      {
        title: 'Plan de Navidad: "La Navidad Más Linda" (Diciembre 2026) 🎄✨',
        description: 'Mapa Anual: Diseñar una experiencia mágica e inolvidable para nuestra primera Navidad juntos.',
        timeframe: 'medium-term',
        isCompleted: false,
      },
      {
        title: 'Tirarse de un Avión en Paracaídas (29/01/2027) 🪂',
        description: 'Mapa Anual (Enero 2027): Experiencia extrema de paracaidismo juntos.',
        timeframe: 'long-term',
        isCompleted: false,
      },
      {
        title: 'Canción Original: "Componer en vez de dedicar" 🎵',
        description:
          'Banco Musical: "En vez de aprenderme canciones para dedicártelas, mejor las compongo porque las otras no pueden comunicar todo lo que por ti siento."',
        timeframe: 'medium-term',
        isCompleted: false,
      },
    ];

    let activitiesAdded = 0;
    for (const act of historicalActivities) {
      const exists = await this.activityModel.findOne({ userId, title: act.title }).exec();
      if (!exists) {
        await this.activityModel.create({ ...act, userId });
        activitiesAdded++;
      }
    }

    let ideasAdded = 0;
    for (const idea of initialIdeas) {
      const exists = await this.ideaModel.findOne({ userId, title: idea.title }).exec();
      if (!exists) {
        await this.ideaModel.create({ ...idea, userId });
        ideasAdded++;
      }
    }

    return { activitiesAdded, ideasAdded };
  }
}
