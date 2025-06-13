import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReservationsService } from '../../../services/reservations.service';
import { RoomsService } from '../../../services/rooms.service';
import { ClientsService } from '../../../services/clients.service';
import { RoomTypePipe } from '@shared/pipes/room-type.pipe';
import { Room } from '../../../rooms/interfaces/room.interface';
import { Client } from '../../../clients/interfaces/client.interface';
import { ReservationStateEnum } from '../../interfaces/reservation-state.enum';
import { combineLatest, tap, switchMap } from 'rxjs';
import { ReservationStatePipe } from '../../../../shared/pipes/reservation-state.pipe';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-reservations-edit-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    RoomTypePipe,
    ReservationStatePipe,
  ],
  templateUrl: './reservations-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationsEditPageComponent implements OnInit {
  reservationsService = inject(ReservationsService);
  roomsService = inject(RoomsService);
  clientsService = inject(ClientsService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  notificationService = inject(NotificationService);

  reservationId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

  // Para dropdowns y búsqueda
  allRooms = signal<Room[]>([]);
  allClients = signal<Client[]>([]);
  roomSearchText = signal<string>('');
  clientSearchText = signal<string>('');
  showRoomDropdown = signal<boolean>(false);
  showClientDropdown = signal<boolean>(false);
  globalError = this.notificationService.getError();

  reservationForm = this.fb.group({
    reservationsName: this.fb.control('', Validators.required),
    clientIds: this.fb.control<Client[]>([]),
    roomIds: this.fb.control<Room[]>([], Validators.required),
    entryDate: this.fb.control<string>('', Validators.required),
    departureDay: this.fb.control<string>('', Validators.required),
    state: this.fb.control('PENDING', Validators.required),
    earlyDeparture: this.fb.control(false, Validators.required),
  });

  ngOnInit() {
    combineLatest([
      this.roomsService
        .loadHotelRooms()
        .pipe(tap((rooms) => this.allRooms.set(rooms ?? []))),
      this.clientsService
        .loadHotelClients()
        .pipe(tap((clients) => this.allClients.set(clients ?? []))),
    ])
      .pipe(
        switchMap(() =>
          this.reservationsService.getReservationById(this.reservationId)
        )
      )
      .subscribe({
        next: (reservation) => {
          this.reservationForm.patchValue({
            reservationsName: reservation.reservationsName,
            clientIds: this.allClients().filter((c) =>
              reservation.occupants.includes(c.id)
            ),
            roomIds: this.allRooms().filter(
              (r) =>
                r.id != null &&
                (reservation.rooms ?? [])
                  .filter((id): id is number => id != null)
                  .includes(r.id)
            ),
            entryDate: reservation.entryDate
              ? typeof reservation.entryDate === 'string'
                ? reservation.entryDate.slice(0, 10)
                : reservation.entryDate.toISOString().slice(0, 10)
              : '',
            departureDay: reservation.departureDay
              ? typeof reservation.departureDay === 'string'
                ? reservation.departureDay.slice(0, 10)
                : reservation.departureDay.toISOString().slice(0, 10)
              : '',
            state: reservation.state,
            earlyDeparture: reservation.earlyDeparture,
          });
        },
        error: (err) => {
          // Manejo de error si lo necesitas
        },
      });
  }

  filteredRooms() {
    const search = this.roomSearchText().toLowerCase();
    return this.allRooms().filter(
      (room) =>
        room.code.toLowerCase().includes(search) ||
        String(room.numberOfRooms).includes(search)
    );
  }

  filteredClients() {
    const search = this.clientSearchText().toLowerCase();
    return this.allClients().filter(
      (client) =>
        client.name.toLowerCase().includes(search) ||
        client.surname1.toLowerCase().includes(search) ||
        client.surname2.toLowerCase().includes(search) ||
        client.nif.toLowerCase().includes(search)
    );
  }

  toggleRoomSelection(room: Room) {
    const selected: Room[] = this.reservationForm.get('roomIds')?.value ?? [];
    const exists = selected.some((r) => r.id === room.id);
    if (exists) {
      this.reservationForm
        .get('roomIds')
        ?.setValue(selected.filter((r) => r.id !== room.id));
    } else {
      this.reservationForm.get('roomIds')?.setValue([...selected, room]);
    }
    this.reservationForm.get('roomIds')?.markAsDirty();
  }

  toggleClientSelection(client: Client) {
    const selected: Client[] =
      this.reservationForm.get('clientIds')?.value ?? [];
    const exists = selected.some((c) => c.id === client.id);
    if (exists) {
      this.reservationForm
        .get('clientIds')
        ?.setValue(selected.filter((c) => c.id !== client.id));
    } else {
      this.reservationForm.get('clientIds')?.setValue([...selected, client]);
    }
    this.reservationForm.get('clientIds')?.markAsDirty();
  }

  isRoomSelected(room: Room): boolean {
    const selected: Room[] = this.reservationForm.get('roomIds')?.value ?? [];
    return selected.some((r) => r.id === room.id);
  }

  isClientSelected(clientId: number | null): boolean {
    const selected: Client[] =
      this.reservationForm.get('clientIds')?.value ?? [];
    return selected.some((c) => c.id === clientId);
  }

  getSelectedRoomsLabel(): string {
    const selected: Room[] = this.reservationForm.get('roomIds')?.value ?? [];
    if (!selected.length) return '';
    return selected.map((r) => r.code).join(', ');
  }

  getSelectedClientsLabel(): string {
    const selected: Client[] =
      this.reservationForm.get('clientIds')?.value ?? [];
    if (!selected.length) return '';
    return selected.map((c) => `${c.name} ${c.surname1}`).join(', ');
  }

  onDropdownFocusOut(event: FocusEvent, type: 'room' | 'client') {
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    const dropdown = event.currentTarget as HTMLElement;
    if (!dropdown.contains(relatedTarget)) {
      if (type === 'room') this.showRoomDropdown.set(false);
      if (type === 'client') this.showClientDropdown.set(false);
    }
  }

  onSubmit() {
    if (this.reservationForm.invalid) {
      console.log(
        'Formulario inválido',
        this.reservationForm.value,
        this.reservationForm.errors
      );
      return;
    }
    if (this.reservationForm.invalid) return;
    const formValue = this.reservationForm.value;

    // Construye el DTO exactamente como lo espera el backend
    const dto = {
      reservationsName: formValue.reservationsName ?? '',
      entryDate: formValue.entryDate ? `${formValue.entryDate}T15:00:00` : '',
      departureDay: formValue.departureDay
        ? `${formValue.departureDay}T11:00:00`
        : '',
      state:
        ReservationStateEnum[
          formValue.state as keyof typeof ReservationStateEnum
        ] ?? ReservationStateEnum.PENDING,
      earlyDeparture: formValue.earlyDeparture ?? false,
      roomIds: (formValue.roomIds as Room[])
        .map((r) => r.id)
        .filter((id): id is number => id != null),
      clientIds: (formValue.clientIds as Client[])
        .map((c) => c.id)
        .filter((id): id is number => id != null),
    };

    this.reservationsService
      .updateReservation(this.reservationId, dto)
      .subscribe({
        next: () => this.router.navigate(['/hotelsession/reservations']),
        error: (err) => {
          const backendMessage = err?.error?.message || 'Error desconocido';
          this.notificationService.showError(backendMessage);
        },
      });
  }
}
