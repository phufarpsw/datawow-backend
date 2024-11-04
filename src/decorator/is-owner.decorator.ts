import { SetMetadata } from '@nestjs/common';

export const IS_POST_OWNER = 'isPostOwner';
export const IsPostOwner = () => SetMetadata(IS_POST_OWNER, true);
