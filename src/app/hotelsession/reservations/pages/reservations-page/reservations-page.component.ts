import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ViewChild,
} from '@angular/core';
import { ReservationsService } from '../../services/reservations.service';
import { AppTableComponent } from '@shared/components/table/table.component';
import { RouterLink } from '@angular/router';
import { ListToolbarComponent } from '@shared/components/list-toolbar/list-toolbar.component';
import { ReusableModalComponent } from '@shared/components/reusable-modal/reusable-modal.component';
import { Reservation } from '../../interfaces/reservation.interface';
import { AppTableColumn } from '@shared/interfaces/app-table-column.interface';
import { BreakpointService } from '../../../../services/breakpoint.service';
import { AppListComponent } from '../../../../shared/components/list/list.component';
import { ReservationStatePipe } from '@shared/pipes/reservation-state.pipe';

@Component({
  selector: 'app-reservations-page',
  standalone: true,
  imports: [
    AppTableComponent,
    RouterLink,
    ListToolbarComponent,
    ReusableModalComponent,
    AppListComponent,
  ],
  templateUrl: './reservations-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationsPageComponent implements OnInit {
  reservationsService = inject(ReservationsService);
  breakpointService = inject(BreakpointService);

  reservationColumns: AppTableColumn<Reservation>[] = [
    { key: 'reservationsName', label: 'Titular', headerClass: 'col-2' },
    {
      key: 'rooms',
      label: 'Habs.',
      headerClass: 'col-1',
      cellTemplate: (row: Reservation) => row.rooms?.length ?? 0,
    },
    {
      key: 'occupants',
      label: 'Clientes',
      headerClass: 'col-1',
      cellTemplate: (row: Reservation) => row.occupants?.length ?? 0,
    },
    {
      key: 'entryDate',
      label: 'Entrada',
      headerClass: 'col-1',
      cellTemplate: (row: Reservation) =>
        row.entryDate instanceof Date && !isNaN(row.entryDate.getTime())
          ? row.entryDate.toLocaleDateString()
          : '',
    },
    {
      key: 'departureDay',
      label: 'Salida',
      headerClass: 'col-1',
      cellTemplate: (row: Reservation) =>
        row.departureDay instanceof Date && !isNaN(row.departureDay.getTime())
          ? row.departureDay.toLocaleDateString()
          : '',
    },
    { key: 'state', label: 'Estado', headerClass: 'col-2', cellTemplate: (row: any) => new ReservationStatePipe().transform(row.state) },
    {
      key: 'earlyDeparture',
      label: 'Salida Anticipada',
      headerClass: 'col-2',
      cellTemplate: (row: Reservation) => (row.earlyDeparture ? 'Sí' : 'No'),
    },
  ];

  searchText = '';
  orderBy: keyof Reservation = 'entryDate';
  orderDirection: 'asc' | 'desc' = 'asc';

  reservations = computed(() => this.reservationsService.reservations());
  reservationIdToDelete = signal<number>(0);
  reservationIdToCheckout = signal<number>(0);

  @ViewChild(ReusableModalComponent)
  reusableModal!: ReusableModalComponent;

  ngOnInit() {
    this.reservationsService.loadHotelReservations().subscribe();
  }

  onSearchTextChange(text: string) {
    this.searchText = text;
  }

  onOrderByChange(orderBy: string) {
    this.orderBy = orderBy as keyof Reservation;
  }

  onOrderDirectionChange(direction: 'asc' | 'desc') {
    this.orderDirection = direction;
  }

  openDeleteReservationModal(reservationId: number) {
    const modalElement = document.getElementById('reusableModalDelete');
    if (modalElement) {
      this.reservationIdToDelete.set(reservationId);
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  handleDeleteReservation() {
    const id = this.reservationIdToDelete();
    if (id !== null) {
      this.reservationsService.deleteReservation(id).subscribe({
        next: () => {
          console.log('Reserva eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error al eliminar la reserva', err);
        },
      });
    }
  }

  openCheckoutReservationModal(reservationId: number) {
    const modalElement = document.getElementById('reusableModalCheckout');
    if (modalElement) {
      this.reservationIdToCheckout.set(reservationId);
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  handleCheckoutReservation() {
    const id = this.reservationIdToCheckout();
    if (id !== null) {
      this.reservationsService.checkoutReservation(id).subscribe({
        next: () => {
          console.log('CheckOut realizado exitosamente');
        },
        error: (err) => {
          console.error('Error al hacer el CheckOut', err);
        },
      });
    }
  }

  get isMobileOrTablet() {
    return this.breakpointService.isMobileOrTablet;
  }
}
