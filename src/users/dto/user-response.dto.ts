import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ required: false })
  username?: string | null;

  @ApiProperty({ required: false })
  firstName?: string | null;

  @ApiProperty({ required: false })
  lastName?: string | null;

  @ApiProperty({ required: false })
  avatar?: string | null;

  @ApiProperty({ enum: ['USER', 'ADMIN', 'MODERATOR'] })
  role!: 'USER' | 'ADMIN' | 'MODERATOR';

  @ApiProperty({
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'],
  })
  status!: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

  @ApiProperty({ required: false })
  emailVerified?: boolean;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  updatedAt!: Date;
}
