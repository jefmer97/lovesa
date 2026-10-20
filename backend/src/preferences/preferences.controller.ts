import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.preferencesService.create(req.user.userId, body);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.preferencesService.findAll(req.user.userId);
  }

  @Put(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.preferencesService.update(id, req.user.userId, body);
  }

  @Delete(':id')
  delete(@Request() req: any, @Param('id') id: string) {
    return this.preferencesService.delete(id, req.user.userId);
  }
}
