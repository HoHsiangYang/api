// 處理 user 相關的 API 請求
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator'; // 🔹 自定義 `@Roles()` 裝飾器


@Controller('user') // 🔹 這個 Controller 負責處理 `/user` 開頭的 API 路由
@UseGuards(JwtAuthGuard, RolesGuard) // 🔐 **全域套用 JWT 驗證，確保所有 API 需要登入**
export class UserController {
  constructor(private readonly userService: UserService) {} // 🔹 依賴注入 `UserService`，用於處理業務邏輯

  /**
   *  🟢 取得所有用戶（Admin 限制）
   *  這個 API 只有 `admin` 才能存取
   */
  @Get()
  @Roles('admin') // ✅ **只有 `admin` 可以存取**
  @UseGuards(JwtAuthGuard, RolesGuard) // 🔐 **角色權限管理**
  getAllUsers() {
    return this.userService.findAll(); // 🔹 取得所有用戶
  }

  /**
   * 🟢 取得當前登入用戶的資訊
   * ✅ `user` 和 `admin` 都能存取
   */
  @Get('me')
  getProfile(@Request() req) {
    return req.user; // 🔹 回傳當前登入的用戶資訊
  }

  /**
   * 🟢 取得單一用戶資訊（Admin 或用戶本人）
   * ✅ `admin` 可以查詢所有用戶，`user` 只能查詢自己的資訊
   */
  @Get(':id')
  @UseGuards(RolesGuard) // 🔐 **檢查角色權限**
  getUserById(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'admin' && req.user.id !== Number(id)) {
      throw new ForbiddenException('You can only access your own profile');
    }
    return this.userService.findOne(Number(id)); // 🔹 透過 `id` 查詢用戶
  }

  /**
   * 🟢 註冊新用戶
   * ✅ **不需要登入，所有人都可以註冊**
   */
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto); // 🔹 創建新用戶
  }

  /**
   * 🟢 更新用戶資料（僅限 `admin` 或用戶本人）
   */
  @Patch(':id')
  @UseGuards(RolesGuard) // 🔐 **檢查角色權限**
  updateUser(@Param('id') id: string, @Body() updateUserDto: Partial<CreateUserDto>, @Request() req) {
    if (req.user.role !== 'admin' && req.user.id !== Number(id)) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.userService.update(Number(id), updateUserDto); // 🔹 更新用戶資料
  }

  /**
   * 🟢 刪除用戶（僅限 `admin`）
   */
  @Delete(':id')
  @Roles('admin') // ✅ **只有 `admin` 可以存取**
  @UseGuards(RolesGuard) // 🔐 **角色權限管理**
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(Number(id)); // 🔹 刪除用戶
  }

  @Patch('profile') // 🟢 更新個人資料 API
  async updateProfile(@Request() req, @Body() updateData: { fullName?: string; phone?: string; address?: string }) {
    return this.userService.update(req.user.id, updateData);
  }
}
