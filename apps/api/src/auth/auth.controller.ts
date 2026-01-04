import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService, UserWithoutPassword } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { User } from 'database/generated/prisma';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt.strategy';
import { SignupUserDto } from './dto/signup-user.dto';

type RequestWithUser = Request & { user: UserWithoutPassword };
type RequestWithJwtUser = Request & { user: JwtPayload };

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: RequestWithUser): { access_token: string } {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithJwtUser) {
    return req.user;
  }

  @Post('signup')
  async signup(@Body() signupUserDto: SignupUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(signupUserDto.password, 10);
    return this.usersService.createUser({
      ...signupUserDto,
      password: hashedPassword,
    });
  }
}
