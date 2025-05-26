import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Credential } from '../../interfaces/credential.interface';
import { ReusableModalComponent } from '@shared/components/reusable-modal/reusable-modal.component';
import { RolPipe } from '@shared/pipes/rol.pipe';
import { CredentialsService } from '../../services/credentials.service';

@Component({
  selector: 'employees-list',
  standalone: true,
  imports: [RouterLink, ReusableModalComponent, RolPipe],
  templateUrl: './employees-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesListComponent {
  credentialsService = inject(CredentialsService);

  credentials = input.required<Credential[]>();
  credentialIdToDelete = signal<number>(0);

  @ViewChild(ReusableModalComponent)
  reusableModal!: ReusableModalComponent;

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

  //--------------------Manejo de cards desplegables------------------
  openCredentialsIds: Set<number> = new Set(); // Usamos un Set para manejar múltiples estados abiertos

  toggleCollapse(credentialId: number) {
    if (this.openCredentialsIds.has(credentialId)) {
      this.openCredentialsIds.delete(credentialId); // Si ya está abierto, lo cerramos
    } else {
      this.openCredentialsIds.add(credentialId); // Si está cerrado, lo abrimos
    }
  }

  isCredentialOpen(hotelId: number): boolean {
    return this.openCredentialsIds.has(hotelId); // Verificamos si el hotel está abierto
  }
  //-------------------------------------------------------------------
}
