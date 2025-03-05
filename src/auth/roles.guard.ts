import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * 角色權限守衛 (RolesGuard)
 * 這個守衛會攔截請求，檢查使用者的角色是否符合 API 的權限要求。
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * `canActivate` 方法會在請求進入控制器前執行
   */
  canActivate(context: ExecutionContext): boolean {
    // 取得請求目標所設定的角色要求
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    // 若該 API 沒有設定 `@Roles()`，則不做限制
    if (!requiredRoles) return true;

    // 取得當前請求的使用者
    const { user } = context.switchToHttp().getRequest();

    // 檢查使用者是否具有 API 需要的角色
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true; // 通過驗證，允許請求繼續
  }
}
