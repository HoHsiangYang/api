import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 🟢 **用戶登入**
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });

    return { access_token: token }; 
  }

  // 🟢 **用戶註冊**
  async register(email: string, password: string, role: 'admin' | 'user' = 'user') {
    // **檢查 email 是否已存在**
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // **加密密碼**
    const hashedPassword = await bcrypt.hash(password, 10);

    // **創建新用戶**
    const newUser = await this.prisma.user.create({
      data: { 
        email, 
        password:  hashedPassword, 
        role: role as 'user' | 'admin',
      },
    });

    return { message: 'User registered successfully', userId: newUser.id, role: newUser.role };
  }

  // 🟢 **取得當前用戶資訊**
  async getProfile(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return { id: user.id, email: user.email };
  }

  // 🟢 **忘記密碼**
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    // 產生密碼重設 Token（有效期 15 分鐘）
    const resetToken = this.jwtService.sign({ email }, { expiresIn: '15m' });

    // 🔹 這裡應該整合 `nodemailer` 發送 Email，這邊簡單返回 Token
    return { message: 'Reset password email sent', resetToken };
  }

  // 🟢 **重設密碼**
  async resetPassword(token: string, newPassword: string) {
    try {
      const { email } = this.jwtService.verify(token); // 驗證 Token
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new NotFoundException('User not found');

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({ where: { email }, data: { password: hashedPassword } });

      return { message: 'Password reset successful' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
