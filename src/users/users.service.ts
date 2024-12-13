import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async addUser(userData: CreateUserDto): Promise<UserResponseDto> {
    const saltOrRounds = 10;

    const password = await bcrypt.hash(userData.password, saltOrRounds);

    const existingUser = await this.usersRepository.find({
      where: [
        {
          email: userData.email,
        },
        {
          username: userData.username,
        },
      ],
    });

    if (existingUser.length !== 0)
      throw new ConflictException('User already exists.');

    const user = this.usersRepository.create({
      ...userData,
      password,
    });

    const savedUser = await this.usersRepository.save(user);

    return plainToInstance(UserResponseDto, savedUser);
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });

    return user;
  }
}
