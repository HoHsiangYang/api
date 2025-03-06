import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';
import { AdminCreateUserDto } from '../dto/admin-create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // 取得所有用戶
  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        address: true,
        role: true,
      },
    });
  }

  // 取得單一用戶
  async findUserById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // 更新用戶
  async updateUser(id: number, updateUserDto: AdminUpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  // 刪除用戶
  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  // 新增用戶 (Admin 用)
  async createUser(createUserDto: AdminCreateUserDto) {
    // 檢查 email 是否已存在
    const existingUser = await this.prisma.user.findUnique({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 創建新用戶
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        fullName: createUserDto.fullName,
        phone: createUserDto.phone,
        address: createUserDto.address,
        role: createUserDto.role,
      },
    });
  }
}
