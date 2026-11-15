import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'superadmin@sisfortress.cyber' })
  @IsEmail({}, { message: 'A valid email address is required.' })
  email!: string;

  @ApiProperty({ example: 'Fortress#SuperAdmin2026!' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  password!: string;

  @ApiPropertyOptional({ example: '123456', description: '6-digit TOTP code if MFA enabled' })
  @IsOptional()
  @IsString()
  mfaCode?: string;
}
