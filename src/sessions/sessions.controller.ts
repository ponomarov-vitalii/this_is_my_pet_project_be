import {
  Controller,
  Get,
  Delete,
  Param,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SessionResponseDto } from './dto/session-response.dto';

@ApiTags('Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'auth', version: '1' })
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('sessions')
  @ApiOperation({ summary: 'List active sessions for current user' })
  @ApiOkResponse({ type: SessionResponseDto, isArray: true })
  async list(@CurrentUser() user: { userId: string }) {
    return this.sessionsService.listUserSessions(user.userId);
  }

  @Delete('sessions/:id')
  @ApiOperation({ summary: 'Revoke a session by id' })
  async revoke(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    await this.sessionsService.revoke(user.userId, id);
    return { success: true };
  }

  @Post('logout-all')
  @ApiOperation({ summary: 'Logout from all devices' })
  async logoutAll(@CurrentUser() user: { userId: string }) {
    await this.sessionsService.revokeAll(user.userId);
    return { success: true };
  }
}
