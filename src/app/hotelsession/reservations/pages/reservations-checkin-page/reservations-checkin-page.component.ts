import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReservationsService } from '../../../services/reservations.service';
import { RoomsService } from '../../../services/rooms.service';
import { ClientsService } from '../../../services/clients.service';
import { CommonModule } from '@angular/common';
import { Room } from '../../../rooms/interfaces/room.interface';
import { Client } from '../../../clients/interfaces/client.interface';
import { FormErrorLabelComponent } from '../../../../shared/components/form-error-label/form-error-label.component';
import { NotificationService } from '../../../../services/notification.service';
import { RoomTypePipe } from '@shared/pipes/room-type.pipe';
import { combineLatest, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-reservations-checkin-page',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormErrorLabelComponent,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormErrorLabelComponent,
    FormsModule,
    RoomTypePipe,
  ],
  templateUrl: './reservations-checkin-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationsCheckinPageComponent implements OnInit {
  reservationsService = inject(ReservationsService);
  roomsService = inject(RoomsService);
  clientsService = inject(ClientsService);
  activatedRoute = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  router = inject(Router);
  notificationService = inject(NotificationService);

  wasSaved = signal<boolean>(false);
  globalError = this.notificationService.getError();

  allRooms = signal<Room[]>([]);
  allClients = signal<Client[]>([]);
  roomSearchText = signal<string>('');
  clientSearchText = signal<string>('');
  showRoomDropdown = signal<boolean>(false);
  showClientDropdown = signal<boolean>(false);

  reservationId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  reservation = signal<any>(null);

  checkinForm = this.fb.group({
    clientIds: this.fb.control<Client[]>([], Validators.required),
    roomIds: this.fb.control<Room[]>([], Validators.required),
    entryDate: this.fb.control<string>('', Validators.required),
    departureDay: this.fb.control<string>('', Validators.required),
  });

  ngOnInit() {
    combineLatest([
      this.roomsService
        .loadHotelRooms()
        .pipe(tap((rooms) => this.allRooms.set(rooms))),
      this.clientsService
        .loadHotelClients()
        .pipe(tap((clients) => this.allClients.set(clients))),
    ])
      .pipe(
        switchMap(() =>
          this.reservationsService.getReservationById(this.reservationId)
        )
      )
      .subscribe({
        next: (reservation) => {
          this.reservation.set(reservation);
          this.checkinForm
            .get('roomIds')
            ?.setValue(
              this.allRooms().filter(
                (r) => r.id !== null && reservation.rooms.includes(r.id)
              )
            );
          this.checkinForm
            .get('clientIds')
            ?.setValue(
              this.allClients().filter(
                (c) => c.id !== null && reservation.occupants.includes(c.id)
              )
            );
          // Pre-carga fechas
          this.checkinForm
            .get('entryDate')
            ?.setValue(
              reservation.entryDate
                ? typeof reservation.entryDate === 'string'
                  ? reservation.entryDate.slice(0, 10)
                  : reservation.entryDate.toISOString().slice(0, 10)
                : ''
            );
          this.checkinForm
            .get('departureDay')
            ?.setValue(
              reservation.departureDay
                ? typeof reservation.departureDay === 'string'
                  ? reservation.departureDay.slice(0, 10)
                  : reservation.departureDay.toISOString().slice(0, 10)
                : ''
            );
        },
        error: (err) => {
          const backendMessage = err?.error?.message || 'Error desconocido';
          this.notificationService.showError(backendMessage);
        },
      });
  }

  filteredRooms() {
    const search = this.roomSearchText().toLowerCase();
    return this.allRooms()
      .filter(
        (room) =>
          room.state === 'AVAILABLE' ||
          this.reservation()?.rooms.includes(room.id)
      )
      .filter(
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
    const selected: Room[] = this.checkinForm.get('roomIds')?.value ?? [];
    const exists = selected.some((r) => r.id === room.id);
    if (exists) {
      this.checkinForm
        .get('roomIds')
        ?.setValue(selected.filter((r) => r.id !== room.id));
    } else {
      this.checkinForm.get('roomIds')?.setValue([...selected, room]);
    }
    this.checkinForm.get('roomIds')?.markAsDirty();
  }

  toggleClientSelection(client: Client) {
    const selected: Client[] = this.checkinForm.get('clientIds')?.value ?? [];
    const exists = selected.some((c) => c.id === client.id);
    if (exists) {
      this.checkinForm
        .get('clientIds')
        ?.setValue(selected.filter((c) => c.id !== client.id));
    } else {
      this.checkinForm.get('clientIds')?.setValue([...selected, client]);
    }
    this.checkinForm.get('clientIds')?.markAsDirty();
  }

  onDropdownFocusOut(event: FocusEvent, type: 'room' | 'client') {
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    const dropdown = event.currentTarget as HTMLElement; // <-- Cambia esto
    if (!dropdown.contains(relatedTarget)) {
      if (type === 'room') this.showRoomDropdown.set(false);
      if (type === 'client') this.showClientDropdown.set(false);
    }
  }

  onSubmit() {
    this.checkinForm.markAllAsTouched();
    if (!this.checkinForm.valid) return;

    const selectedRooms: Room[] = this.checkinForm.get('roomIds')?.value ?? [];
    const selectedClients: Client[] =
      this.checkinForm.get('clientIds')?.value ?? [];
    const entryDateRaw = this.checkinForm.get('entryDate')?.value;
    const departureDayRaw = this.checkinForm.get('departureDay')?.value;

    // Construye las fechas con hora fija
    const entryDate = entryDateRaw ? `${entryDateRaw}T15:00:00` : undefined;
    const departureDay = departureDayRaw
      ? `${departureDayRaw}T11:00:00`
      : undefined;

    this.reservationsService
      .checkinReservation(
        this.reservationId,
        selectedClients
          .map((c) => c.id)
          .filter((id): id is number => id !== null),
        selectedRooms
          .map((r) => r.id)
          .filter((id): id is number => id !== null),
        entryDate,
        departureDay
      )
      .subscribe({
        next: () => {
          this.wasSaved.set(true);
          setTimeout(() => this.wasSaved.set(false), 2000);
          this.router.navigate(['/hotelsession/reservations']);
        },
        error: (err) => {
          const backendMessage = err?.error?.message || 'Error desconocido';
          this.notificationService.showError(backendMessage);
        },
      });
  }

  isRoomSelected(room: Room): boolean {
    const selected: Room[] = this.checkinForm.get('roomIds')?.value ?? [];
    return selected.some((r) => r.id === room.id);
  }

  isClientSelected(clientId: number | null): boolean {
    const selected: Client[] = this.checkinForm.get('clientIds')?.value ?? [];
    return selected.some((c) => c.id === clientId);
  }

  getSelectedRoomsLabel(): string {
    const selected: Room[] = this.checkinForm.get('roomIds')?.value ?? [];
    if (!selected.length) return '';
    return selected.map((r) => r.code).join(', ');
  }

  getSelectedClientsLabel(): string {
    const selected: Client[] = this.checkinForm.get('clientIds')?.value ?? [];
    if (!selected.length) return '';
    return selected.map((c) => `${c.name} ${c.surname1}`).join(', ');
  }
}
