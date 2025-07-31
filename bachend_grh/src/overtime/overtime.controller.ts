import { Controller, Get, Param, Post } from '@nestjs/common';
import { OvertimeService } from './overtime.service';

@Controller('overtime')
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @Post('calculate/:userId/:date')
  async calculateOvertime(@Param('userId') userId: string, @Param('date') date: string) {
    return this.overtimeService.calculateOvertime(userId, date);
  }

  @Get('user/:userId')
  async getUserOvertime(@Param('userId') userId: string) {
    return this.overtimeService.getUserOvertime(userId);
  }

  @Get()
  async getAllOvertime() {
    return this.overtimeService.getAllOvertime();
  }
}
