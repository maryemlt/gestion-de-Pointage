import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeavesModule } from './leaves/leaves.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/grh_db'),
    UsersModule,
    AuthModule,
    AttendanceModule,
    LeavesModule, // ✅ ici
  ],
})
export class AppModule {}
