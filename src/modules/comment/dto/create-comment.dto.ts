import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'Please Enter Content' })
  @IsNotEmpty({ message: 'Please Enter Valid Content' })
  readonly content: string;

  @IsString({ message: 'Please Enter AuthorId' })
  @IsNotEmpty({ message: 'Please Enter Valid AuthorId' })
  readonly authorId: string;
}
