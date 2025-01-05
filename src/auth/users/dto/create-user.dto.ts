import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  username?: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 0,
    minSymbols: 0,
  })
  password: string;
}
