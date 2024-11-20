import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class Block {
  @IsString()
  type: string;

  @IsObject()
  data: object;
}

export class CreatePostDto {
  @IsUUID()
  author: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Block)
  blocks: Block[];
}
