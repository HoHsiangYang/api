import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    UserModule, // ✅ 確保 `UserModule` 可用
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret', // ✅ 環境變數管理 JWT 秘鑰
      signOptions: { expiresIn: '1h' }, // Token 過期時間
    }),
  ],
  controllers: [AuthController], // ✅ `/auth` 相關 API 控制器
  providers: [AuthService, PrismaService], // ✅ `AuthService` 處理身份驗證
  exports: [AuthService],
})
export class AuthModule {}