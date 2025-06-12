import { Pipe, PipeTransform } from '@angular/core';
import { ReservationStateEnum } from '../../hotelsession/reservations/interfaces/reservation-state.enum';

@Pipe({
  name: 'reservationState',
  standalone: true
})
export class ReservationStatePipe implements PipeTransform {
  transform(value: ReservationStateEnum | string | undefined): string {
    if (value === undefined || value === null || value === '') {
      return '';
    }
    switch (value) {
      case ReservationStateEnum.PENDING:
        return 'Pendiente';
      case ReservationStateEnum.CHECKED_IN:
        return 'Checked-in';
      case ReservationStateEnum.CHECKED_OUT:
        return 'Checked-out';
      case ReservationStateEnum.CANCELED:
        return 'Cancelada';
      default:
        return value;
    }
  }
}
