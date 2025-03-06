import { SetMetadata } from '@nestjs/common';

/**
 * 自定義修飾符 `@Roles()`，讓 API 可以設定角色權限
 * @example `@Roles('admin')`
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
