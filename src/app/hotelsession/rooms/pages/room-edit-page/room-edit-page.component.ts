import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { RoomTypeEnum } from '../../interfaces/room-type.enum';
import { RoomStateEnum } from '../../interfaces/room-state.enum';
import { RoomsService } from '../../../services/rooms.service';
import { firstValueFrom, map } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Room } from '../../interfaces/room.interface';

@Component({
  selector: 'room-edit-page',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './room-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomEditPageComponent {
  // Servicios y helpers
  roomsService = inject(RoomsService);
  activatedRoute = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  router = inject(Router);

  // Estado para mostrar mensaje de guardado
  wasSaved = signal<boolean>(false);

  // Formulario reactivo
  roomForm = this.fb.group({
    code: ['', [Validators.required]],
    numberOfRooms: [1, [Validators.required]],
    capacity: [1, [Validators.required, Validators.min(1)]],
    kitchen: [false, [Validators.required]],
    type: [null as RoomTypeEnum | null, [Validators.required]],
    state: [null as RoomStateEnum | null, [Validators.required]],
  });

  // Enums para los dropdowns
  roomTypes = Object.values(RoomTypeEnum);
  roomStates = Object.values(RoomStateEnum);

  // Obtener el ID de la habitación desde la ruta como signal reactivo
  roomId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );

  // rxResource para obtener la habitación reactiva y cacheada
  roomResource = rxResource({
    request: () => ({
      id: this.roomId(),
    }),
    loader: ({ request }) => {
      return this.roomsService.getRoomById(request.id);
    },
  });

  ngOnInit() {
    // Cargar los datos de la habitación en el formulario al iniciar
    const roomId = this.roomId();
    this.roomsService.getRoomById(roomId).subscribe({
      next: (room) => {
        if (room) {
          this.roomForm.patchValue({
            code: room.code,
            capacity: room.capacity,
            numberOfRooms: room.numberOfRooms,
            kitchen: room.kitchen,
            type: room.type,
            state: room.state,
          });
        } else {
          console.warn(`Habitación con ID ${roomId} no encontrada.`);
        }
      },
      error: (err) => {
        console.error('Error al obtener la habitación:', err);
      },
    });
  }

  async onSubmit() {
    this.roomForm.markAllAsTouched();
    console.log('valido', this.roomForm.valid);
    if (!this.roomForm.valid) return;

    const formValue = this.roomForm.value;
    const roomUpdateData: Partial<Room> = {
      code: formValue.code ?? '',
      capacity: formValue.capacity ?? 1,
      numberOfRooms: formValue.numberOfRooms ?? 1,
      kitchen: formValue.kitchen ?? false,
      type: formValue.type!,
      state: formValue.state!,
    };

    await firstValueFrom(
      this.roomsService.updateRoom(
        this.roomResource.value()?.id ?? 0,
        roomUpdateData
      )
    );

    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 3000);
  }
}
