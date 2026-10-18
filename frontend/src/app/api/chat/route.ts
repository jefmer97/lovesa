import { google } from '@ai-sdk/google';
import { ToolLoopAgent, createAgentUIStreamResponse, tool } from 'ai';
import { z } from 'zod';
import { INTERNAL_API_URL } from '../../../config/api';

export const maxDuration = 30;

const SYSTEM_PROMPT = `Eres el Director de la Relación de Jeffreey y Deilyn. Aplicas el Método Taraban (Burbuja y Contraste).
Tu trabajo es organizar sus citas, proponer hitos anuales y gestionar la "Wishlist Secreta".
Recuerda la estructura de una Cita Fuerte: Transición -> Clímax -> Cambio de Energía -> Diseño Íntimo -> Gancho Final.

Tienes acceso a herramientas para interactuar con el sistema Lovesa.
Si el usuario te pide agendar o guardar una idea, USA LAS HERRAMIENTAS. 
El usuario está interactuando desde la app, sé su consejero estratégico táctico.
`;

export async function POST(req: Request) {
  const { messages, data } = await req.json();
  const token = data?.token; // Token JWT enviado desde el frontend

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response(JSON.stringify({ error: "Falta GOOGLE_GENERATIVE_AI_API_KEY en .env.local" }), { status: 500 });
  }

  const agent = new ToolLoopAgent({
    model: google('gemini-2.5-pro'),
    system: SYSTEM_PROMPT,
    tools: {
      crearActividad: tool({
        description: 'Crea una nueva actividad o evento en el calendario (Citas, aniversarios, etc).',
        parameters: z.object({
          title: z.string().describe('El título de la actividad'),
          description: z.string().describe('Descripción o diseño íntimo de la experiencia'),
          date: z.string().describe('Fecha en formato YYYY-MM-DD (Usa estimaciones si no es exacta)'),
        }),
        execute: async ({ title, description, date }) => {
          try {
            const res = await fetch(`${INTERNAL_API_URL}/activities`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
              body: JSON.stringify({
                title,
                description,
                startDate: date,
                endDate: date,
                isAllDay: true,
                notes: '',
                media: [],
                ideaId: null
              })
            });
            if (!res.ok) throw new Error('Error de backend al crear actividad');
            return { success: true, message: `Actividad "${title}" guardada exitosamente.` };
          } catch (e: any) {
            return { success: false, error: e.message };
          }
        }
      }),
      crearIdea: tool({
        description: 'Guarda una idea en el banco de ideas o en la Wishlist Secreta.',
        parameters: z.object({
          title: z.string().describe('El título de la idea'),
          category: z.enum(['ella', 'jeff', 'wishlist']).describe('A quién pertenece la idea o si es wishlist'),
        }),
        execute: async ({ title, category }) => {
          try {
            const res = await fetch(`${INTERNAL_API_URL}/ideas`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
              body: JSON.stringify({
                title,
                description: `Categoría asignada: ${category}`,
                status: 'pending'
              })
            });
            if (!res.ok) throw new Error('Error de backend al crear idea');
            return { success: true, message: `Idea "${title}" guardada en la categoría ${category}.` };
          } catch (e: any) {
            return { success: false, error: e.message };
          }
        }
      }),
    },
  });

  return createAgentUIStreamResponse({
    agent,
    messages,
  });
}
