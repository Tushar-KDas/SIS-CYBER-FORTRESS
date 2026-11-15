import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MfaVerifyDto {
  @ApiProperty({ example: '123456', description: '6-digit TOTP verification code' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'MFA token must be exactly 6 digits.' })
  code!: string;
}
