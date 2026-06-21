import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Request() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('me')
  updateMe(@Request() req: any, @Body() body: Partial<{ name: string; skillLevel: string; city: string; profilePhoto: string }>) {
    return this.usersService.update(req.user.id, body);
  }

  @Get('me/playpals')
  getPlaypals(@Request() req: any) {
    return this.usersService.getPlaypals(req.user.id);
  }

  @Get('search')
  search(@Request() req: any) {
    return this.usersService.search('');
  }
}
