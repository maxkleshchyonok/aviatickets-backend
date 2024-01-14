import { Booking, RoleTypes, User } from '@prisma/client';
import { BookingDto } from './booking.dto';
import { UUIDDto } from './uuid.dto';

interface BookingsWithCount {
  count: number;
  bookings: Booking[];
}

class BookingDataDto {
  count: number;
  bookings: BookingDto[];

  static from(bookingsWithCount?: BookingsWithCount) {
    if (!bookingsWithCount) {
      return;
    }

    const it = new BookingDataDto();
    it.count = bookingsWithCount.count;
    it.bookings = BookingDto.fromEntities(bookingsWithCount.bookings);
    return it;
  }
}

export class UserDto extends UUIDDto {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  roleType: RoleTypes;
  bookingData?: BookingDataDto;

  static fromEntity(entity?: User, bookingsWithCount?: BookingsWithCount) {
    if (!entity) {
      return;
    }

    const it = new UserDto();
    it.id = entity.id;
    it.createdAt = entity.createdAt.valueOf();
    it.updatedAt = entity.updatedAt.valueOf();
    it.firstName = entity.firstName;
    it.lastName = entity.lastName;
    it.email = entity.email;
    it.roleId = entity.roleId;
    it.roleType = entity.roleType;
    it.bookingData = BookingDataDto.from(bookingsWithCount);
    return it;
  }

  static fromEntities(entities?: User[]) {
    if (!entities?.map) {
      return;
    }

    return entities.map((entity) => this.fromEntity(entity));
  }
}
