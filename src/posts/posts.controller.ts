import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetAllPostsDto } from './dto/get-all-posts.dto';
import { PostEntity } from './entity/posts.entity';
import { PostsListResponseDto } from './dto/posts-list-response.dto';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(PostsService)
    private postsService: PostsService,
  ) {}

  @Get()
  async getAllPosts(
    @Query() findAllPostsDto: GetAllPostsDto,
  ): Promise<PostsListResponseDto> {
    return await this.postsService.findAllPosts(findAllPostsDto);
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return await this.postsService.createPost(createPostDto);
  }
}
