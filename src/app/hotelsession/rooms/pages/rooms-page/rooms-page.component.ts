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
import { BreakpointService } from '../../../../services/breakpoint.service';
import { AppListComponent } from '../../../../shared/components/list/list.component';
import { RoomStatePipe } from '@shared/pipes/room-state.pipe';
import { RoomTypePipe } from '@shared/pipes/room-type.pipe';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-rooms-page',
  standalone: true,
  imports: [
    AppTableComponent,
    RouterLink,
    ListToolbarComponent,
    ReusableModalComponent,
    AppListComponent,
  ],
  templateUrl: './rooms-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomsPageComponent implements OnInit {
  roomsService = inject(RoomsService);
  breakpointService = inject(BreakpointService);
  notificationService = inject(NotificationService);

  roomColumns: AppTableColumn<Room>[] = [
    { key: 'code', label: 'Código', headerClass: 'col-1' },
    { key: 'numberOfRooms', label: 'Habitaciones', headerClass: 'col-2' },
    { key: 'capacity', label: 'Capacidad', headerClass: 'col-2' },
    {
      key: 'type',
      label: 'Tipo',
      headerClass: 'col-2',
      cellTemplate: (row: any) => new RoomTypePipe().transform(row.type),
    },
    {
      key: 'state',
      label: 'Estado',
      headerClass: 'col-2',
      cellTemplate: (row: any) => new RoomStatePipe().transform(row.state),
    },
    {
      key: 'kitchen',
      label: 'Cocina',
      headerClass: 'col-1',
      cellTemplate: (row: Room) => (row.kitchen ? 'Sí' : 'No'),
    },
  ];

  globalError = this.notificationService.getError();
  searchText: string = '';
  orderBy: keyof Room = 'numberOfRooms';
  orderDirection: 'asc' | 'desc' = 'asc';

  rooms = computed(() => this.roomsService.rooms());
  roomIdToDelete = signal<number>(0);

  @ViewChild(ReusableModalComponent)
  reusableModal!: ReusableModalComponent;

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.roomsService.loadHotelRooms().subscribe({
      next: (rooms) => this.roomsService.rooms.set(rooms),
      error: (err) => {
        this.notificationService.showError(
          err?.error?.message || 'Error al cargar habitaciones'
        );
      },
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
          this.notificationService.showError(
            err?.error?.message || 'Error al eliminar la habitación'
          );
        },
      });
    }
  }

  get isMobileOrTablet() {
    return this.breakpointService.isMobileOrTablet;
  }
}
