import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleModule } from '../google/google.module';
import { SyncService } from './sync.service';

@Module({
  imports: [ScheduleModule.forRoot(), GoogleModule],
  providers: [SyncService, PrismaService],
  exports: [SyncService],
})
export class SyncModule {}
