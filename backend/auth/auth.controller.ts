import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@guards/auth.guard';
import { Public } from '@decorators/public.decorator';
import { authDTO, changeEmailDTO } from '@/auth/auth.dto';
import { CurrentUser } from '@/decorators/user.decorator';
import type { User } from '@supabase/supabase-js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check-email')
  @HttpCode(200)
  @Public()
  async checkEmail(@Body() dto: authDTO) {
    await this.authService.checkEmailExists(dto.email);
  }

  @Post('change-email')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async changeEmail(@Body() dto: changeEmailDTO, @CurrentUser() user: User) {
    await this.authService.changeEmail(user.id, dto.current_email, dto.password, dto.new_email);
  }
}
