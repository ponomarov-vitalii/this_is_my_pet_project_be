import { ApiProperty } from '@nestjs/swagger';

export class SessionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  deviceId!: string;

  @ApiProperty({ required: false, nullable: true })
  ipAddress!: string | null;

  @ApiProperty({ required: false, nullable: true })
  userAgent!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  lastActiveAt!: Date;

  @ApiProperty()
  expiresAt!: Date;
}
