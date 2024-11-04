import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_POST_OWNER } from 'src/decorator/is-owner.decorator';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class PostOwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPostOwner = this.reflector.getAllAndOverride<boolean>(
      IS_POST_OWNER,
      [context.getHandler(), context.getClass()],
    );

    if (!isPostOwner) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.body.userId;
    const postId = request.params.id;

    const post = await this.prisma.posts.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this post',
      );
    }

    return true;
  }
}
