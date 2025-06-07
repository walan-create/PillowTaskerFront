import { Pipe, PipeTransform } from '@angular/core';
import { RoomTypeEnum } from '../../hotelsession/rooms/interfaces/room-type.enum';

@Pipe({
  name: 'roomType',
  standalone: true
})
export class RoomTypePipe implements PipeTransform {
  transform(value: RoomTypeEnum | string | undefined): string {
    if (value === undefined || value === null || value === '') {
      return '';
    }
    switch (value) {
      case RoomTypeEnum.SUITE:
        return 'Suite';
      case RoomTypeEnum.ADAPTABLE:
        return 'Adaptable';
      case RoomTypeEnum.STANDAR:
        return 'Estándar';
      default:
        return value;
    }
  }
}
