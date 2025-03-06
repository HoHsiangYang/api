import { Module } from '@nestjs/common';
import { UserService } from './../services/user.service';
import { UserController } from './../controllers/user.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [UserController], // ✅ 註冊 `UserController`，處理 `/user` API
  providers: [UserService, PrismaService], // ✅ `UserService` 用於業務邏輯
  exports: [UserService], // 🔹 讓其他模組（如 `AuthModule`）可以使用 `UserService`
})
export class UserModule {}

