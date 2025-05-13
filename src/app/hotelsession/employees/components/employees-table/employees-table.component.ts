import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Credential } from '../../interfaces/credential.interface';
import { CredentialsService } from '../../services/credentials.service';
import { ReusableModalComponent } from '@shared/components/reusable-modal/reusable-modal.component';

@Component({
  selector: 'employees-table',
  imports: [RouterLink, ReusableModalComponent],
  templateUrl: './employees-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesTableComponent {

  credentialsService = inject(CredentialsService);

  credentials = input.required<Credential[]>();
  credentialIdToDelete = signal<number>(0);

  openDeleteCredentialModal(credentialId: number) {
    const modalElement = document.getElementById('reusableModal');
    if (modalElement) {
      this.credentialIdToDelete.set(credentialId);
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  handleDeleteCredential() {
    this.credentialsService
      .deleteCredential(this.credentialIdToDelete())
      .subscribe({
        next: () => {
          console.log('Credencial eliminado exitosamente');
        },
        error: (err) => {
          console.log('Credencial al eliminar el hotel', err);
        },
      });
  }
}
