import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-modal',
  imports: [
    RouterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss'
})
export class RegisterModalComponent {
  
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
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log("Registrando usuario:", this.name, this.email);
    // Aquí puedes llamar a un servicio de autenticación
  }
}
