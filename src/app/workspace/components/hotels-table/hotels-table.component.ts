import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { Hotel } from '../../interfaces/hotel.interface';
import { AuthService } from '@auth/services/auth.service';
import { HotelsService } from '../../services/hotels.service';
import { RouterLink } from '@angular/router';
import { ReusableModalComponent } from '@shared/components/reusable-modal/reusable-modal.component';

@Component({
  selector: 'hotels-table',
  imports: [RouterLink, ReusableModalComponent],
  templateUrl: './hotels-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelsTableComponent {
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
}
