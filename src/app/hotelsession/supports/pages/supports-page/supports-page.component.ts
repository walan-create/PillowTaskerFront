import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { RoomsService } from '../../../rooms/services/rooms.service';
import { RoomStateEnum } from '../../../rooms/interfaces/room-state.enum';
import { ReusableModalComponent } from '@shared/components/reusable-modal/reusable-modal.component';
import { SupportCardComponent } from "../../components/support-card/support-card.component";

@Component({
  selector: 'app-supports-page',
  standalone: true,
  templateUrl: './supports-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReusableModalComponent, SupportCardComponent],
})
export class SupportsPageComponent implements OnInit {
  roomsService = inject(RoomsService);

  supportRooms = computed(() =>
    this.roomsService
      .rooms()
      .filter((room) => room.state === 'DIRTY' || room.state === 'MAINTENANCE')
  );

  roomIdToResolve = signal<number>(0);

  ngOnInit() {
    if (this.roomsService.getLocalRooms().length === 0) {
      this.roomsService.loadHotelRooms().subscribe({
        next: (rooms) => {
          this.roomsService.rooms.set(rooms);
          localStorage.setItem('hotelRooms', JSON.stringify(rooms));
        },
        error: (err) => {
          console.error('Error al cargar habitaciones:', err);
        },
      });
    } else {
      this.roomsService.rooms.set(this.roomsService.getLocalRooms());
    }
  }

  openResolveRoomModal(roomId: number) {
    console.log(roomId);
    const modalElement = document.getElementById('reusableModal');
    if (modalElement) {
      this.roomIdToResolve.set(roomId);
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  handleResolveRoom() {
  const id = this.roomIdToResolve();
  if (id !== null) {
    // Busca la habitación original
    const room = this.roomsService.rooms().find(r => r.id !== null && r.id === id);
    if (!room) return;

    // Crea un nuevo objeto con el estado actualizado
    const updatedRoom = {
      ...room,
      state: RoomStateEnum.AVAILABLE
    };

    this.roomsService
      .updateRoom(id, updatedRoom)
      .subscribe({
        next: () => {
          // Aquí se podrían recargar habitaciones
        },
        error: (err) => {
          console.error('Error al actualizar la habitación', err);
        },
      });
  }
}

  get modalText(): string {
    const id = this.roomIdToResolve();
    if (id === null) return '';
    const room = this.roomsService.rooms().find(r => r.id !== null && r.id === id);
    if (!room) return '';
    return room.state === 'DIRTY'
      ? '¿Seguro que quieres marcar la habitación como limpia?'
      : '¿Seguro que quieres marcar la habitación como reparada?';
  }
}
