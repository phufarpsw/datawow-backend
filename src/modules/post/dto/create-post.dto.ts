import { Community } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsEnum(Community)
  @IsNotEmpty()
  readonly community: Community;

  @IsString()
  @IsNotEmpty()
  readonly authorId: string;
}
