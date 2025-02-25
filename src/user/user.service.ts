import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    console.log('收到請求:', createUserDto);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('❌ Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    console.log('加密密碼:', hashedPassword);

    const newUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
      },
    });

    console.log('用戶已儲存至資料庫');
    return { message: 'User registered successfully' };
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: Partial<CreateUserDto>) {
    await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return { message: 'User updated successfully' };
  }

  async remove(id: number) {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
