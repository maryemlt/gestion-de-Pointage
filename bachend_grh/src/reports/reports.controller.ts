import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('full/:userId')
  async getFullReport(@Param('userId') userId: string, @Res() res: Response) {
    return this.reportsService.generateFullReportStream(userId, res);
  }
}
