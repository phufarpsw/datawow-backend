import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { Prisma } from '@prisma/client';
import { GetPostsDto } from './dto/get-post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}
  public async createPost(createPostDto: CreatePostDto) {
    try {
      await this.userService.checkExistingUser(createPostDto.authorId);
      const post: Prisma.PostsUncheckedCreateInput = {
        title: createPostDto.title,
        description: createPostDto.description,
        community: createPostDto.community,
        authorId: createPostDto.authorId,
      };
      const { id } = await this.prisma.posts.create({
        data: post,
      });
      return id;
    } catch (error) {
      throw error;
    }
  }

  public async getPosts(getPostsDto: GetPostsDto) {
    try {
      const { title, community } = getPostsDto;
      const posts = await this.prisma.posts.findMany({
        where: {
          ...(title && { title: { contains: title, mode: 'insensitive' } }),
          ...(community && { community }),
        },
        include: {
          user: true,
          _count: {
            select: {
              Comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return posts;
    } catch (error) {
      throw error;
    }
  }

  public async getPostById(id: string) {
    try {
      const post = await this.prisma.posts.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });
      return post;
    } catch (error) {
      throw error;
    }
  }

  public async updatePostById(id: string, updatePostDto: UpdatePostDto) {
    try {
      const updatedPost = await this.prisma.posts.update({
        where: { id, authorId: updatePostDto.authorId },
        data: {
          title: updatePostDto.title,
          description: updatePostDto.description,
          community: updatePostDto.community,
        },
      });
      return updatedPost;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Post with ID ${id} not found`);
      } else {
        throw new InternalServerErrorException('Error updating post');
      }
    }
  }

  public async deletePostById(id: string) {
    return this.prisma
      .$transaction(async (prisma) => {
        await prisma.comments.deleteMany({
          where: { postId: id },
        });
        await prisma.posts.delete({
          where: { id },
        });
        return true;
      })
      .catch((error) => {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        }
        throw error;
      });
  }
}
