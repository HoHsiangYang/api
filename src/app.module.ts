import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,  // 負責 user API
    AuthModule,  // 負責身份驗證 API
  ],
  providers: [PrismaService],  // PrismaService 提供 DB 服務
  exports: [PrismaService],  // 讓其他 module（如 UserModule）可以使用 PrismaService
})
export class AppModule {}
