import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReservationsService } from '../../services/reservations.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { FormErrorLabelComponent } from '../../../../shared/components/form-error-label/form-error-label.component';
import { RoomsService } from '../../../rooms/services/rooms.service';
import { Room } from '../../../rooms/interfaces/room.interface';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE
import { RoomTypePipe } from '../../../../shared/pipes/room-type.pipe'; // <-- Si tienes un pipe para el tipo
import { ReservationDTO } from '../../interfaces/reservationDTO.interface';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-reservations-create-page',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormErrorLabelComponent,
    FormsModule, // <-- IMPORTANTE
    RoomTypePipe, // <-- Si tienes un pipe para el tipo
  ],
  templateUrl: './reservations-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationsCreatePageComponent implements OnInit {
  reservationsService = inject(ReservationsService);
  roomsService = inject(RoomsService);
  fb = inject(FormBuilder);
  router = inject(Router);
  notificationService = inject(NotificationService);

  allRooms = signal<Room[]>([]);
  roomSearchText = signal<string>('');
  showRoomDropdown = signal<boolean>(false);
  wasSaved = signal<boolean>(false);
  globalError = this.notificationService.getError();

  reservationForm = this.fb.group({
    reservationsName: ['', Validators.required],
    entryDate: ['', Validators.required],
    departureDay: ['', Validators.required],
    rooms: this.fb.control<Room[]>([], Validators.required),
  });

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.roomsService.loadHotelRooms().subscribe({
      next: (rooms) => this.allRooms.set(rooms),
      error: (err) => console.error('Error loading rooms:', err),
    });
  }

  filteredRooms() {
    const search = this.roomSearchText().toLowerCase();
    return this.allRooms()
      .filter(
        (room) =>
          room.code.toLowerCase().includes(search) ||
          String(room.numberOfRooms).includes(search) ||
          (typeof room.type === 'string'
            ? room.type.toLowerCase().includes(search)
            : false)
      );
  }

  toggleRoomSelection(room: Room) {
    const selected: Room[] = this.reservationForm.get('rooms')?.value ?? [];
    const exists = selected.some((r) => r.id === room.id);
    if (exists) {
      this.reservationForm
        .get('rooms')
        ?.setValue(selected.filter((r) => r.id !== room.id));
    } else {
      this.reservationForm.get('rooms')?.setValue([...selected, room]);
    }
    this.reservationForm.get('rooms')?.markAsDirty();
  }

  getSelectedRoomsLabel() {
    const selected: Room[] = this.reservationForm.get('rooms')?.value ?? [];
    if (!selected.length) return '';
    return selected.map((r) => r.code).join(', ');
  }

  isRoomSelected(room: Room): boolean {
    const selected: Room[] = this.reservationForm.get('rooms')?.value ?? [];
    return selected.some((r) => r.id === room.id);
  }

  onDropdownFocusOut(event: FocusEvent) {
    // Si el nuevo foco está fuera del dropdown, cierra
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    const dropdown = document.querySelector('.position-relative');
    if (!dropdown?.contains(relatedTarget)) {
      this.showRoomDropdown.set(false);
    }
  }

  async onSubmit() {
    this.reservationForm.markAllAsTouched();
    if (!this.reservationForm.valid) return;

    const formValue = this.reservationForm.value;
    const roomIds = (formValue.rooms ?? [])
      .map((room: Room) => room.id)
      .filter((id): id is number => id !== null);

    const clientIds = [1];

    const entryDate = `${formValue.entryDate}T15:00:00`;
    const departureDay = `${formValue.departureDay}T11:00:00`;

    const reservationCreateData: ReservationDTO = {
      reservationsName: formValue.reservationsName ?? '',
      entryDate,
      departureDay,
      roomIds,
      clientIds,
    };

    try {
      await firstValueFrom(
        this.reservationsService.createReservation(reservationCreateData)
      );
      this.wasSaved.set(true);
      setTimeout(() => this.wasSaved.set(false), 3000);
      this.router.navigate(['/hotelsession/reservations']);
    } catch (err: any) {
      const backendMessage = err?.error?.message || 'Error desconocido';
      this.notificationService.showError(backendMessage);
    }
  }
}
