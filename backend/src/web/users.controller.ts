import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Query('role') role?: string) {
    return this.prisma.user.findMany({ where: role ? { role: role as any } : undefined });
  }
}
