import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './register-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptPolicy: boolean = false;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register() {
    if (!this.acceptPolicy) {
      alert('Debes aceptar la política de privacidad.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log('Registrando usuario:', this.name, this.email);
    // Aquí puedes llamar a un servicio de autenticación
  }
}
