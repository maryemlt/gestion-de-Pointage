import { Controller, Post, Get, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in/:userId')
  checkIn(@Param('userId') userId: string) {
    return this.attendanceService.checkIn(userId);
  }

  @Post('check-out/:userId')
  checkOut(@Param('userId') userId: string) {
    return this.attendanceService.checkOut(userId);
  }

  @Get('history/:userId')
  getUserHistory(@Param('userId') userId: string) {
    return this.attendanceService.getUserHistory(userId);
  }
}
