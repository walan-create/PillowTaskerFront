import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Room } from '../../interfaces/room.interface';
import { RoomsService } from '../../services/rooms.service';
import { RouterLink } from '@angular/router';
import { ListToolbarComponent } from '../../../../shared/components/list-toolbar/list-toolbar.component';
import { AppTableComponent } from '@shared/components/table/table.component';
import { AppTableColumn } from '@shared/interfaces/app-table-column.interface';
import { ReusableModalComponent } from '@shared/components/reusable-modal/reusable-modal.component';

@Component({
  selector: 'app-rooms-page',
  standalone: true,
  imports: [
    AppTableComponent,
    RouterLink,
    ListToolbarComponent,
    ReusableModalComponent,
  ],
  templateUrl: './rooms-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomsPageComponent implements OnInit {
  roomColumns: AppTableColumn<Room>[] = [
    { key: 'numberRoom', label: 'Número', headerClass: 'col-2' },
    { key: 'capacity', label: 'Capacidad', headerClass: 'col-2' },
    { key: 'type', label: 'Tipo', headerClass: 'col-2' },
    { key: 'state', label: 'Estado', headerClass: 'col-2' },
    {
      key: 'kitchen',
      label: 'Cocina',
      headerClass: 'col-2',
      cellTemplate: (row: Room) => (row.kitchen ? 'Sí' : 'No'),
    },
  ];

  roomsService = inject(RoomsService);

  searchText: string = '';
  orderBy: keyof Room = 'numberRoom';
  orderDirection: 'asc' | 'desc' = 'asc';

  rooms = computed(() => this.roomsService.rooms());
  roomIdToDelete = signal<number>(0);

  @ViewChild(ReusableModalComponent)
  reusableModal!: ReusableModalComponent;

  ngOnInit() {
    this.roomsService.loadHotelRooms().subscribe({
      next: (rooms) => this.roomsService.rooms.set(rooms),
      error: (err) => console.error('Error loading rooms:', err),
    });
  }

  onSearchTextChange(text: string) {
    this.searchText = text;
  }

  onOrderByChange(orderBy: string) {
    this.orderBy = orderBy as keyof Room;
  }

  onOrderDirectionChange(direction: 'asc' | 'desc') {
    this.orderDirection = direction;
  }

  openDeleteRoomModal(roomId: number) {
    const modalElement = document.getElementById('reusableModal');
    if (modalElement) {
      this.roomIdToDelete.set(roomId);
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  handleDeleteRoom() {
    const id = this.roomIdToDelete();
    if (id !== null) {
      this.roomsService.deleteRoom(id).subscribe({
        next: () => {
          console.log('Habitación eliminada exitosamente');
        },
        error: (err) => {
          console.error('Error al eliminar la habitación', err);
        },
      });
    }
  }
}
