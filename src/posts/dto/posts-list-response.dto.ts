import type { PostEntity } from '../entity/posts.entity';

export class PostsListResponseDto {
  data: PostEntity[];

  pagination: {
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  };
}
