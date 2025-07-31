import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

import { Leave, LeaveSchema } from '../leaves/leave.schema';
import { Attendance, AttendanceSchema } from '../attendance/attendance.schema';
import { Overtime, OvertimeSchema } from '../overtime/overtime.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Leave.name, schema: LeaveSchema },
      { name: Attendance.name, schema: AttendanceSchema }, // ✅ Ajouté
      { name: Overtime.name, schema: OvertimeSchema },     // ✅ Ajouté
      { name: User.name, schema: UserSchema },             // ✅ Ajouté
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
