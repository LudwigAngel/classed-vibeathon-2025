import { PrismaClient, SubmissionState, UserRole } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo data...');

  const prof = await prisma.user.upsert({
    where: { email: 'profesor@example.com' },
    update: {},
    create: { email: 'profesor@example.com', nombre: 'Profe Ada', role: UserRole.PROFESOR },
  });

  const alumnos = await Promise.all(
    Array.from({ length: 8 }).map((_, i) =>
      prisma.user.upsert({
        where: { email: `alumno${i + 1}@example.com` },
        update: {},
        create: { email: `alumno${i + 1}@example.com`, nombre: `Alumno ${i + 1}`, role: UserRole.ALUMNO },
      }),
    ),
  );

  const course = await prisma.course.upsert({
    where: { id: 'classroom-course-1' },
    update: {},
    create: { id: 'classroom-course-1', nombre: 'Fullstack 101', seccion: 'A', teacherEmail: prof.email },
  });

  for (const a of alumnos) {
    await prisma.enrollment.upsert({
      where: { id: `${course.id}-${a.id}` },
      update: {},
      create: { id: `${course.id}-${a.id}`, courseId: course.id, userId: a.id, rol: UserRole.ALUMNO },
    });
  }

  const cw1 = await prisma.coursework.upsert({
    where: { id: 'cw-1' },
    update: {},
    create: { id: 'cw-1', courseId: course.id, titulo: 'Entrega 1', dueAt: new Date(Date.now() + 86400000), maxPoints: 100 },
  });

  for (const a of alumnos) {
    await prisma.submission.create({
      data: {
        courseworkId: cw1.id,
        studentId: a.id,
        estado: SubmissionState.FALTANTE,
      },
    });
  }

  console.log('Seed listo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
