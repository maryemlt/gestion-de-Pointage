import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/grh_db'),
    UsersModule,
    AttendanceModule,
    
  ],
})
export class AppModule {}
