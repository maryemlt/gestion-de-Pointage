import { Controller, Post, Patch, Get, Param, Body } from '@nestjs/common';
import { LeavesService } from './leaves.service';

@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post(':userId')
  requestLeave(@Param('userId') userId: string, @Body() body: any) {
    console.log('📩 Reçu POST /leaves/', userId, body); // <
    return this.leavesService.requestLeave(userId, body);
  }

    @Patch('status/:leaveId')
  updateStatus(
    @Param('leaveId') leaveId: string,
    @Body() body: { status: 'approved' | 'rejected' },
  ) {
    console.log('🟢 PATCH reçu', leaveId, body); // <-- pour vérifier
    return this.leavesService.updateStatus(leaveId, body.status);
  }

  @Get('user/:userId')
  getUserLeaves(@Param('userId') userId: string) {
    return this.leavesService.getUserLeaves(userId);
  }

  @Get()
  getAllLeaves() {
    return this.leavesService.getAllLeaves();
  }
}
