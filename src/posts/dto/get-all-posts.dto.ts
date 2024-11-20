import { IsInt, IsPositive } from 'class-validator';

export class GetAllPostsDto {
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @IsInt()
  @IsPositive()
  itemsPerPage?: number = 10;
}
