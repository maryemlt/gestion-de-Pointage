import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Overtime, OvertimeSchema } from './overtime.schema';
import { OvertimeService } from './overtime.service';
import { OvertimeController } from './overtime.controller';
import { Attendance, AttendanceSchema } from '../attendance/attendance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Overtime.name, schema: OvertimeSchema },
      { name: Attendance.name, schema: AttendanceSchema }, // ✅ ajouter pour injecter AttendanceModel
    ]),
  ],
  controllers: [OvertimeController],
  providers: [OvertimeService],
})
export class OvertimeModule {}
