import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Hotel } from '../../interfaces/hotel.interface';
import { AuthService } from '@auth/services/auth.service';
import { HotelsService } from '../../services/hotels.service';

@Component({
  selector: 'hotels-table',
  imports: [],
  templateUrl: './hotels-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelsTableComponent {

  authService = inject(AuthService);
  hotelsService = inject(HotelsService);

  hotels = input.required<Hotel[]>()

  onDelete(hotelId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar el hotel?')) {
      this.hotelsService
        .deleteHotel(hotelId)
        .subscribe({
          next: () => {
            console.log('Hotel eliminado exitosamente');
          },
          error: (err) => {
              console.log('Error al eliminar el hotel', err);
          },
        });
    }
  }

}
