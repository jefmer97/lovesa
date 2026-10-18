import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.ideasService.create(req.user.userId, body);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.ideasService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.ideasService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.ideasService.update(id, req.user.userId, body);
  }

  @Delete(':id')
  delete(@Request() req: any, @Param('id') id: string) {
    return this.ideasService.delete(id, req.user.userId);
  }
}
