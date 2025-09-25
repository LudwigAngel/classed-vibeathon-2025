import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app.module';
import { SyncService } from '../sync/sync.service';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['log', 'error', 'warn'] });
  const sync = app.get(SyncService);
  await sync.syncCalendarJob();
  await app.close();
})();
