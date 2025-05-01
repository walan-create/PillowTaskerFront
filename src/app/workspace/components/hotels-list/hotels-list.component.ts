import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { Hotel } from '../../interfaces/hotel.interface';

@Component({
  selector: 'hotels-list',
  imports: [],
  templateUrl: './hotels-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelsListComponent {
  authService = inject(AuthService);
  hotels = input.required<Hotel[]>();









  
  //--------------------Manejo de cards desplegables------------------
  openHotelIds: Set<number> = new Set(); // Usamos un Set para manejar múltiples estados abiertos

  toggleCollapse(hotelId: number) {
    if (this.openHotelIds.has(hotelId)) {
      this.openHotelIds.delete(hotelId); // Si ya está abierto, lo cerramos
    } else {
      this.openHotelIds.add(hotelId); // Si está cerrado, lo abrimos
    }
  }

  isHotelOpen(hotelId: number): boolean {
    return this.openHotelIds.has(hotelId); // Verificamos si el hotel está abierto
  }
  //-------------------------------------------------------------------
}
