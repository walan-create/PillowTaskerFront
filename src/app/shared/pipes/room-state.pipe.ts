import { Pipe, PipeTransform } from '@angular/core';
import { RoomStateEnum } from '../../hotelsession/rooms/interfaces/room-state.enum';

@Pipe({
  name: 'roomState',
  standalone: true
})
export class RoomStatePipe implements PipeTransform {
  transform(value: RoomStateEnum | string | undefined): string {
    if (value === undefined || value === null || value === '') {
      return '';
    }
    switch (value) {
      case RoomStateEnum.AVAILABLE:
        return 'Disponible';
      case RoomStateEnum.OCCUPIED:
        return 'Ocupada';
      case RoomStateEnum.DIRTY:
        return 'Sucia';
      case RoomStateEnum.MAINTENANCE:
        return 'Mantenimiento';
      default:
        return value;
    }
  }
}
