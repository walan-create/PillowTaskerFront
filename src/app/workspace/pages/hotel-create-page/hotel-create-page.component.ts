import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotelsService } from '../../services/hotels.service';
import { firstValueFrom } from 'rxjs';
import { HotelCreateDTO } from '../../interfaces/hotel-create-dto.interface';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabelComponent } from '../../../shared/components/form-error-label/form-error-label.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hotel-create-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './hotel-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelCreatePageComponent {
  hotelsService = inject(HotelsService);
  fb = inject(FormBuilder);
  router = inject(Router);

  wasSaved = signal<boolean>(false);

  hotelForm = this.fb.group(
    {
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ,.\\-]{3,}$'), // permite letras, números, espacios y algunos signos
        ],
      ],
      postalCode: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{5}$'), // exactamente 5 dígitos
        ],
      ],
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ,.\\-]{5,}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: [
        FormUtils.isFieldOneEqualFieldTwo('password', 'confirmPassword'),
      ],
    }
  );

  async onSubmit() {
    const isValid = this.hotelForm.valid;
    this.hotelForm.markAllAsTouched();

    if (!isValid) return;

    const formValue = this.hotelForm.value;
    const hotelCreateData: HotelCreateDTO = {
      name: formValue.name ?? '',
      address: formValue.address ?? '',
      postalCode: formValue.postalCode ?? '',
      password: formValue.password ?? '',
    };

    const hotel = await firstValueFrom(
      this.hotelsService.createHotel(hotelCreateData)
    );

    this.router.navigate(['/workspace/hotels']);
    console.log('Hotel creado');
  }
  //----------------------- Visibilidad de la contraseña --------------------------
  showPassword = false; // Control para mostrar/ocultar contraseña
  showConfirmPassword = false; // Control para mostrar/ocultar confirmación de contraseña

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
