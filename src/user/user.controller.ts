//處理 user 相關的 API 請求
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';


@Controller('user')//@Controller('user') 表示這個 Controller 負責處理 /user 開頭的 API 路由
export class UserController {
  constructor(private readonly userService: UserService) {}//依賴注入 當 UserController 接到請求時，會呼叫 UserService 來處理邏輯

  @Get()//取得所有用戶
  getAllUsers(){
    return this.userService.findAll();
  }

  @Get(':id')//取得單一用戶
  getUserById(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @Post()//註冊用戶
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')//更新用戶資料
  updateUser(@Param('id') id: string, @Body() updateUserDto: Partial<CreateUserDto>) {
    return this.userService.update(Number(id), updateUserDto);
  }

  @Delete(':id')//刪除用戶
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(Number(id));
  }
}
