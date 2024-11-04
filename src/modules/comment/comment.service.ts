import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}
  public async createComment(
    postId: string,
    createCommentDto: CreateCommentDto,
  ) {
    try {
      const comment: Prisma.CommentsUncheckedCreateInput = {
        postId,
        content: createCommentDto.content,
        authorId: createCommentDto.authorId,
      };
      const { id } = await this.prisma.comments.create({
        data: comment,
      });
      return id;
    } catch (error) {
      throw error;
    }
  }

  public async getCommentsByPostId(postId: string) {
    try {
      const comments = await this.prisma.comments.findMany({
        where: { postId },
      });
      return comments;
    } catch (error) {
      throw error;
    }
  }
}
