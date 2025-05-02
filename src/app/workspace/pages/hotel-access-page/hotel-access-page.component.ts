import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Hotel } from '../../interfaces/hotel.interface';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HotelsService } from '../../services/hotels.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { HotelAccessService } from '@auth/services/hotel-access.service';

@Component({
  selector: 'app-hotel-access-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './hotel-access-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelAccessPageComponent {

  hotelsService = inject(HotelsService);
  activatedRoute = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  router = inject(Router);
  hotelAccessService = inject(HotelAccessService);

  accessSuccess = signal<boolean>(false);
  hasError = signal<boolean>(false); // Señal para manejar el estado de error en el formulario.

  showPassword: boolean = false; // Para alternar visibilidad de la contraseña

  accessForm = this.fb.group({
    password: ['', [Validators.required]],
  });

  hotelId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );

  hotelResource = rxResource({
    request: () => ({
      id: this.hotelId(),
    }),
    loader: ({ request }) => {
      return this.hotelsService.getHotelById(request.id);
    },
  });

  async onAccessSubmit() {
    if (this.accessForm.invalid) {
      console.log('Formulario inválido. Acceso no enviado.');
      return; // Detiene la ejecución si el formulario no es válido.
    }

    const password = this.accessForm.value.password!;
    const hotelId = this.hotelId(); // Aun no se como sacar el id
    console.log(`Enviando solicitud de acceso para hotelId: ${hotelId} y password ${password}`);

    this.hotelAccessService.validateAccess(hotelId, password)
    .subscribe((isAccessOk) => {
      if (isAccessOk) {
        console.log('Acceso concedido al hotel:', this.hotelResource.value()?.name);
        this.router.navigateByUrl('/workspace'); // Si la autenticación es exitosa, redirige al usuario a la página principal.
        this.accessSuccess.set(true);
      } else {
        console.warn('Acceso denegado.');
        this.hasError.set(true); // Si falla, activa la señal de error.
        setTimeout(() => {
          this.hasError.set(false); // Desactiva la señal de error después de 2 segundos.
        }, 2000);
      }
      return;
    });
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
