import { Controller, Get, Patch, Param, Delete, UseGuards, Body, Post } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';
import { AdminCreateUserDto } from '../dto/admin-create-user.dto';

@Controller('admin/users') // `/admin/users` 為基礎路徑
@UseGuards(JwtAuthGuard, RolesGuard) // 需要登入 + 角色驗證
@Roles('admin') // 只有 `admin` 可以存取
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 取得所有用戶
  @Get()
  getAllUsers() {
    return this.adminService.findAllUsers();
  }

  // 取得單一用戶
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.adminService.findUserById(Number(id));
  }

  // 更新用戶 (使用 DTO)
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: AdminUpdateUserDto) {
    return this.adminService.updateUser(Number(id), updateUserDto);
  }

  // 刪除用戶
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(Number(id));
  }

  // 新增用戶 (使用 DTO)
  @Post()
  createUser(@Body() createUserDto: AdminCreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }
}
