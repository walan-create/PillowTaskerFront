import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User } from '@auth/interfaces/user.interface';
import { AuthService } from '@auth/services/auth.service';
import { FormUtils } from '@utils/form-utils';
import { NotificationService } from '../../../services/notification.service';
import { FormErrorLabelComponent } from "../../../shared/components/form-error-label/form-error-label.component";

@Component({
  selector: 'app-register-page',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './register-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  //--------------- Inyección de dependencias -------------------
  fb = inject(FormBuilder); // Inyecta el servicio FormBuilder para manejar formularios reactivos.
  hasError = signal<boolean>(false); // Señal para manejar el estado de error en el formulario.
  isPosting = signal<boolean>(false); // Señal para manejar el estado de carga (posting).
  router = inject(Router); // Inyecta el servicio Router para la navegación.
  authService = inject(AuthService); // Inyecta el servicio AuthService para manejar la autenticación.
  notificationService = inject(NotificationService); // Servicio para manejo de errores

  globalError = this.notificationService.getError(); // Señal reactiva para errores globales
  password: string = '';
  confirmPassword: string = '';
  acceptPolicy: boolean = false;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  //--------------- Definición del formulario -------------------
  registerForm = this.fb.group(
    {
      mail: ['', [Validators.required, Validators.email]], // Campo de email con validaciones: requerido y formato de email.
      name: ['', [Validators.required]],
      surname1: ['', [Validators.required]],
      surname2: ['', [Validators.required]],
      dni: ['', [Validators.required, FormUtils.validDni]], // Agregamos el validador de DNI.
      password: ['', [Validators.required, Validators.minLength(6)]], // Campo de contraseña con validaciones: requerido y longitud mínima de 6 caracteres.
      password2: ['', Validators.required],
    },
    {
      //Añadimos Validadores a nivel global del formulario
      validators: [FormUtils.isFieldOneEqualFieldTwo('password', 'password2')],
    }
  );

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    // Verifica si el formulario es inválido.
    if (this.registerForm.invalid) {
      this.hasError.set(true); // Activa la señal de error.
      setTimeout(() => {
        this.hasError.set(false); // Desactiva la señal de error después de 2 segundos.
      }, 2000);
      return; // Detiene la ejecución si el formulario no es válido.
    }

    // Extrae los valores del formulario y construye el objeto User.
    const user: User = {
      id: 0,
      mail: this.registerForm.value.mail || '',
      password: this.registerForm.value.password || '',
      name: this.registerForm.value.name || '',
      surname1: this.registerForm.value.surname1 || '',
      surname2: this.registerForm.value.surname2 || '',
      dni: this.registerForm.value.dni || '',
    };

    // Llama al servicio de autenticación para iniciar sesión.
    this.authService.register(user).subscribe({
      next: (isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/workspace');
        } else {
          this.hasError.set(true);
          setTimeout(() => this.hasError.set(false), 2000);
        }
      },
      error: (err) => {

        // Muestra el mensaje personalizado del backend
        const backendMessage = err?.error?.message || 'Error desconocido';
        this.notificationService.showError(backendMessage);
      },
    });
  }
}
