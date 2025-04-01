import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  imports: [
    RouterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {
  
  // Propiedades para el formulario de inicio de sesión
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  // Método para iniciar sesión
  login() {
    if (this.email && this.password) {
      console.log('Iniciando sesión con:', this.email, this.password);
      // Aquí iría la lógica para autenticar al usuario
    } else {
      console.error('Por favor completa todos los campos de inicio de sesión.');
    }
  }
 
  // Toggle para mostrar/ocultar la contraseña en los formularios
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
