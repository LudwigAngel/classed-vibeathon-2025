import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('courses')
export class CoursesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.course.findMany({ include: { coursework: true } });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.prisma.course.findUnique({ where: { id }, include: { coursework: true } });
  }
}
