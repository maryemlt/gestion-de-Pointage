import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';
import { Leave, LeaveSchema } from './leave.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Leave.name, schema: LeaveSchema }]),
  ],
  controllers: [LeavesController],
  providers: [LeavesService],
})
export class LeavesModule {}
