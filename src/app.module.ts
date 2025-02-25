import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    UserModule,
    AuthModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
