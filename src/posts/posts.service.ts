import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entity/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { GetAllPostsDto } from './dto/get-all-posts.dto';
import { PostsListResponseDto } from './dto/posts-list-response.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAllPosts({
    itemsPerPage,
    page: currentPage,
  }: GetAllPostsDto): Promise<PostsListResponseDto> {
    const cacheKey = `allPosts:itemsPerPage:${itemsPerPage}:page:${currentPage}`;

    const cachedResponse = (await this.cacheManager.get(
      cacheKey,
    )) as PostsListResponseDto;

    if (cachedResponse) return cachedResponse;

    const [data, totalItems] = await this.postsRepository.findAndCount({
      skip: itemsPerPage * (currentPage - 1),
      take: itemsPerPage,
    });

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages < currentPage)
      throw new BadRequestException(
        `The requested page (${currentPage}) exceeds the total number of pages (${totalPages}).`,
      );

    const response = {
      data,
      pagination: {
        totalPages,
        currentPage,
        itemsPerPage,
        totalItems,
      },
    };

    await this.cacheManager.set(
      cacheKey,
      JSON.stringify(response),
      1 * 60 * 60 * 1000,
    );

    return response;
  }

  async createPost(postData: CreatePostDto): Promise<PostEntity> {
    const post = this.postsRepository.create({
      ...postData,
    });

    const result = await this.postsRepository.save(post);

    const cacheKeys = await this.cacheManager.store.keys('allPosts:*');

    if (cacheKeys.length > 0) {
      await this.cacheManager.store.mdel(...cacheKeys);
    }

    return result;
  }
}
