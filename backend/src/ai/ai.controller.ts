import { Controller, Post, Get, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('history')
  async getHistory(@Request() req: any) {
    return this.aiService.getChatHistory(req.user.userId);
  }

  @Delete('history')
  async clearHistory(@Request() req: any) {
    return this.aiService.clearChatHistory(req.user.userId);
  }

  @Post('chat')
  async chat(
    @Request() req: any,
    @Body()
    body: {
      message?: string;
      messages?: Array<{ role: string; content: string }>;
    },
  ) {
    return this.aiService.chat(req.user.userId, body.messages || [], body.message);
  }

  @Post('transcribe')
  async transcribe(
    @Body() body: { audioBase64?: string; mimeType?: string; audioDataUrl?: string },
  ) {
    return this.aiService.transcribeAudio(body);
  }
}
