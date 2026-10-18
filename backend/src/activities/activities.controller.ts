import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.activitiesService.create(req.user.userId, body);
  }

  @Get()
  findAll(@Request() req: any, @Query('search') search?: string) {
    return this.activitiesService.findAll(req.user.userId, search);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.activitiesService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.activitiesService.update(id, req.user.userId, body);
  }

  @Delete(':id')
  delete(@Request() req: any, @Param('id') id: string) {
    return this.activitiesService.delete(id, req.user.userId);
  }
}
