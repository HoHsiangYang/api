import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default_secret', // 解析 JWT 用的密鑰
    });
  }

  async validate(payload: { id: number; email: string; role: string, fullName:string, phone:string, address:string}) {
    console.log('🔍 JWT Payload:', payload); // ✅ 檢查 JWT 解析出的內容
    return { id: payload.id, email: payload.email, role: payload.role , fullName: payload.fullName , phone: payload.phone , address: payload.address }; // JWT 驗證成功後返回的用戶資訊
  }
}
