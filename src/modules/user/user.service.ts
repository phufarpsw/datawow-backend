import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async checkExistingUser(userId: string) {
    try {
      const existingUser = await this.prisma.users.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        throw new NotFoundException('User Not Found');
      }
      return existingUser;
    } catch (error) {
      throw error;
    }
  }

  public async login(createUserInput: CreateUserDto) {
    try {
      const user = await this.prisma.users.upsert({
        where: { username: createUserInput.username },
        update: {},
        create: createUserInput,
      });
      return user;
    } catch {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
