import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';

@Component({
  selector: 'invitation-confirm-modal',
  imports: [ReactiveFormsModule, FormErrorLabelComponent, CommonModule],
  templateUrl: './invitation-confirm-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationConfirmModalComponent {
  fb = inject(FormBuilder);
  showPassword: boolean = false; // Para alternar visibilidad de la contraseña

  @Output() passwordSubmitted = new EventEmitter<string>();

  passwordForm = this.fb.group({
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.passwordForm.valid) {
      const password = this.passwordForm.value.password ?? ''; // Asegurarse de que sea un string
      this.passwordSubmitted.emit(password);
      this.passwordForm.reset();
    }
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
