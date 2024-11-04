import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Please Enter Username' })
  @IsNotEmpty({ message: 'Please Enter Valid Username' })
  readonly username: string;
}
