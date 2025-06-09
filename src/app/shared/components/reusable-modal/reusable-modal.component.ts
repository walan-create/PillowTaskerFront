import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'reusable-modal',
  templateUrl: './reusable-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReusableModalComponent {
  @Input() modalText: string = '';
  @Input() id: string = ''; // <-- Añade esto

  @Output() accepted = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  onCancel() {
    this.canceled.emit();
  }

  onAccept() {
    this.accepted.emit();
  }
}
