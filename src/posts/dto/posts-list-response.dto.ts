import type { PostEntity } from '../entity/post.entity';

export class PostsListResponseDto {
  data: PostEntity[];

  pagination: {
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  };
}
