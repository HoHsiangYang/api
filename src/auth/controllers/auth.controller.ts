// 負責處理身份驗證相關的 API
import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')//負責 /auth 開頭的 API
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register') // 註冊新用戶
  async register(@Body() body: { email: string; password: string; role?: 'admin' | 'user' , fullName:string, phone:string, address:string}) {
    return this.authService.register(body.email, body.password, body.role, body.fullName, body.phone, body.address);
  }

  @Post('forgot-password') // 忘記密碼
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password') // 重設密碼
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
