import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(
    @Request() req: any,
    @Body() body: { messages: Array<{ role: string; content: string }> },
  ) {
    return this.aiService.chat(req.user.userId, body.messages || []);
  }

  @Post('transcribe')
  async transcribe(
    @Body() body: { audioBase64?: string; mimeType?: string; audioDataUrl?: string },
  ) {
    return this.aiService.transcribeAudio(body);
  }
}

