import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';

export class AdminCreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(['admin', 'user'])
  role: 'admin' | 'user';

  @IsOptional() 
  @IsString()
  phone?: string;

  @IsOptional() 
  @IsString()
  address?: string;
}
