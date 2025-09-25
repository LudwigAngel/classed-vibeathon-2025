import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleService } from '../google/google.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  constructor(private prisma: PrismaService, private google: GoogleService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async syncClassroomJob() {
    this.logger.log('Sync Classroom (cron)...');
    // Placeholder: Use an authorized OAuth2 client per user/teacher for real data
    // const auth = this.google.getOAuth2Client();
    // const classroom = this.google.classroom(auth);
    // const res = await classroom.courses.list();
    // this.logger.log(`Found courses: ${res.data.courses?.length || 0}`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncCalendarJob() {
    this.logger.log('Sync Calendar (cron)...');
  }
}
