import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { Room } from '../../../rooms/interfaces/room.interface';
import { NgClass, TitleCasePipe } from '@angular/common';
import { RoomTypePipe } from '@shared/pipes/room-type.pipe';
import { RoomStatePipe } from '@shared/pipes/room-state.pipe';

@Component({
  selector: 'support-card',
  standalone: true,
  imports: [NgClass, RoomTypePipe, RoomStatePipe],
  templateUrl: './support-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportCardComponent {
  room = input.required<Room>();
  @Output() solicitarConfirmacion = new EventEmitter<number>();

  onSolicitarConfirmacion() {
    this.solicitarConfirmacion.emit(this.room().id!);
  }
}
