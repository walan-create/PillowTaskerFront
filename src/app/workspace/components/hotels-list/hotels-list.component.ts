import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { Hotel } from '../../interfaces/hotel.interface';
import { RouterLink } from '@angular/router';
import { HotelsService } from '../../services/hotels.service';
import { ReusableModalComponent } from '@shared/components/reusable-modal/reusable-modal.component';

@Component({
  selector: 'hotels-list',
  imports: [RouterLink, ReusableModalComponent],
  templateUrl: './hotels-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelsListComponent {
  authService = inject(AuthService);
  hotelsService = inject(HotelsService);

  hotels = input.required<Hotel[]>();
  hotelIdToDelete = signal<number>(0);

  @ViewChild(ReusableModalComponent)
  reusableModal!: ReusableModalComponent;

  openDeleteHotelModal(hotelId: number) {
    const modalElement = document.getElementById('reusableModal');
    if (modalElement) {
      this.hotelIdToDelete.set(hotelId);
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  handleDeleteHotel() {
    this.hotelsService.deleteHotel(this.hotelIdToDelete()).subscribe({
      next: () => {
        console.log('Hotel eliminado exitosamente');
      },
      error: (err) => {
        console.log('Error al eliminar el hotel', err);
      },
    });
  }

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
