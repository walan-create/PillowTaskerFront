import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  //--------------- Inyección de dependencias y señales reactivas -------------------
  fb = inject(FormBuilder); // Inyecta el servicio FormBuilder para manejar formularios reactivos.
  router = inject(Router); // Inyecta el servicio Router para la navegación.
  authService = inject(AuthService); // Inyecta el servicio AuthService para manejar la autenticación.
  notificationService = inject(NotificationService); // Servicio para manejo de errores

  hasError = signal<boolean>(false); // Señal para manejar el estado de error en el formulario.

  globalError = this.notificationService.getError(); // Señal reactiva para errores globales

  //--------------- Definición del formulario -------------------
  loginForm = this.fb.group({
    mail: ['', [Validators.required, Validators.email]], // Campo de email con validaciones: requerido y formato de email.
    password: ['', [Validators.required, Validators.minLength(6)]], // Campo de contraseña con validaciones: requerido y longitud mínima de 6 caracteres.
  });

  showPassword: boolean = false; // Para alternar visibilidad de la contraseña

  //--------------- Método para manejar el envío del formulario -------------------
  onSubmit() {
    // Verifica si el formulario es inválido.
    if (this.loginForm.invalid) {
      this.hasError.set(true); // Activa la señal de error.
      setTimeout(() => {
        this.hasError.set(false); // Desactiva la señal de error después de 2 segundos.
      }, 2000);
      return; // Detiene la ejecución si el formulario no es válido.
    }

    // Extrae los valores del formulario.
    const { mail = '', password = '' } = this.loginForm.value;

    // Llama al servicio de autenticación para iniciar sesión.
    this.authService
      .login(mail!, password!) // Llama al método `login` del servicio AuthService.
      .subscribe({
        next: (isAuthenticated) => {
          if (isAuthenticated) {
            this.router.navigateByUrl('/workspace'); // Si la autenticación es exitosa, redirige al usuario a la página principal.
          } else {
            this.hasError.set(true);
            setTimeout(() => this.hasError.set(false), 2000);
          }
        },
        error: (err) => {
          // Agrega logs para depuración
          console.log('Error recibido en login:', err);
          console.log('err.error:', err?.error);
          console.log('err.error.message:', err?.error?.message);

          // Extrae el mensaje del backend correctamente
          const backendMessage = err?.error?.message || 'Error desconocido';
          this.notificationService.showError(backendMessage); // Muestra el error globalmente
        },
      });
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
