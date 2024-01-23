import { Booking, User } from '@prisma/client';

export type UserIdentifier = Pick<User, 'id'>['id'];
export type BookingIdentifier = Pick<Booking, 'id'>;
