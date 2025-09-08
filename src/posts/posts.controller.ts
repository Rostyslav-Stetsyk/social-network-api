import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/common/decorators/user.decorator';

import { PostBlockDto } from './dto/create-post.dto';
import { GetAllPostsDto } from './dto/get-all-posts.dto';
import { PostsListResponseDto } from './dto/posts-list-response.dto';
import { PostEntity } from './entity/post.entity';
import { PostsService } from './posts.service';

@Controller({
  version: '1',
  path: 'posts',
})
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

  @UseGuards(AuthGuard)
  @Post()
  async createPost(
    @Body() postBlock: PostBlockDto[],
    @User('id') userId: string,
  ): Promise<PostEntity> {
    return await this.postsService.createPost({
      author: userId,
      blocks: postBlock,
    });
  }
}
