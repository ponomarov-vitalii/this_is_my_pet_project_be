import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';
import type { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiOkResponse({ type: TokensDto })
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const deviceId = (req.headers['x-device-id'] as string) || null;
    const ip = req.ip;
    const ua = req.headers['user-agent'];
    return this.authService.login(dto.email, dto.password, deviceId, ip, ua);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens (rotating)' })
  @ApiOkResponse({ type: TokensDto })
  async refresh(@Body() body: { sessionId: string; refreshToken: string }) {
    return this.authService.refresh(body.sessionId, body.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout from current device (by session id)' })
  async logout(@Body() body: { sessionId: string }) {
    await this.authService.logout(body.sessionId);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('sessions')
  @ApiOperation({ summary: 'List active sessions for current user' })
  async listSessions(@CurrentUser() user: { userId: string }) {
    return this.authService['sessionsService'].listUserSessions(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('sessions/:id')
  @ApiOperation({ summary: 'Revoke a session by id for current user' })
  async revokeSession(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    await this.authService['sessionsService'].revoke(user.userId, id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout-all')
  @ApiOperation({ summary: 'Logout from all devices' })
  async logoutAll(@CurrentUser() user: { userId: string }) {
    await this.authService['sessionsService'].revokeAll(user.userId);
    return { success: true };
  }
}
