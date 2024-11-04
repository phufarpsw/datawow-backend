import { Community } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetPostsDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(Community, { message: 'community must be a valid enum value' })
  community?: Community;
}
