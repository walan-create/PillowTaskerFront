import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { ClientsService } from '../../../services/clients.service';
import { firstValueFrom, map } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Client } from '../../interfaces/client.interface';

@Component({
  selector: 'app-clients-edit-page',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './clients-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsEditPageComponent {
  clientsService = inject(ClientsService);
  activatedRoute = inject(ActivatedRoute);
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

  clientId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );

  clientResource = rxResource({
    request: () => ({
      id: this.clientId(),
    }),
    loader: ({ request }) => {
      return this.clientsService.getClientById(request.id);
    },
  });

  ngOnInit() {
    const clientId = this.clientId();
    this.clientsService.getClientById(clientId).subscribe({
      next: (client) => {
        if (client) {
          this.clientForm.patchValue({
            nif: client.nif,
            name: client.name,
            surname1: client.surname1,
            surname2: client.surname2,
            birthDate: client.birthDate
              ? new Date(client.birthDate).toISOString().substring(0, 10)
              : '',
            nationality: client.nationality,
            address: client.address,
            postalCode: client.postalCode,
            phoneNumber: client.phoneNumber,
          });
        }
      },
      error: (err) => {
        console.error('Error al obtener el cliente:', err);
      },
    });
  }

  async onSubmit() {
    this.clientForm.markAllAsTouched();
    if (!this.clientForm.valid) return;

    const formValue = this.clientForm.value;
    const clientUpdateData: Partial<Client> = {
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

    await firstValueFrom(
      this.clientsService.updateClient(this.clientId(), clientUpdateData)
    );

    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 3000);
  }
}
