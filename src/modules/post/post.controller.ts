import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IsPostOwner } from 'src/decorator/is-owner.decorator';
import { PostOwnershipGuard } from 'src/guard/post-ownership.guard';
import { CommentService } from '../comment/comment.service';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { GetPostsDto } from './dto/get-post.dto';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return await this.postService.createPost(createPostDto);
  }

  @Get()
  async getAllPosts(@Query() getPostsDto: GetPostsDto) {
    return await this.postService.getPosts(getPostsDto);
  }

  @Get(':id')
  async getPostbyId(@Param('id') id: string) {
    return await this.postService.getPostById(id);
  }

  @Patch(':id')
  @IsPostOwner()
  @UseGuards(PostOwnershipGuard)
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return await this.postService.updatePostById(id, updatePostDto);
  }

  @Delete(':id')
  @IsPostOwner()
  @UseGuards(PostOwnershipGuard)
  async deleteById(@Param('id') id: string) {
    return await this.postService.deletePostById(id);
  }

  @Post(':id/comment')
  async createComment(
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentService.createComment(postId, createCommentDto);
  }

  @Get(':id/comment')
  async getCommentByPostId(@Param('id') postId: string) {
    return await this.commentService.getCommentsByPostId(postId);
  }
}
