import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entity/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { GetAllPostsDto } from './dto/get-all-posts.dto';
import { PostsListResponseDto } from './dto/posts-list-response.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
  ) {}

  async findAllPosts({
    itemsPerPage,
    page,
  }: GetAllPostsDto): Promise<PostsListResponseDto> {
    const [data, totalItems] = await this.postsRepository.findAndCount({
      skip: itemsPerPage * (page - 1),
      take: itemsPerPage,
    });

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = page;

    if (totalPages < currentPage)
      throw new BadRequestException(
        `The requested page (${page}) exceeds the total number of pages (${totalPages}).`,
      );

    return {
      data: data,
      pagination: {
        totalPages,
        currentPage,
        itemsPerPage,
        totalItems,
      },
    };
  }

  async createPost(postData: CreatePostDto): Promise<PostEntity> {
    const post = this.postsRepository.create({
      ...postData,
    });

    return await this.postsRepository.save(post);
  }
}
