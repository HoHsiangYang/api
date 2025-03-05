import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  fullName: string; // ✅ 必填

  @IsOptional()
  phone?: string; // ✅ 選填

  @IsOptional()
  address?: string; // ✅ 選填
}
