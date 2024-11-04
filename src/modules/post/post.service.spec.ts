import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsDto } from './dto/get-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Community } from '@prisma/client';

describe('PostService', () => {
  let service: PostService;
  let prismaService: PrismaService;
  let userService: UserService;
  const validUserId = '123e4567-e89b-12d3-a456-426614174000'; // Valid UUID for user
  const validPostId = '789e4567-e89b-12d3-a456-426614174000'; // Valid UUID for post

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: {
            posts: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: UserService,
          useValue: {
            checkExistingUser: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a post if user exists', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Understanding TypeScript',
        description:
          'A comprehensive guide on TypeScript features and best practices.',
        community: Community.History,
        authorId: validUserId,
      };

      jest.spyOn(prismaService.posts, 'create').mockResolvedValue({
        id: validPostId,
        title: createPostDto.title,
        description: createPostDto.description,
        community: createPostDto.community,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: validUserId,
      });

      const result = await service.createPost(createPostDto);
      expect(result).toEqual(validPostId);
      expect(userService.checkExistingUser).toHaveBeenCalledWith(validUserId);
      expect(prismaService.posts.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Understanding TypeScript',
          description:
            'A comprehensive guide on TypeScript features and best practices.',
          community: Community.History,
          authorId: validUserId,
        }),
      });
    });

    it('should throw an error if user does not exist', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Understanding TypeScript',
        description:
          'A comprehensive guide on TypeScript features and best practices.',
        community: Community.History,
        authorId: 'invalid-uuid',
      };

      jest.spyOn(userService, 'checkExistingUser').mockResolvedValue(false);

      await expect(service.createPost(createPostDto)).rejects.toThrowError(
        'User not found',
      );
      expect(userService.checkExistingUser).toHaveBeenCalledWith(
        'invalid-uuid',
      );
    });
  });

  describe('getPosts', () => {
    it('should return posts with comment count', async () => {
      const getPostsDto: GetPostsDto = { title: 'TypeScript' };

      const mockPosts = [
        {
          id: validPostId,
          title: 'Understanding TypeScript',
          description:
            'A comprehensive guide on TypeScript features and best practices.',
          community: Community.History,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: validUserId,
          user: { id: validUserId, name: 'Jane Doe' },
          _count: { Comments: 10 },
        },
      ];

      jest.spyOn(prismaService.posts, 'findMany').mockResolvedValue(mockPosts);

      const result = await service.getPosts(getPostsDto);
      expect(result).toEqual(mockPosts);
      expect(prismaService.posts.findMany).toHaveBeenCalledWith({
        where: {
          title: { contains: 'TypeScript', mode: 'insensitive' },
        },
        include: {
          user: true,
          _count: { select: { Comments: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getPostById', () => {
    it('should return a post if it exists', async () => {
      const mockPost = {
        id: validPostId,
        title: 'Understanding TypeScript',
        description:
          'A comprehensive guide on TypeScript features and best practices.',
        community: Community.History,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: validUserId,
        user: { id: validUserId, name: 'Jane Doe' },
      };
      jest.spyOn(prismaService.posts, 'findUnique').mockResolvedValue(mockPost);

      const result = await service.getPostById(validPostId);
      expect(result).toEqual(mockPost);
      expect(prismaService.posts.findUnique).toHaveBeenCalledWith({
        where: { id: validPostId },
        include: { user: true },
      });
    });

    it('should throw an error if post does not exist', async () => {
      jest.spyOn(prismaService.posts, 'findUnique').mockResolvedValue(null);

      await expect(service.getPostById('nonexistent-id')).rejects.toThrowError(
        NotFoundException,
      );
      expect(prismaService.posts.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
        include: { user: true },
      });
    });
  });

  describe('updatePostById', () => {
    it('should update a post if it exists', async () => {
      const updatePostDto: UpdatePostDto = {
        id: validPostId,
        title: 'Updated TypeScript Guide',
        description: 'An updated guide on TypeScript features.',
        community: Community.History,
        authorId: validUserId,
      };

      const mockUpdatedPost = {
        id: validPostId,
        title: updatePostDto.title,
        description: updatePostDto.description,
        community: updatePostDto.community,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: updatePostDto.authorId,
      };

      jest
        .spyOn(prismaService.posts, 'update')
        .mockResolvedValue(mockUpdatedPost);

      const result = await service.updatePostById(validPostId, updatePostDto);
      expect(result).toEqual(mockUpdatedPost);
      expect(prismaService.posts.update).toHaveBeenCalledWith({
        where: { id: validPostId },
        data: updatePostDto,
      });
    });
  });
});
