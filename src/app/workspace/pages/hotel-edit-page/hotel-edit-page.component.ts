import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotelsService } from '../../services/hotels.service';
import { firstValueFrom, map } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Hotel } from '../../interfaces/hotel.interface';
import { CommonModule } from '@angular/common';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';

@Component({
  selector: 'hotel-edit-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './hotel-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelEditPageComponent{
  
  hotelsService = inject(HotelsService);
  activatedRoute = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  router = inject(Router);

  wasSaved = signal<boolean>(false);

  hotelForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    postalCode: ['', [Validators.required, Validators.minLength(5)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
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

  ngOnInit() {
    const hotelId = this.hotelId(); // Obtén el ID del hotel desde la ruta
    this.hotelsService.getHotelById(hotelId).subscribe({
      next: (hotel) => {
        if (hotel) {
          // Si el hotel está en el caché o se obtiene del servidor, carga sus datos en el formulario
          this.hotelForm.patchValue({
            name: hotel.name,
            address: hotel.address,
            postalCode: hotel.postalCode,
          });
        } else {
          console.warn(`Hotel con ID ${hotelId} no encontrado.`);
        }
      },
      error: (err) => {
        console.error('Error al obtener el hotel:', err);
      },
    });
  }

  async onSubmit() {
    const isValid = this.hotelForm.valid;
    this.hotelForm.markAllAsTouched();
    console.log('valido', isValid);
    if (!isValid) return;

    const formValue = this.hotelForm.value;
    const hotelUpdateData: Partial<Hotel> = {
      name: formValue.name ?? '',
      address: formValue.address ?? '',
      postalCode: formValue.postalCode ?? '',
    };

    await firstValueFrom(
      this.hotelsService.updateHotel(
        this.hotelResource.value()?.id ?? 0,
        hotelUpdateData
      )
    );

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }
}
