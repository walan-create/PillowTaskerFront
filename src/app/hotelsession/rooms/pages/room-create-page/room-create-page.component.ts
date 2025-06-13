import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { RoomTypeEnum } from '../../interfaces/room-type.enum';
import { RoomStateEnum } from '../../interfaces/room-state.enum';
import { RoomsService } from '../../../services/rooms.service';
import { firstValueFrom } from 'rxjs';
import { Room } from '../../interfaces/room.interface';

@Component({
  selector: 'app-room-create-page',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './room-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomCreatePageComponent {
  roomsService = inject(RoomsService);
  fb = inject(FormBuilder);
  router = inject(Router);

  wasSaved = signal<boolean>(false);

  roomForm = this.fb.group({
    code: ['', [Validators.required]],
    numberOfRooms: [1, [Validators.required]],
    capacity: [1, [Validators.required, Validators.min(1)]],
    kitchen: [false, [Validators.required]],
    type: [RoomTypeEnum.STANDAR, [Validators.required]],
    state: [RoomStateEnum.AVAILABLE],
  });

  roomTypes = Object.values(RoomTypeEnum);
  roomStates = Object.values(RoomStateEnum);

  async onSubmit() {
    this.roomForm.markAllAsTouched();
    if (!this.roomForm.valid) return;

    const formValue = this.roomForm.value;
    const roomCreateData: Room = {
      id: null, // Lo enviamos como null para que el back le asigne un id automático
      code: formValue.code ?? '',
      capacity: formValue.capacity ?? 1,
      numberOfRooms: formValue.numberOfRooms ?? 1,
      kitchen: formValue.kitchen ?? false,
      type: formValue.type!,
      state: formValue.state!,
    };

    await firstValueFrom(this.roomsService.createRoom(roomCreateData));
    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 3000);
    this.router.navigate(['/hotelsession/rooms']);
  }
}
