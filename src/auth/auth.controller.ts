import { Controller, Request, UseGuards, Post, Get, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { MyAuthGuard } from './guard/auth.guard';
import { CreateUserDto } from 'src/models/user.model';

@Controller('auth')
@Controller()
export class authController {
  constructor(
    private readonly authService: AuthService) {}

  // POST : auth/register
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user._doc);
  }

  // POST : auth/register
  @Post('register')
  async create(@Body() user :CreateUserDto) {
     return this.authService.create(user);
  }

  // GET : auth/profile
  @UseGuards(MyAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
