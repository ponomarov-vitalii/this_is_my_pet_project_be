import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    minLength: 8,
    description: 'At least 8 chars, include letters & numbers',
  })
  @IsString()
  @Length(8, 128)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'password must contain at least one letter and one number',
  })
  password!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  lastName?: string;

  @ApiProperty({
    required: false,
    description: 'Unique username; validated server-side',
  })
  @IsOptional()
  @IsString()
  @Length(3, 30)
  username?: string;
}
