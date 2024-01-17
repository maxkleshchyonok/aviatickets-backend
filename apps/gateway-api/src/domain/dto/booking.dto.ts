import { Booking, BookingStatuses, User, BookingItem } from '@prisma/client';
import { BookingItemDto } from './booking-item.dto';
import { UserDto } from './user.dto';
import { UUIDDto } from './uuid.dto';

export class BookingDto extends UUIDDto {
  status: BookingStatuses;
  price: number;
  user: UserDto;
  bookingItems: BookingItemDto[];

  static fromEntity(
    entity?: Booking & { user?: User } & { bookingItems?: BookingItem[] },
  ) {
    if (!entity) {
      return;
    }

    const it = new BookingDto();
    it.id = entity.id;
    it.createdAt = entity.createdAt.valueOf();
    it.updatedAt = entity.updatedAt.valueOf();
    it.status = entity.status;
    it.price = entity.price;
    it.user = UserDto.fromEntity(entity.user);
    it.bookingItems = BookingItemDto.fromEntities(entity.bookingItems);
    return it;
  }

  static fromEntities(entities?: Booking[]) {
    if (!entities?.map) {
      return;
    }

    return entities.map((entity) => this.fromEntity(entity));
  }
}
