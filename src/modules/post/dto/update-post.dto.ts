import { Community } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: string;

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
