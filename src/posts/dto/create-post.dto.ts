import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmptyObject,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class PostBlockDto {
  @IsString()
  type: string;

  @IsNotEmptyObject()
  @IsObject()
  data: object;
}

export class CreatePostDto {
  @IsUUID()
  author: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostBlockDto)
  blocks: PostBlockDto[];
}
