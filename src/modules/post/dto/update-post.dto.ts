import { Community } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsEnum(Community)
  @IsOptional()
  readonly community?: Community;

  @IsString()
  @IsNotEmpty()
  readonly authorId: string;
}
