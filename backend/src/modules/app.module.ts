import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { HealthController } from '../web/health.controller';
import { UsersController } from '../web/users.controller';
import { CoursesController } from '../web/courses.controller';
import { GoogleModule } from '../google/google.module';
import { SyncModule } from '../sync/sync.module';
import { AuthController } from '../auth/auth.controller';

@Module({
  imports: [ScheduleModule.forRoot(), GoogleModule, SyncModule],
  controllers: [HealthController, UsersController, CoursesController, AuthController],
  providers: [PrismaService],
})
export class AppModule {}
