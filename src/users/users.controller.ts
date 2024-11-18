import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('user')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private usersServise: UsersService,
  ) {}

  @Post()
  async createUser(@Body() createDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.usersServise.addUser(createDto);
  }
}
