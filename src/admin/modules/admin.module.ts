import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin.controller';
import { AdminService } from '../services/admin.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AdminController],  // 註冊 Admin API
  providers: [AdminService, PrismaService],  // 提供 Admin 相關的邏輯
  exports: [AdminService],  // 讓其他 module 可以使用 AdminService
})
export class AdminModule {}
