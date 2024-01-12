import { User } from '@prisma/client';

export type UserIdentifier = Pick<User, 'id'>['id'];
