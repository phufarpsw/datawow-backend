import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [CommentService, PrismaService],
})
export class CommentModule {}
