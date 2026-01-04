import { Prisma } from 'database/generated/prisma';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupUserDto implements Prisma.UserCreateInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
