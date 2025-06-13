import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, firstValueFrom } from 'rxjs';
import { CredentialsService } from '../../../services/credentials.service';
import { CommonModule } from '@angular/common';
import { CredentialTypeEnum } from '../../interfaces/credential-rol.enum';
import { Credential } from '../../interfaces/credential.interface';
import { RolPipe } from '@shared/pipes/rol.pipe';

@Component({
  selector: 'app-employee-edit-page',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, RolPipe],
  templateUrl: './employee-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeEditPageComponent implements OnInit {
  credentialsService = inject(CredentialsService);
  activatedRoute = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  router = inject(Router);
  credentialTypes = Object.values(CredentialTypeEnum); // ['RECEPTIONIST', 'CLEANER', 'MAINTENANCE', 'ADMIN']

  wasSaved = signal<boolean>(false);

  roleForm = this.fb.group({
    rol: [null as CredentialTypeEnum | null, [Validators.required]],
  });

  credentialId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );

  credentialResource = rxResource({
    request: () => ({
      id: this.credentialId(),
    }),
    loader: ({ request }) => {
      return this.credentialsService.getCredentialById(request.id);
    },
  });

  ngOnInit() {
    const credentialId = this.credentialId();
    this.credentialsService.getCredentialById(credentialId).subscribe({
      next: (credential) => {
        if (credential) {
          this.roleForm.patchValue({
            rol: credential.rol,
          });
        } else {
          console.warn(`Empleado con ID ${credentialId} no encontrado.`);
        }
      },
      error: (err) => {
        console.error('Error al obtener la credencial:', err);
      },
    });
  }

  async onSubmit() {
    const isValid = this.roleForm.valid;
    this.roleForm.markAllAsTouched();
    console.log('valido', isValid);
    if (!isValid) return;

    const formValue = this.roleForm.value;
    const credential = this.credentialResource.value();
    if (!credential || formValue.rol == null) return; // <-- comprobación extra

    // El backend espera el objeto completo, incluyendo password e incidents
    const updateData: Credential = {
      ...credential,
      rol: formValue.rol as CredentialTypeEnum, // <-- cast explícito
      password: credential.password ?? '',
    };

    await firstValueFrom(
      this.credentialsService.updateCredential(
        this.credentialResource.value()?.id ?? 0,
        updateData
      )
    );

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }
}
