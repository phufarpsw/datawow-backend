import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from '../user/user.service';
import { CommentService } from '../comment/comment.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostController],
  providers: [PostService, UserService, CommentService],
})
export class PostModule {}
