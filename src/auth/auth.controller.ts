import { Body, Controller, Get, Post, Req, UseGuards, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Body() authPayload: AuthPayloadDto) {
    // console.log(authPayload);
    return this.authService.validateUser(authPayload);
  }

  @Post('verify-otp')
  async verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
    if (!email || !otp) {
      throw new BadRequestException('Email and OTP are required');
    }
    return this.authService.verifyOtp(email, otp);
  }

  @Post('verify-otp-forgot-password')
  async verifyOtp2(@Body('email') email: string, @Body('otp') otp: string) {
    if (!email || !otp) {
      throw new BadRequestException('Email and OTP are required');
    }
    return this.authService.verifyOtp2(email, otp);
  }

  @Post('resend-otp')
  async resendOtp(@Body('email') email: string) {
    return this.authService.resendOtp(email);
  }

  // New endpoint for sending OTP for forgot password
  @Post('send-forgot-password-otp')
  async sendForgotPasswordOtp(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    // Call the service method to generate and send the OTP
    return this.authService.sendForgotPasswordOtp(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    // Manual validation
    if (!email || !email.includes('@')) {
      throw new BadRequestException('A valid email is required');
    }
    console.log(password);
    if (!password || password.length < 8) {
      throw new BadRequestException(
        'New password must be at least 8 characters',
      );
    }

    return this.authService.resetPassword(email, password);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async status(@Req() req: any) {
    const userId = req.user['id'];
    const user = await this.authService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  @Post('admin/login')
  async adminLogin(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.authService.adminLogin(email, password);
  }
}
