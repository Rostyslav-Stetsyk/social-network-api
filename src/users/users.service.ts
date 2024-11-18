import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async addUser(userData: CreateUserDto): Promise<UserResponseDto> {
    const saltOrRounds = 10;

    const password = await bcrypt.hash(userData.password, saltOrRounds);

    const user = this.usersRepository.create({
      ...userData,
      password,
    });

    const savedUser = await this.usersRepository.save(user, {});

    const { password: _, ...publicData } = savedUser;

    return publicData;
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });

    return user;
  }
}
