import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';
import { Leave, LeaveSchema } from './leave.schema';
import { Attendance, AttendanceSchema } from '../attendance/attendance.schema'; // ✅ chemin correct

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Leave.name, schema: LeaveSchema },          // LeaveModel
      { name: Attendance.name, schema: AttendanceSchema } // AttendanceModel
    ]),
  ],
  controllers: [LeavesController],
  providers: [LeavesService],
})
export class LeavesModule {}
