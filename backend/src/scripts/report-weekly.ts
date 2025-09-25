import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

(async () => {
  const prisma = new PrismaClient();
  const courses = await prisma.course.findMany({ include: { coursework: true } });
  console.log(`Weekly report demo: ${courses.length} courses`);
  await prisma.$disconnect();
})();
