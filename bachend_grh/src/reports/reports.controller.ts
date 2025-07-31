import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { createReadStream } from 'fs';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('leaves/:userId')
  async getLeaveReport(@Param('userId') userId: string, @Res() res: Response) {
    const filePath = await this.reportsService.generateLeaveReport(userId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=rapport_conges_${userId}.pdf`,
    );

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }
}
