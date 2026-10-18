import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('vapid-public-key')
  getVapidPublicKey() {
    return this.notificationsService.getVapidPublicKey();
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  subscribe(
    @Request() req: any,
    @Body() body: any,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.notificationsService.saveSubscription(
      req.user.userId,
      body,
      userAgent,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  testPush(@Request() req: any, @Body() body: any) {
    return this.notificationsService.sendPushToUser(req.user.userId, {
      title: body?.title || '❤️ Director AI — Lovesa',
      body:
        body?.body ||
        '¡Notificación de prueba exitosa! Así te llegarán al teléfono tus recordatorios y citas con Dei.',
      url: body?.url || '/timeline',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('reminders')
  getReminders(@Request() req: any) {
    return this.notificationsService.getReminders(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reminders')
  createReminder(@Request() req: any, @Body() body: any) {
    return this.notificationsService.createReminder(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('reminders/:id')
  updateReminder(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.notificationsService.updateReminder(req.user.userId, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('reminders/:id')
  deleteReminder(@Request() req: any, @Param('id') id: string) {
    return this.notificationsService.deleteReminder(req.user.userId, id);
  }
}
