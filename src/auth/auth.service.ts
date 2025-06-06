import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthPayloadDto } from './dto/auth.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from '../MailService'; // Still using nodemailer here

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  // Helper to generate OTP and its expiration time
  private generateOtp(): { otp: string; otpExpires: number } {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds
    return { otp, otpExpires };
  }

  // Helper to send OTP email using nodemailer
  private async sendOtpEmail(
    to: string,
    otp: string,
    name: string,
  ): Promise<void> {
    const subject = 'Your OTP Code';
    const templateName = 'otp-email';
    const context = { name, otp };
    await this.mailService.sendMail(to, subject, templateName, context);
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id }
    });
  }

  // User signup with OTP
  async signup(
    signupDto: SignupDto,
  ): Promise<{ id: number; name: string; email: string }> {
    const { name, email, password } = signupDto;

    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      console.log(existingUser);
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const { otp } = this.generateOtp();
    // Create new user with OTP
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      otp,
    });

    console.log(newUser);
    // Save the user to the database
    await this.userRepository.save(newUser);

    // Send OTP email
    await this.sendOtpEmail(email, otp, name);

    // Return the payload with user details
    return { id: newUser.id, name: newUser.name, email: newUser.email };
  }

  // Resend OTP
  async resendOtp(email: string): Promise<{ message: string }> {
    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a new OTP and update the user
    const { otp } = this.generateOtp();
    user.otp = otp;
    // user.otpExpires = otpExpires; // Store as a timestam

    // Save updated OTP to the user
    await this.userRepository.save(user);

    // Send the OTP via email
    await this.sendOtpEmail(user.email, otp, user.name);

    return { message: 'OTP resent successfully' };
  }

  // Verify OTP and login the user
  async verifyOtp(email: string, otp: string): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the OTP matches and hasn't expired
    // const currentTime = new Date();
    if (user.otp !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // OTP is valid, generate JWT token
    const payload = { id: user.id, name: user.name, email: user.email };
    const token = this.jwtService.sign(payload);

    // Clear OTP and expiration once verified
    user.otp = null;
    // user.otpExpires = null;
    await this.userRepository.save(user);

    return { token };
  }

  // Verify OTP for forgot password
  async verifyOtp2(
    email: string,
    otp: string,
  ): Promise<{ success: boolean; message: string; token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // // Check if the OTP matches and hasn't expired
    // const currentTime = Date.now();
    if (user.otp !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // OTP is valid, generate JWT token
    const payload = { id: user.id, name: user.name, email: user.email };
    const token = this.jwtService.sign(payload);

    // OTP is valid, clear OTP and expiration once verified
    user.otp = null;
    // user.otpExpires = null;
    await this.userRepository.save(user);
    //
    // // Return success status for frontend verification
    return {
      success: true,
      message: 'OTP verified successfully',
      token: token,
    };
  }

  // Validate user login (via email/password)
  async validateUser({
    email,
    password,
  }: AuthPayloadDto): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }
  // Admin login logic
  async adminLogin(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    // console.log(user);
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }
  async sendForgotPasswordOtp(email: string): Promise<{ message: string }> {
    // Check if the email exists in the system
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email not found');
    }

    // Generate a new OTP and update the user
    const { otp } = this.generateOtp();
    user.otp = otp;
    // user.otpExpires = otpExpires;

    // Save updated OTP to the user
    await this.userRepository.save(user);

    // Send the OTP via email
    await this.sendOtpEmail(user.email, otp, user.name);

    return { message: 'OTP sent successfully' };
  }
  // Verify OTP and Reset Password
  async resetPassword(
    email: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);

    return { success: true, message: 'Password reset successfully' };
  }
}
