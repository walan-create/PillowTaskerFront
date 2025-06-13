import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { ClientsService } from '../../../services/clients.service';
import { firstValueFrom } from 'rxjs';
import { Client } from '../../interfaces/client.interface';

@Component({
  selector: 'app-client-create-page',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './client-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCreatePageComponent {
  clientsService = inject(ClientsService);
  fb = inject(FormBuilder);
  router = inject(Router);

  today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
  wasSaved = signal<boolean>(false);

  clientForm = this.fb.group({
    nif: ['', [Validators.required, Validators.pattern('^[0-9]{8}[A-Z]$')]],
    name: [
      '',
      [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]{2,}$')],
    ],
    surname1: [
      '',
      [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]{2,}$')],
    ],
    surname2: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]{2,}$')]],
    birthDate: [
      '',
      [
        Validators.required,
        // Puedes agregar un validador personalizado para fecha pasada si lo necesitas
      ],
    ],
    nationality: ['', [Validators.required]],
    address: ['', [Validators.required]],
    postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
  });

  async onSubmit() {
    this.clientForm.markAllAsTouched();
    if (!this.clientForm.valid) return;

    const formValue = this.clientForm.value;
    const clientCreateData: Omit<Client, 'id'> = {
      nif: formValue.nif ?? '',
      name: formValue.name ?? '',
      surname1: formValue.surname1 ?? '',
      surname2: formValue.surname2 ?? '',
      birthDate: formValue.birthDate
        ? new Date(formValue.birthDate)
        : new Date(),
      nationality: formValue.nationality ?? '',
      address: formValue.address ?? '',
      postalCode: formValue.postalCode ?? '',
      phoneNumber: formValue.phoneNumber ?? '',
    };

    await firstValueFrom(this.clientsService.createClient(clientCreateData));
    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 3000);
    this.router.navigate(['/hotelsession/clients']);
  }
}
